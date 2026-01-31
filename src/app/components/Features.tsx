"use client";

import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Months of Battery Life",
      description: "ESP32-C6 ultra-low power design ensures your sensors keep watching for months on a single charge",
      highlight: "6+ Months",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      title: "Wi-Fi 6 & Bluetooth 5",
      description: "Latest connectivity standards built-in. Fast, reliable, and future-proof wireless communication",
      highlight: "Wi-Fi 6",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Instant Push Alerts",
      description: "Get notifications via iotpush protocol. No proprietary app required - works with your existing setup",
      highlight: "No App Lock-in",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0v4m-4 8v-2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
        </svg>
      ),
      title: "Open Protocols",
      description: "MQTT support coming. Integrates with Home Assistant, OpenHAB, and other open smart home platforms",
      highlight: "Open Source",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Zero Subscription Fees",
      description: "Buy once, own forever. No monthly fees, no cloud dependencies, no vendor lock-in ever",
      highlight: "$0/month",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      title: "Stick Anywhere",
      description: "Doors, windows, drawers, safes, server racks, filing cabinets - if it moves, we can sense it",
      highlight: "Universal",
    },
  ];

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gradient">Revolutionary</span> Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SenseStamp combines cutting-edge hardware with open protocols to deliver 
            the IoT security experience you've been waiting for.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 relative overflow-hidden">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature highlight section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24"
        >
          <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-500/30 rounded-3xl p-12 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" className="text-emerald-400" />
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
                The Hardware That <span className="text-gradient">Changes Everything</span>
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto"
              >
                Powered by the ESP32-C6 with precision accelerometer technology, SenseStamp sensors 
                deliver enterprise-grade security in a package smaller than a coin.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-6 text-sm"
              >
                {[
                  "🔋 Ultra-low power consumption",
                  "📡 Dual-band Wi-Fi & BLE",
                  "⚡ Sub-second motion detection",
                  "🛡️ Bank-grade encryption",
                  "🌐 IPv6 ready",
                  "🔧 Over-the-air updates"
                ].map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="bg-black/30 border border-emerald-500/30 rounded-full px-4 py-2"
                  >
                    {spec}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}