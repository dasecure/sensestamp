#include "esp_camera.h"
#include <WiFi.h>
#include <ESPmDNS.h>
#include "esp_http_server.h"
#include "SD_MMC.h"
#include "img_converters.h"
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <time.h>

// Credentials live in secrets.h, which is gitignored and never committed.
// Copy secrets.example.h to secrets.h and fill it in before building.
#include "secrets.h"

// ===== AI-Thinker ESP32-CAM pin map =====
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
#define FLASH_GPIO_NUM     4

#define FLASH_LEDC_CHANNEL  1
#define FLASH_DEFAULT_LEVEL 40

// ===== SD_MMC pins (AI-Thinker 1-bit mode: CLK=14, CMD=15, D0=2) =====
#define SD_CLK_GPIO_NUM   14
#define SD_CMD_GPIO_NUM   15
#define SD_D0_GPIO_NUM     2

// ===== Motion detection =====
#define MOTION_GRID_W            20
#define MOTION_GRID_H            15
#define MOTION_PIXEL_THRESHOLD   22     // per-cell average-luma delta to count as "changed"
#define MOTION_MIN_CHANGED_CELLS 10     // out of 300 cells
#define MOTION_CHECK_INTERVAL_MS 900
#define MOTION_COOLDOWN_MS       45000  // min time between motion events (save + alert)
#define MOTION_DIR               "/motion"
#define MOTION_MAX_FILES         200    // rolling cap; oldest files deleted beyond this

// ===== iotPush =====
static const char* IOTPUSH_TOPIC   = "esp32cam";
// IOTPUSH_API_KEY is defined in secrets.h.

volatile int activeStreamClients = 0;
// Frame-rate ceiling for /stream. Smoothness is about a CONSISTENT interval, not
// peak fps, and free-running saturates anything narrower than LAN. Tunable live
// via /control?var=fps so we can match the link without a reflash.
volatile uint8_t streamMaxFps = 12;
// millis() of the last frame actually written to a stream client. The motion task
// uses this, not activeStreamClients alone, to decide whether someone is really
// watching: a client that vanishes mid-stream can leave the counter stuck above
// zero, and keying off the counter alone would disable motion detection forever.
volatile uint32_t lastStreamFrameMs = 0;
volatile uint8_t flashBrightness = FLASH_DEFAULT_LEVEL;
volatile bool sdReady = false;
volatile uint32_t motionEventCount = 0;
volatile time_t lastMotionEpoch = 0;

// Motion-detector state declared up here because /control touches it too, and
// the HTTP handlers are defined above the motion task. Volatile because these
// are written from the HTTP task and read by the motion task on the other core.
static volatile bool motionHaveBaseline = false;
// The sensor's auto-exposure/auto-gain keeps adjusting for the first few seconds
// after boot, and again after any framesize change. That shifts every cell's luma
// at once and reads as whole-frame motion, so ignore detections until it settles.
static volatile int motionWarmupFrames = 6;

const char* ssid = WIFI_SSID;          // from secrets.h
const char* password = WIFI_PASSWORD;  // from secrets.h

httpd_handle_t camera_httpd = NULL;
httpd_handle_t stream_httpd = NULL;

#define PART_BOUNDARY "123456789000000000000987654321"
static const char* STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

