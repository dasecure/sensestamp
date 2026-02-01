// Generate PDF using pdfkit (pure JS, no browser needed)
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic import after install
const PDFDocument = (await import('pdfkit')).default;

const doc = new PDFDocument({ 
  size: 'A4', 
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: 'SenseStamp POC Hardware Specification',
    Author: 'DaSecure Solutions LLC',
    Subject: 'ESP32-C6 + PN532 NFC + Battery POC',
  }
});

const out = fs.createWriteStream(path.join(__dirname, 'SenseStamp-POC-Spec.pdf'));
doc.pipe(out);

const W = 495; // usable width
const green = '#10b981';
const dark = '#0f172a';
const gray = '#374151';
const lightGray = '#64748b';

function heading(text, level = 2) {
  doc.moveDown(1);
  if (level === 1) {
    doc.fontSize(28).fillColor(dark).font('Helvetica-Bold').text(text, { align: 'center' });
  } else if (level === 2) {
    // Green left bar
    const y = doc.y;
    doc.rect(50, y, 4, 22).fill(green);
    doc.fontSize(18).fillColor(dark).font('Helvetica-Bold').text(text, 62);
  } else {
    doc.fontSize(14).fillColor('#334155').font('Helvetica-Bold').text(text);
  }
  doc.moveDown(0.3);
  doc.font('Helvetica').fillColor(gray);
}

function para(text) {
  doc.fontSize(10).fillColor(gray).font('Helvetica').text(text, { lineGap: 3 });
  doc.moveDown(0.4);
}

function bullet(text) {
  doc.fontSize(10).fillColor(gray).font('Helvetica').text(`  •  ${text}`, { lineGap: 2 });
}

function mono(text) {
  doc.moveDown(0.3);
  const y = doc.y;
  doc.rect(50, y, W, null); // placeholder
  doc.fontSize(8).fillColor('#a7f3d0').font('Courier');
  // Dark background box
  const lines = text.split('\n');
  const boxHeight = lines.length * 11 + 20;
  doc.rect(50, y, W, boxHeight).fill(dark);
  doc.fillColor('#a7f3d0');
  let cy = y + 10;
  for (const line of lines) {
    doc.text(line, 60, cy, { width: W - 20 });
    cy += 11;
  }
  doc.y = y + boxHeight + 5;
  doc.moveDown(0.3);
  doc.fillColor(gray).font('Helvetica');
}

function table(headers, rows) {
  const colW = W / headers.length;
  let y = doc.y;
  
  // Header
  doc.rect(50, y, W, 22).fill(dark);
  doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold');
  headers.forEach((h, i) => {
    doc.text(h, 55 + i * colW, y + 6, { width: colW - 10 });
  });
  y += 22;
  
  // Rows
  doc.font('Helvetica').fontSize(9);
  rows.forEach((row, ri) => {
    if (y > 750) { doc.addPage(); y = 50; }
    const bg = ri % 2 === 0 ? '#fff' : '#f8fafc';
    doc.rect(50, y, W, 20).fill(bg);
    doc.fillColor(gray);
    row.forEach((cell, i) => {
      doc.text(cell, 55 + i * colW, y + 5, { width: colW - 10 });
    });
    y += 20;
  });
  doc.y = y + 5;
}

function callout(text, warn = false) {
  const y = doc.y;
  const bg = warn ? '#fffbeb' : '#ecfdf5';
  const border = warn ? '#fcd34d' : '#a7f3d0';
  doc.rect(50, y, W, 50).fill(bg).rect(50, y, W, 50).lineWidth(1).stroke(border);
  doc.fontSize(10).fillColor(warn ? '#92400e' : '#065f46').font('Helvetica');
  doc.text(text, 62, y + 10, { width: W - 24 });
  doc.y = y + 55;
}

