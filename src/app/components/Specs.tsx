"use client";

import { motion } from "framer-motion";

export default function Specs() {
  const specs = [
    {
      category: "Hardware",
      items: [
        { label: "Processor", value: "ESP32-C6 RISC-V" },
        { label: "Motion Sensor", value: "6-axis IMU with precision accelerometer" },
        { label: "Memory", value: "512KB SRAM, 4MB Flash" },
        { label: "Dimensions", value: "25×25×8mm (coin-sized)" },
        { label: "Weight", value: "<10 grams" },
        { label: "Mounting", value: "3M adhesive backing" },
      ]
    },
    {
      category: "Connectivity",
      items: [
        { label: "Wi-Fi", value: "802.11ax (Wi-Fi 6), 2.4GHz & 5GHz" },
        { label: "Bluetooth", value: "BLE 5.0 with Long Range" },
        { label: "Range", value: "100m+ (line of sight)" },
        { label: "Security", value: "WPA3, AES-256 encryption" },
        { label: "Protocols", value: "MQTT, HTTP, WebSocket" },
        { label: "IPv6", value: "Full support" },
      ]
    },
    {
      category: "Power",
      items: [
        { label: "Battery", value: "400mAh Li-ion rechargeable" },
        { label: "Battery Life", value: "6+ months typical use" },
        { label: "Charging", value: "USB-C, 30min for 80%" },
        { label: "Sleep Mode", value: "<10μA ultra-low power" },
        { label: "Active Mode", value: "<100mA during transmission" },
        { label: "Indicator", value: "RGB LED status" },
      ]
    },
    {
      category: "Environment",
      items: [
        { label: "Temperature", value: "-20°C to +60°C" },
        { label: "Humidity", value: "10% to 90% RH" },
        { label: "Rating", value: "IP54 (splash resistant)" },
        { label: "Vibration", value: "IEC 60068-2-6 compliant" },
        { label: "Certification", value: "FCC, CE, IC" },
        { label: "Warranty", value: "2 years" },
      ]
    }
  ];

  return (
    <section id="specs" className="relative py-24 bg-gradient-to-b from-black to-gray-950/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Technical</span> Specifications
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enterprise-grade hardware in a package small enough to stick anywhere. 
            Built for reliability, designed for simplicity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {specs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-emerald-400 mb-6 flex items-center">
                <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></span>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.items.map((spec, specIndex) => (
                  <motion.div
                    key={specIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 + specIndex * 0.05 }}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                  >
                    <span className="text-gray-300 font-medium">{spec.label}</span>
                    <span className="text-white font-mono text-sm bg-emerald-500/10 px-3 py-1 rounded-full">
                      {spec.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-900/30 via-emerald-800/30 to-emerald-900/30 border border-emerald-500/30 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Animated circuit pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
              <motion.path
                d="M50 100 L150 100 L150 50 L250 50 L250 150 L350 150"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-emerald-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
              <circle cx="150" cy="100" r="4" fill="currentColor" className="text-emerald-400" />
              <circle cx="250" cy="50" r="4" fill="currentColor" className="text-emerald-400" />
              <circle cx="250" cy="150" r="4" fill="currentColor" className="text-emerald-400" />
            </svg>
          </div>

          <div className="relative z-10 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold mb-6"
            >
              Built for the <span className="text-gradient">Next Decade</span>
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto"
            >
              SenseStamp uses the latest ESP32-C6 technology with RISC-V architecture, 
              ensuring your investment stays relevant as IoT standards evolve.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: "🔋",
                  title: "6+ Month Battery",
                  description: "Ultra-low power design with intelligent sleep modes"
                },
                {
                  icon: "📡",
                  title: "Wi-Fi 6 Ready",
                  description: "Latest wireless standards for maximum reliability"
                },
                {
                  icon: "⚡",
                  title: "Sub-Second Response",
                  description: "Instant motion detection with precision sensing"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-black/30 border border-emerald-500/20 rounded-xl p-6"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}