static const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DaSecure Cam</title>
<style>
html,body{margin:0;background:#0b0f14;height:100%;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#e6edf3}
.bar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#111820;border-bottom:1px solid #1e2830}
.bar h1{font-size:16px;margin:0;font-weight:600;letter-spacing:.3px}
.dot{width:9px;height:9px;border-radius:50%;background:#2ecc71;display:inline-block;margin-right:8px;box-shadow:0 0 8px #2ecc71}
.dot.off{background:#e74c3c;box-shadow:0 0 8px #e74c3c}
.wrap{display:flex;justify-content:center;align-items:center;padding:18px}
canvas{max-width:100%;width:960px;border-radius:10px;box-shadow:0 8px 30px rgba(0,0,0,.5);background:#000}
.led-row{display:flex;align-items:center;justify-content:center;gap:10px;padding:0 18px;color:#9aa4b0;font-size:13px}
.led-row input[type=range]{width:220px}
.led-row #ledval{min-width:2.5em;text-align:right;color:#e6edf3}
.foot{text-align:center;color:#6b7684;font-size:12px;padding:10px}
</style></head><body>
<div class="bar"><h1><span class="dot" id="dot"></span>ESP32-CAM Live</h1><span id="t" style="font-size:12px;color:#6b7684"></span></div>
<div class="wrap"><canvas id="c" width="960" height="720"></canvas></div>
<div class="led-row">
  <span>Flash</span>
  <input type="range" id="led" min="0" max="255" value="40">
  <span id="ledval">40</span>
</div>
<div class="foot">AI-Thinker ESP32-CAM &middot; served by the board itself</div>
<script>
  setInterval(function(){document.getElementById('t').textContent=new Date().toLocaleTimeString();},1000);
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var dot = document.getElementById('dot');
  var lastUrl = null;
  function indexOfSeq(buf, seq, from){
    outer: for (var i = from; i <= buf.length - seq.length; i++){
      for (var j = 0; j < seq.length; j++){ if (buf[i+j] !== seq[j]) continue outer; }
      return i;
    }
    return -1;
  }
  async function startStream(){
    dot.className = 'dot off';
    var streamUrl = 'http://' + location.hostname + ':81/stream';
    var resp = await fetch(streamUrl, {cache:'no-store'});
    if (!resp.body) throw new Error('no body');
    var reader = resp.body.getReader();
    var buf = new Uint8Array(0);
    var SOI = [0xFF,0xD8], EOI = [0xFF,0xD9];
    var gotFrame = false;
    while (true){
      var r = await reader.read();
      if (r.done) break;
      var chunk = r.value;
      var merged = new Uint8Array(buf.length + chunk.length);
      merged.set(buf); merged.set(chunk, buf.length);
      buf = merged;
      while (true){
        var start = indexOfSeq(buf, SOI, 0);
        if (start === -1){
          if (buf.length > 4) buf = buf.slice(buf.length - 4);
          break;
        }
        var end = indexOfSeq(buf, EOI, start + 2);
        if (end === -1){
          if (start > 0) buf = buf.slice(start);
          break;
        }
        var frame = buf.slice(start, end + 2);
        buf = buf.slice(end + 2);
        var blob = new Blob([frame], {type: 'image/jpeg'});
        var url = URL.createObjectURL(blob);
        (function(url){
          var img = new Image();
          img.onload = function(){
            if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
            if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);
            if (lastUrl) URL.revokeObjectURL(lastUrl);
            lastUrl = url;
            dot.className = 'dot';
          };
          img.onerror = function(){ URL.revokeObjectURL(url); };
          img.src = url;
        })(url);
        gotFrame = true;
      }
    }
    if (!gotFrame) throw new Error('stream ended with no frames');
  }
  function loop(){
    startStream().catch(function(e){
      dot.className = 'dot off';
      console.warn('stream retry:', e);
    }).finally(function(){ setTimeout(loop, 1500); });
  }
  loop();
  var ledSlider = document.getElementById('led');
  var ledVal = document.getElementById('ledval');
  var ledSendTimer = null;
  ledSlider.addEventListener('input', function(){
    ledVal.textContent = ledSlider.value;
    clearTimeout(ledSendTimer);
    ledSendTimer = setTimeout(function(){
      fetch('/led?level=' + ledSlider.value, {cache:'no-store'}).catch(function(){});
    }, 80);
  });
</script></body></html>
)rawliteral";

static esp_err_t index_handler(httpd_req_t *req){
  httpd_resp_set_type(req, "text/html");
  return httpd_resp_send(req, INDEX_HTML, strlen(INDEX_HTML));
}

static esp_err_t led_handler(httpd_req_t *req){
  char query[64];
  int level = -1;
  if (httpd_req_get_url_query_len(req) > 0 && httpd_req_get_url_query_str(req, query, sizeof(query)) == ESP_OK) {
    char val[16];
    if (httpd_query_key_value(query, "level", val, sizeof(val)) == ESP_OK) {
      level = atoi(val);
    }
  }
  if (level < 0) level = 0;
  if (level > 255) level = 255;
  flashBrightness = (uint8_t)level;
  if (activeStreamClients > 0) {
    ledcWrite(FLASH_GPIO_NUM, flashBrightness);
  }
  httpd_resp_set_type(req, "text/plain");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  return httpd_resp_send(req, "ok", 2);
}

static esp_err_t motion_status_handler(httpd_req_t *req){
  char buf[288];
  time_t now = time(NULL);
  sensor_t *s = esp_camera_sensor_get();
  snprintf(buf, sizeof(buf),
    "{\"count\":%lu,\"lastEpoch\":%lu,\"sdReady\":%s,\"streaming\":%d,\"freeHeap\":%lu,"
    "\"framesize\":%d,\"quality\":%d,\"fps\":%d}",
    (unsigned long)motionEventCount, (unsigned long)lastMotionEpoch, sdReady ? "true" : "false",
    (int)activeStreamClients, (unsigned long)ESP.getFreeHeap(),
    s ? (int)s->status.framesize : -1, s ? (int)s->status.quality : -1, (int)streamMaxFps);
  httpd_resp_set_type(req, "application/json");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  return httpd_resp_send(req, buf, strlen(buf));
}

static esp_err_t snapshot_handler(httpd_req_t *req){
  char query[80];
  char fname[64] = "";
  if (httpd_req_get_url_query_len(req) > 0 && httpd_req_get_url_query_str(req, query, sizeof(query)) == ESP_OK) {
    httpd_query_key_value(query, "file", fname, sizeof(fname));
  }
  // Reject anything that isn't a bare filename (no path traversal, no subdirectories)
  if (fname[0] == '\0' || strstr(fname, "..") != NULL || strchr(fname, '/') != NULL) {
    httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "invalid file");
    return ESP_FAIL;
  }
  if (!sdReady) {
    httpd_resp_send_err(req, HTTPD_404_NOT_FOUND, "SD not ready");
    return ESP_FAIL;
  }
  char path[96];
  snprintf(path, sizeof(path), "%s/%s", MOTION_DIR, fname);
  if (!SD_MMC.exists(path)) {
    httpd_resp_send_err(req, HTTPD_404_NOT_FOUND, "not found");
    return ESP_FAIL;
  }
  File f = SD_MMC.open(path, FILE_READ);
  if (!f) {
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "open failed");
    return ESP_FAIL;
  }
  // Read buffer lives on the heap: the httpd handler task stack is small and
  // FATFS reads are themselves stack-hungry, so a big stack buffer panics here.
  const size_t SNAP_CHUNK = 2048;
  uint8_t *buf = (uint8_t *)malloc(SNAP_CHUNK);
  if (!buf) {
    f.close();
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "no memory");
    return ESP_FAIL;
  }
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  esp_err_t res = ESP_OK;
  int n;
  while ((n = f.read(buf, SNAP_CHUNK)) > 0) {
    res = httpd_resp_send_chunk(req, (const char*)buf, n);
    if (res != ESP_OK) break;
  }
  free(buf);
  f.close();
  httpd_resp_send_chunk(req, NULL, 0);
  return res;
}

// Live camera tuning so resolution/quality/rate can be matched to the link
// without a reflash. framesize values are the esp_camera framesize_t enum:
// 6=QVGA 320x240, 10=VGA 640x480, 11=SVGA 800x600, 13=HD 1280x720, 15=UXGA.
// (Verified against this core on real hardware -- the enum gained entries in
// esp32-camera 2.x, so older docs listing SVGA as 9 are wrong here.)
// quality is the JPEG quantiser, 10 (best) to 63 (worst); higher = smaller frames.
static esp_err_t control_handler(httpd_req_t *req){
  char query[128], var[24], val[16];
  if (httpd_req_get_url_query_len(req) == 0 ||
      httpd_req_get_url_query_str(req, query, sizeof(query)) != ESP_OK ||
      httpd_query_key_value(query, "var", var, sizeof(var)) != ESP_OK ||
      httpd_query_key_value(query, "val", val, sizeof(val)) != ESP_OK) {
    httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "need ?var=&val=");
    return ESP_FAIL;
  }
  int v = atoi(val);
  sensor_t *s = esp_camera_sensor_get();
  if (!s) {
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "no sensor");
    return ESP_FAIL;
  }
  int rc = -1;
  if (!strcmp(var, "framesize")) {
    if (v < 0 || v > FRAMESIZE_UXGA) {
      httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "framesize out of range");
      return ESP_FAIL;
    }
    rc = s->set_framesize(s, (framesize_t)v);
    // Frame geometry changed, so the motion grid and its baseline are stale.
    motionHaveBaseline = false;
    motionWarmupFrames = 4;
  } else if (!strcmp(var, "quality")) {
    if (v < 10 || v > 63) {
      httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "quality must be 10-63");
      return ESP_FAIL;
    }
    rc = s->set_quality(s, v);
  } else if (!strcmp(var, "fps")) {
    if (v < 1 || v > 30) {
      httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "fps must be 1-30");
      return ESP_FAIL;
    }
    streamMaxFps = (uint8_t)v;
    rc = 0;
  } else {
    httpd_resp_send_err(req, HTTPD_400_BAD_REQUEST, "unknown var");
    return ESP_FAIL;
  }
  if (rc != 0) {
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "set failed");
    return ESP_FAIL;
  }
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  httpd_resp_set_type(req, "application/json");
  return httpd_resp_send(req, "{\"ok\":true}", 11);
}