// ============ COVER ============
doc.moveDown(4);
doc.fontSize(48).fillColor(dark).text('🔏', { align: 'center' });
doc.moveDown(0.5);
doc.fontSize(36).fillColor(dark).font('Helvetica-Bold').text('SenseStamp', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(16).fillColor(green).font('Helvetica-Bold').text('Proof-of-Concept Hardware Specification', { align: 'center' });
doc.moveDown(0.2);
doc.fontSize(13).fillColor(lightGray).font('Helvetica').text('ESP32-C6 + PN532 NFC + Battery', { align: 'center' });
doc.moveDown(1.5);
doc.fontSize(10).fillColor(lightGray).font('Helvetica').text('DaSecure Solutions LLC · San Francisco, CA', { align: 'center' });
doc.text('Document Version 1.0 · January 31, 2026', { align: 'center' });
doc.text('CONFIDENTIAL', { align: 'center' });

// Decorative line
doc.moveDown(2);
doc.moveTo(150, doc.y).lineTo(400, doc.y).lineWidth(2).stroke(green);

// ============ PAGE 2: Overview ============
doc.addPage();
heading('1. Project Overview');
para('SenseStamp is an IoT security platform delivering tiny wireless sensors with instant push notifications — no hub, no fees, no complexity. This document specifies the Proof-of-Concept (POC) hardware build combining an ESP32-C6 microcontroller with a PN532 NFC/RFID module and LiPo battery power.');

doc.moveDown(0.3);
callout('Primary POC Goal: Proof of Presence — cryptographically prove a specific NFC tag was scanned at a specific location at a specific time, with instant cloud notification.');

heading('Target Applications', 3);
const apps = [
  ['📍 Proof of Presence', 'Scan NFC tag at location to cryptographically verify presence at a specific time. Security patrols, delivery confirmation, maintenance rounds.'],
  ['🔐 Smart Seal / Tamper Tag', 'NFC tag on doors, safes, packages. Periodic presence check — tag removed triggers instant push notification.'],
  ['🚪 Tap-to-Arm/Disarm', 'NFC card tap toggles security zone. No app needed — hotel key card experience for your security.'],
  ['🏷️ Product Authentication', 'Write signed hash to NFC tags on high-value items. Any NFC phone can verify authenticity.'],
  ['👤 Check-in System', 'Each person gets an NFC card. Tap on arrival/departure. Logs who, where, when automatically.'],
  ['🔧 Tool Checkout', 'Tagged tools + sensor at tool crib. Tap in/out tracks inventory, alerts if items don\'t return.'],
];
apps.forEach(([title, desc]) => {
  doc.fontSize(11).fillColor(dark).font('Helvetica-Bold').text(title);
  doc.fontSize(9).fillColor(lightGray).font('Helvetica').text(desc);
  doc.moveDown(0.4);
});

// ============ Architecture ============
heading('2. System Architecture');
mono(`  ┌─────────────┐     SPI Bus      ┌─────────────────┐     Wi-Fi      ┌──────────────┐
  │             │  SCK/MISO/MOSI   │                 │    802.11n    │              │
  │   PN532     │◄────────────────►│    ESP32-C6     │◄────────────►│  Cloud API   │
  │  NFC/RFID   │     + SS/IRQ     │  Microcontroller│               │  (iotpush)   │
  │             │                  │                 │               │              │
  └─────────────┘                  └────────┬────────┘               └──────┬───────┘
                                            │                               │
                                      ┌─────┴─────┐                  ┌─────┴───────┐
                                      │  TP4056   │                  │    Push     │
                                      │  Charger  │                  │  Notification│
                                      │  + LiPo   │                  │   to Phone  │
                                      └───────────┘                  └─────────────┘`);

mono(`  FLOW:  NFC Tag Tap → PN532 IRQ → ESP32 Wake → Read Tag UID → Sign Timestamp
         → Connect Wi-Fi → POST to Cloud API → Push Notification → Deep Sleep`);

// ============ Hardware ============
doc.addPage();
heading('3. Hardware Components');
heading('3.1 Bill of Materials', 3);
table(
  ['Component', 'Model / Spec', 'Qty', 'Est. Cost'],
  [
    ['Microcontroller', 'ESP32-C6 Dev Board (Seeed XIAO)', '1', '$6–8'],
    ['NFC Module', 'PN532 NFC/RFID Module', '1', '$4–6'],
    ['Battery', '3.7V LiPo, 1000mAh', '1', '$3–5'],
    ['Charger Module', 'TP4056 USB-C w/ protection', '1', '$0.50–1'],
    ['Capacitor', '100μF electrolytic', '1', '$0.10'],
    ['Breadboard', 'Half-size 400 tie-point', '1', '$2'],
    ['Jumper Wires', 'Male-to-female dupont', '~10', '$1'],
    ['NFC Tags', 'NTAG215 stickers', '5–10', '$3–5'],
    ['TOTAL', '', '', '$20–28'],
  ]
);

heading('3.2 ESP32-C6 Specifications', 3);
table(
  ['Parameter', 'Value'],
  [
    ['CPU', 'RISC-V 32-bit, single-core, 160 MHz'],
    ['Wi-Fi', '802.11b/g/n (2.4 GHz), Wi-Fi 6 ready'],
    ['Bluetooth', 'BLE 5.0 + Zigbee / Thread (802.15.4)'],
    ['Flash / SRAM', '4 MB / 512 KB'],
    ['GPIO', '22 programmable GPIOs'],
    ['Deep Sleep Current', '~5 μA'],
    ['Active Current (Wi-Fi TX)', '~300 mA peak'],
    ['Operating Voltage', '3.0–3.6V'],
  ]
);

heading('3.3 PN532 NFC Specifications', 3);
table(
  ['Parameter', 'Value'],
  [
    ['NFC Standards', 'ISO 14443A/B, ISO 18092, FeliCa'],
    ['Supported Tags', 'MIFARE Classic/Ultralight, NTAG2xx'],
    ['Interfaces', 'SPI, I2C, UART (DIP switch selectable)'],
    ['Operating Voltage', '3.3V – 5V'],
    ['Active / Standby Current', '~100 mA / ~80 μA'],
    ['Read Range', '~5 cm (tag dependent)'],
    ['Frequency', '13.56 MHz'],
  ]
);

// ============ Wiring ============
doc.addPage();
heading('4. Wiring Diagram');
heading('4.1 PN532 → ESP32-C6 (SPI Mode)', 3);
mono(`       PN532 NFC Module                          ESP32-C6 Dev Board
      ┌─────────────────┐                      ┌─────────────────────┐
      │                 │                      │                     │
      │  SCK  ──────────┼──────────────────────┤► GPIO 6   (SPI CLK) │
      │                 │                      │                     │
      │  MISO ──────────┼──────────────────────┤► GPIO 2   (SPI RX)  │
      │                 │                      │                     │
      │  MOSI ──────────┼──────────────────────┤► GPIO 7   (SPI TX)  │
      │                 │                      │                     │
      │  SS   ──────────┼──────────────────────┤► GPIO 10  (SPI CS)  │
      │                 │                      │                     │
      │  IRQ  ──────────┼──────── (optional) ──┤► GPIO 3   (WAKE)    │
      │                 │                      │                     │
      │  VCC  ──────────┼──────────────────────┤► 3V3                │
      │                 │                      │                     │
      │  GND  ──────────┼──────────────────────┤► GND                │
      └─────────────────┘                      └─────────────────────┘

      DIP Switches (PN532):  SW1: OFF  |  SW2: ON  →  SPI Mode`);

heading('4.2 Power Circuit', 3);
mono(`                                    ┌─────────────────┐
       ┌──────────┐                 │    TP4056       │
       │  3.7V    │                 │  USB-C Charger  │
       │  LiPo    │                 │  w/ Protection  │
       │ 1000mAh  │                 │                 │           ┌──────────────┐
       │  BAT+ ───┼─────────────────┤► B+          OUT+ ─────────┤► 3V3 / VIN   │
       │          │                 │                 │    ┌──┐   │   ESP32-C6   │
       │  BAT- ───┼─────────────────┤► B-          OUT- ───┤  ├───┤► GND         │
       │          │                 │                 │    └──┘   │              │
       └──────────┘                 │   USB-C IN      │   100μF  └──────────────┘
                                    └─────────────────┘`);

doc.moveDown(0.3);
callout('⚠️ Voltage Warning: Both PN532 and ESP32-C6 operate at 3.3V logic. No level shifting needed. Do NOT connect 5V to PN532 VCC.', true);

heading('4.3 Full Pin Map', 3);
table(
  ['ESP32-C6 Pin', 'Connected To', 'Function'],
  [
    ['GPIO 6', 'PN532 SCK', 'SPI Clock'],
    ['GPIO 2', 'PN532 MISO', 'SPI Master In, Slave Out'],
    ['GPIO 7', 'PN532 MOSI', 'SPI Master Out, Slave In'],
    ['GPIO 10', 'PN532 SS', 'SPI Chip Select (active low)'],
    ['GPIO 3', 'PN532 IRQ', 'Interrupt for deep sleep wake'],
    ['3V3', 'PN532 VCC, TP4056 OUT+', '3.3V power rail'],
    ['GND', 'PN532 GND, TP4056 OUT-', 'Common ground'],
  ]
);

// ============ Firmware ============
doc.addPage();
heading('5. Firmware Architecture');
heading('5.1 Boot & Runtime Flow', 3);
mono(`  ┌─────────┐     ┌──────────┐     ┌───────────┐     ┌───────────┐     ┌──────────┐
  │  DEEP   │     │  WAKE    │     │  READ     │     │  SIGN &   │     │  SEND    │
  │  SLEEP  │────►│  on IRQ  │────►│  NFC TAG  │────►│  TIMESTAMP│────►│  TO API  │
  │  (~5μA) │     │  or Timer│     │  UID      │     │  (HMAC)   │     │  (Wi-Fi) │
  └─────────┘     └──────────┘     └───────────┘     └───────────┘     └────┬─────┘
       ▲                                                                     │
       └─────────────────────────────────────────────────────────────────────┘
                                    confirm & return to deep sleep`);

heading('5.2 Key Features', 3);
bullet('Deep Sleep with IRQ Wake: ESP32-C6 sleeps at ~5μA. PN532 IRQ triggers wake on tag detect.');
bullet('Tag UID Reading: Read NFC tag unique identifier (4 or 7 byte UID) via SPI.');
bullet('Cryptographic Signing: HMAC-SHA256 of {tag_uid + device_id + timestamp}.');
bullet('Wi-Fi Connect & POST: Connect to Wi-Fi, send signed payload to cloud API.');
bullet('LED Feedback: Brief flash — green for success, red for failure.');
bullet('Timer Wake (Optional): Periodic wake for tamper-check mode.');

heading('5.3 Proof-of-Presence Payload', 3);
mono(`  {
    "device_id":  "ss-001-c6",
    "tag_uid":    "04:A2:3B:7C:D1:00:00",
    "timestamp":  1738346100,
    "location":   "warehouse-door-3",
    "signature":  "a3f8c2...e91b",
    "battery_mv": 3720,
    "fw_version": "0.1.0"
  }`);

heading('5.4 Development Stack', 3);
table(
  ['Option', 'Pros', 'Recommendation'],
  [
    ['Arduino + ESP32 Core', 'Fast prototyping, PN532 libs available', 'POC ✓'],
    ['ESP-IDF (C)', 'Full control, lower power', 'Production'],
    ['PlatformIO', 'Better tooling, same libraries', 'POC ✓'],
  ]
);

heading('5.5 Required Libraries', 3);
bullet('Adafruit_PN532 — NFC/RFID communication');
bullet('WiFi (built-in) — ESP32-C6 Wi-Fi stack');
bullet('HTTPClient (built-in) — HTTPS POST to cloud');
bullet('mbedtls (built-in) — HMAC-SHA256 signing');
bullet('ArduinoJson — JSON payload construction');

// ============ Power ============
doc.addPage();
heading('6. Power Analysis');
heading('6.1 Current Consumption', 3);
table(
  ['State', 'ESP32-C6', 'PN532', 'Total', 'Duration'],
  [
    ['Deep Sleep', '5 μA', '80 μA', '~85 μA', '99.5% of time'],
    ['Wake + NFC Read', '30 mA', '100 mA', '~130 mA', '~200 ms'],
    ['Wi-Fi TX', '300 mA', '80 μA', '~300 mA', '~2 sec'],
    ['Wi-Fi Connect', '120 mA', '80 μA', '~120 mA', '~1 sec'],
  ]
);

heading('6.2 Battery Life Estimate', 3);
callout('Scenario: 20 NFC scans/day, 1000mAh battery\nSleep: 85μA × 23.98h = 2.04 mAh/day\nActive: 20 scans × 3.2s × 200mA = 3.6 mAh/day\nTotal: ~5.6 mAh/day → ~178 days (~6 months)\nWith MOSFET PN532 power cut: 12+ months');

// ============ Security ============
heading('7. Security Considerations');
bullet('Device Key: Unique pre-shared key in ESP32-C6 flash (eFuse for production).');
bullet('HMAC Signing: Every event signed with HMAC-SHA256, preventing replay/forgery.');
bullet('TLS: All API communication over HTTPS with certificate pinning.');
bullet('Tag Cloning: POC uses UID-based. Production: NTAG 424 DNA with AES authentication.');
bullet('Timestamp Integrity: NTP sync on wake; RTC drift monitoring; server ±30s validation.');

// ============ Cloud ============
heading('8. Cloud Integration');
para('The POC integrates with iotpush (DaSecure\'s push notification platform) for the notification pipeline:');
bullet('ESP32-C6 POSTs signed JSON payload to iotpush API endpoint');
bullet('iotpush validates signature and routes notification');
bullet('Push notification delivered to mobile app and/or webhook');
bullet('Event stored in database for audit trail / proof retrieval');

// ============ Milestones ============
heading('9. POC Milestones');
table(
  ['Phase', 'Milestone', 'Description'],
  [
    ['1', 'Hardware Assembly', 'Wire ESP32-C6 + PN532 on breadboard, verify SPI'],
    ['2', 'NFC Read', 'Read NFC tag UIDs, display on serial monitor'],
    ['3', 'Wi-Fi + API', 'Connect to Wi-Fi, POST tag event to cloud'],
    ['4', 'Crypto Signing', 'HMAC-SHA256 proof-of-presence payload'],
    ['5', 'Deep Sleep', 'IRQ-based wake, power optimization'],
    ['6', 'Battery Integration', 'LiPo + TP4056, voltage monitoring'],
    ['7', 'End-to-End Demo', 'Tap tag → push notification in <3 seconds'],
  ]
);

// ============ Next Steps ============
heading('10. Next Steps (Post-POC)');
bullet('Custom PCB design (KiCad) — reduce form factor to stamp-size');
bullet('3D printed enclosure with adhesive mount');
bullet('NTAG 424 DNA support for clone-proof authentication');
bullet('BLE provisioning (instead of hardcoded Wi-Fi credentials)');
bullet('OTA firmware updates via cloud');
bullet('SenseStamp mobile app for tag management and event history');
bullet('Thread/Zigbee mesh support (ESP32-C6 native) for multi-sensor deployments');

// Footer
doc.moveDown(2);
doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.5).stroke('#e2e8f0');
doc.moveDown(0.5);
doc.fontSize(8).fillColor(lightGray).text('SenseStamp POC Specification v1.0 · DaSecure Solutions LLC · Confidential', { align: 'center' });
doc.text('sensestamp.com · dasecure.com', { align: 'center' });

doc.end();
await new Promise(resolve => out.on('finish', resolve));
console.log('PDF generated: SenseStamp-POC-Spec.pdf');