// Single live JPEG. Stateless and short-lived, unlike /stream: a proxy can poll
// this and fan out to many viewers without the camera ever holding a long-lived
// connection, which is what wedges the stream server.
static esp_err_t capture_handler(httpd_req_t *req){
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "capture failed");
    return ESP_FAIL;
  }
  if (fb->format != PIXFORMAT_JPEG) {
    esp_camera_fb_return(fb);
    httpd_resp_send_err(req, HTTPD_500_INTERNAL_SERVER_ERROR, "not jpeg");
    return ESP_FAIL;
  }
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  httpd_resp_set_hdr(req, "Cache-Control", "no-store");
  esp_err_t res = httpd_resp_send(req, (const char*)fb->buf, fb->len);
  esp_camera_fb_return(fb);
  return res;
}

static esp_err_t stream_handler(httpd_req_t *req){
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  char part_buf[64];

  res = httpd_resp_set_type(req, STREAM_CONTENT_TYPE);
  if(res != ESP_OK) return res;
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

  // Deliberately does NOT touch the flash LED. Lighting the scene on connect
  // changed brightness enough to trip motion detection, which fired a push,
  // which held the camera buffer and wedged this very handler. Use /led instead.
  activeStreamClients++;

  uint32_t lastFrameMs = 0;
  while(true){
    // Hold the frame interval steady rather than sending as fast as the encoder
    // and TCP window allow. A stable 8fps looks smoother than a lurching 25.
    uint8_t fpsCap = streamMaxFps;
    if (fpsCap < 1) fpsCap = 1;
    uint32_t minIntervalMs = 1000 / fpsCap;
    if (lastFrameMs != 0){
      uint32_t elapsed = millis() - lastFrameMs;
      if (elapsed < minIntervalMs) vTaskDelay(pdMS_TO_TICKS(minIntervalMs - elapsed));
    }
    lastFrameMs = millis();

    fb = esp_camera_fb_get();
    if(!fb){
      res = ESP_FAIL;
    } else {
      if(res == ESP_OK) res = httpd_resp_send_chunk(req, STREAM_BOUNDARY, strlen(STREAM_BOUNDARY));
      if(res == ESP_OK){
        size_t hlen = snprintf(part_buf, 64, STREAM_PART, fb->len);
        res = httpd_resp_send_chunk(req, part_buf, hlen);
      }
      if(res == ESP_OK) res = httpd_resp_send_chunk(req, (const char *)fb->buf, fb->len);
      esp_camera_fb_return(fb);
      fb = NULL;
      if(res == ESP_OK) lastStreamFrameMs = millis();
    }
    if(res != ESP_OK) break;
  }
  activeStreamClients--;
  if(activeStreamClients < 0) activeStreamClients = 0;
  return res;
}

void startCameraServer(){
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  // Default is 4096, which is not enough once a handler touches SD/FATFS.
  config.stack_size = 10240;
  // Without these the socket has NO send timeout, so writing to a client that
  // vanished (phone off wifi, tab closed, tunnel dropped) blocks until TCP
  // finally gives up minutes later. The handler runs in the server's single
  // task, so that one dead peer wedges the whole server. Bound the wait.
  config.send_wait_timeout = 5;
  config.recv_wait_timeout = 5;
  config.lru_purge_enable = true;
  config.server_port = 80;

  httpd_uri_t index_uri = { .uri="/", .method=HTTP_GET, .handler=index_handler, .user_ctx=NULL };
  httpd_uri_t led_uri = { .uri="/led", .method=HTTP_GET, .handler=led_handler, .user_ctx=NULL };
  httpd_uri_t motion_uri = { .uri="/motion.json", .method=HTTP_GET, .handler=motion_status_handler, .user_ctx=NULL };
  httpd_uri_t snapshot_uri = { .uri="/snapshot", .method=HTTP_GET, .handler=snapshot_handler, .user_ctx=NULL };
  httpd_uri_t capture_uri = { .uri="/capture", .method=HTTP_GET, .handler=capture_handler, .user_ctx=NULL };
  httpd_uri_t control_uri = { .uri="/control", .method=HTTP_GET, .handler=control_handler, .user_ctx=NULL };

  esp_err_t r80 = httpd_start(&camera_httpd, &config);
  if (r80 == ESP_OK){
    httpd_register_uri_handler(camera_httpd, &index_uri);
    httpd_register_uri_handler(camera_httpd, &led_uri);
    httpd_register_uri_handler(camera_httpd, &motion_uri);
    httpd_register_uri_handler(camera_httpd, &snapshot_uri);
    httpd_register_uri_handler(camera_httpd, &capture_uri);
    httpd_register_uri_handler(camera_httpd, &control_uri);
  } else {
    Serial.printf("Port 80 server failed to start: %s\n", esp_err_to_name(r80));
  }

  // The stream handler never touches SD/FATFS, so give port 81 the stock stack
  // back rather than the enlarged one port 80 needs.
  config.stack_size = 4096;
  config.server_port = 81;
  config.ctrl_port = 32769;
  httpd_uri_t stream_uri = { .uri="/stream", .method=HTTP_GET, .handler=stream_handler, .user_ctx=NULL };
  esp_err_t r81 = httpd_start(&stream_httpd, &config);
  if (r81 == ESP_OK){
    httpd_register_uri_handler(stream_httpd, &stream_uri);
  } else {
    Serial.printf("Port 81 stream server failed to start: %s\n", esp_err_to_name(r81));
  }
}

// ================= SD card =================

bool mountSdCard(){
  SD_MMC.setPins(SD_CLK_GPIO_NUM, SD_CMD_GPIO_NUM, SD_D0_GPIO_NUM);
  const int freqsKhz[] = {20000, 10000, 4000};
  for (int i = 0; i < 3; i++){
    if (SD_MMC.begin("/sdcard", true, false, freqsKhz[i])){
      uint8_t cardType = SD_MMC.cardType();
      if (cardType != CARD_NONE){
        uint64_t cardSize = SD_MMC.cardSize() / (1024 * 1024);
        Serial.printf("SD card mounted at %dkHz, size: %lluMB, type: %d\n", freqsKhz[i], cardSize, cardType);
        if (!SD_MMC.exists(MOTION_DIR)) SD_MMC.mkdir(MOTION_DIR);
        return true;
      }
      Serial.println("SD_MMC mounted but no card detected");
      SD_MMC.end();
    } else {
      Serial.printf("SD mount failed at %dkHz\n", freqsKhz[i]);
    }
    delay(200);
  }
  return false;
}

void sdRolloff(){
  for (int iter = 0; iter < 5; iter++){
    File dir = SD_MMC.open(MOTION_DIR);
    if (!dir || !dir.isDirectory()){ if (dir) dir.close(); return; }
    int count = 0;
    String oldestName = "";
    File f = dir.openNextFile();
    while (f){
      if (!f.isDirectory()){
        count++;
        String nm = String(f.name());
        if (oldestName.length() == 0 || nm < oldestName) oldestName = nm;
      }
      f = dir.openNextFile();
    }
    dir.close();
    if (count <= MOTION_MAX_FILES || oldestName.length() == 0) return;
    String path = oldestName.startsWith("/") ? oldestName : (String(MOTION_DIR) + "/" + oldestName);
    SD_MMC.remove(path);
  }
}

// ================= iotPush =================

bool sendIotPushAlert(const char* title, const char* message, const char* clickUrl){
  if (WiFi.status() != WL_CONNECTED) return false;
  WiFiClientSecure client;
  client.setInsecure(); // small embedded device; skip full CA validation, transport still TLS-encrypted
  HTTPClient http;
  String url = String("https://www.iotpush.com/api/push/") + IOTPUSH_TOPIC;
  if (!http.begin(client, url)) return false;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", String("Bearer ") + IOTPUSH_API_KEY);
  String body = String("{\"title\":\"") + title + "\",\"message\":\"" + message + "\",\"priority\":\"high\"";
  if (clickUrl != NULL && clickUrl[0] != '\0') {
    body += String(",\"click_url\":\"") + clickUrl + "\"";
  }
  body += "}";
  int code = http.POST(body);
  http.end();
  if (code < 200 || code >= 300){
    Serial.printf("iotPush alert failed, HTTP %d\n", code);
    return false;
  }
  return true;
}

// ================= Motion detection =================

static uint8_t* motionRgbBuf = NULL;
static uint16_t motionRgbW = 0, motionRgbH = 0;
static uint8_t* motionPrevGrid = NULL;
static uint8_t* motionCurGrid = NULL;
static uint32_t lastMotionMs = 0;

bool ensureMotionBuffers(uint16_t w, uint16_t h){
  if (motionRgbBuf && motionRgbW == w && motionRgbH == h) return true;
  if (motionRgbBuf){ free(motionRgbBuf); motionRgbBuf = NULL; }
  size_t need = (size_t)w * (size_t)h * 3;
  motionRgbBuf = (uint8_t*)ps_malloc(need);
  if (!motionRgbBuf){
    Serial.println("Motion: failed to allocate RGB decode buffer in PSRAM; motion detection disabled");
    return false;
  }
  motionRgbW = w; motionRgbH = h;
  if (!motionPrevGrid) motionPrevGrid = (uint8_t*)malloc(MOTION_GRID_W * MOTION_GRID_H);
  if (!motionCurGrid) motionCurGrid = (uint8_t*)malloc(MOTION_GRID_W * MOTION_GRID_H);
  motionHaveBaseline = false;
  return motionPrevGrid && motionCurGrid;
}

// Takes a caller-owned copy of the JPEG, NOT the live framebuffer: everything
// below (SD write, TLS push) is slow, and the camera must not be held across it.
void onMotionDetected(const uint8_t* jpg, size_t jpgLen, int changedCells){
  motionEventCount++;
  time_t now = time(NULL);
  lastMotionEpoch = now;

  char basename[48];
  if (now > 1700000000){ // NTP has synced to a sane epoch
    struct tm t;
    localtime_r(&now, &t);
    snprintf(basename, sizeof(basename), "%04d%02d%02d_%02d%02d%02d.jpg",
             t.tm_year + 1900, t.tm_mon + 1, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec);
  } else {
    snprintf(basename, sizeof(basename), "m_%010lu.jpg", (unsigned long)millis());
  }
  char fname[64];
  snprintf(fname, sizeof(fname), "%s/%s", MOTION_DIR, basename);

  bool saved = false;
  if (sdReady){
    File file = SD_MMC.open(fname, FILE_WRITE);
    if (file){
      file.write(jpg, jpgLen);
      file.close();
      saved = true;
      sdRolloff();
    } else {
      Serial.printf("Motion: failed to open %s for write\n", fname);
    }
  }

  Serial.printf("Motion detected! zones=%d saved=%s file=%s\n", changedCells, saved ? "yes" : "no", fname);

  char msg[96];
  snprintf(msg, sizeof(msg), "Motion detected on ESP32-CAM (%d zones changed)%s",
           changedCells, saved ? "" : " - SD save failed");

  char clickUrl[96] = "";
  if (saved){
    // Use the live IP rather than esp32cam.local: mDNS resolution from phones is
    // unreliable (especially on Android), and the link is only useful on this LAN anyway.
    snprintf(clickUrl, sizeof(clickUrl), "http://%s/snapshot?file=%s",
             WiFi.localIP().toString().c_str(), basename);
  }
  sendIotPushAlert("Motion Alert", msg, clickUrl);
}

void motionDetectTask(void* param){
  for (;;){
    vTaskDelay(pdMS_TO_TICKS(MOTION_CHECK_INTERVAL_MS));

    // Someone is watching the live view. Skip detection entirely: an alert tells
    // them nothing they can't already see, and competing for camera buffers is
    // what starved the stream handler. Re-warm the baseline once they disconnect.
    // Only treat this as "someone is watching" if frames are actually still
    // going out. A client that disappears mid-stream can wedge the handler with
    // the counter stuck above zero; keying off the counter alone would then
    // silently disable motion detection until the next reboot.
    if (activeStreamClients > 0 && (millis() - lastStreamFrameMs) < 10000){
      motionHaveBaseline = false;
      motionWarmupFrames = 4;
      continue;
    }

    camera_fb_t* fb = esp_camera_fb_get();
    if (!fb) continue;
    if (fb->format != PIXFORMAT_JPEG){
      esp_camera_fb_return(fb);
      continue;
    }
    if (!ensureMotionBuffers(fb->width, fb->height)){
      esp_camera_fb_return(fb);
      continue;
    }
    if (!fmt2rgb888(fb->buf, fb->len, PIXFORMAT_JPEG, motionRgbBuf)){
      esp_camera_fb_return(fb);
      continue;
    }

    int blockW = fb->width / MOTION_GRID_W;
    int blockH = fb->height / MOTION_GRID_H;
    for (int gy = 0; gy < MOTION_GRID_H; gy++){
      for (int gx = 0; gx < MOTION_GRID_W; gx++){
        uint32_t sum = 0;
        int cnt = 0;
        int y0 = gy * blockH, x0 = gx * blockW;
        for (int y = y0; y < y0 + blockH; y += 2){
          const uint8_t* row = motionRgbBuf + ((size_t)y * fb->width + x0) * 3;
          for (int x = 0; x < blockW; x += 2){
            uint8_t r = row[x * 3], g = row[x * 3 + 1], b = row[x * 3 + 2];
            sum += (uint32_t)r + g + b;
            cnt++;
          }
        }
        motionCurGrid[gy * MOTION_GRID_W + gx] = cnt ? (uint8_t)(sum / ((uint32_t)cnt * 3)) : 0;
      }
    }

    if (motionWarmupFrames > 0){
      motionWarmupFrames--;
      memcpy(motionPrevGrid, motionCurGrid, MOTION_GRID_W * MOTION_GRID_H);
      motionHaveBaseline = true;
      esp_camera_fb_return(fb);
      continue;
    }

    int changed = 0;
    if (motionHaveBaseline){
      for (int i = 0; i < MOTION_GRID_W * MOTION_GRID_H; i++){
        int diff = (int)motionCurGrid[i] - (int)motionPrevGrid[i];
        if (diff < 0) diff = -diff;
        if (diff > MOTION_PIXEL_THRESHOLD) changed++;
      }
    }
    memcpy(motionPrevGrid, motionCurGrid, MOTION_GRID_W * MOTION_GRID_H);
    motionHaveBaseline = true;

    uint32_t now = millis();
    bool cooldownOver = (lastMotionMs == 0) || (now - lastMotionMs > MOTION_COOLDOWN_MS);
    if (changed >= MOTION_MIN_CHANGED_CELLS && cooldownOver){
      lastMotionMs = now;
      // Copy the JPEG out and hand the camera buffer back BEFORE the slow work.
      // onMotionDetected writes to SD and does a TLS POST that can take seconds;
      // holding a framebuffer across that starves the stream handler and, with
      // fb_count=2, can deadlock the camera outright.
      size_t jlen = fb->len;
      uint8_t* jcopy = (uint8_t*)ps_malloc(jlen);
      if (jcopy){
        memcpy(jcopy, fb->buf, jlen);
        esp_camera_fb_return(fb);
        fb = NULL;
        onMotionDetected(jcopy, jlen, changed);
        free(jcopy);
      } else {
        Serial.println("Motion: no PSRAM for JPEG copy, skipping this event");
      }
    }

    if (fb) esp_camera_fb_return(fb);
  }
}

// ================= Setup / loop =================

void setup(){
  Serial.begin(115200);
  Serial.setDebugOutput(false);

  // PWM on a channel separate from the camera's own XCLK channel (0), so brightness is adjustable
  ledcAttachChannel(FLASH_GPIO_NUM, 5000, 8, FLASH_LEDC_CHANNEL);
  ledcWrite(FLASH_GPIO_NUM, 0);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if(psramFound()){
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
    config.fb_location = CAMERA_FB_IN_PSRAM;
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }

  // Mount the SD card (SDMMC 1-bit mode; shares pins with the camera on AI-Thinker).
  // Falls back to progressively slower clock speeds since some card/board combos
  // don't reliably answer send_op_cond at the default (~40MHz) speed.
  sdReady = mountSdCard();
  if (!sdReady){
    Serial.println("SD card mount failed after all retries (continuing without it)");
  }

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int tries = 0;
  while (WiFi.status() != WL_CONNECTED && tries < 60) {
    delay(500);
    Serial.print(".");
    tries++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected. IP address: ");
    Serial.println(WiFi.localIP());
    if (MDNS.begin("esp32cam")) {
      Serial.println("mDNS ready: http://esp32cam.local/");
    }
    configTzTime("UTC0", "pool.ntp.org", "time.nist.gov");
  } else {
    Serial.println("WiFi FAILED to connect");
  }

  startCameraServer();
  Serial.println("Camera server started");

  xTaskCreatePinnedToCore(motionDetectTask, "motion", 16384, NULL, 1, NULL, 0);
  Serial.println("Motion detection task started");
}

void loop(){
  delay(10000);
}
