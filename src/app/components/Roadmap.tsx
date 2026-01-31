"use client";

import { motion } from "framer-motion";

export default function Roadmap() {
  const roadmapItems = [
    {
      phase: "Phase 1",
      timeline: "Q2 2026",
      title: "Motion Sensors",
      status: "current",
      description: "Precision accelerometer-based motion detection for doors, windows, and drawers",
      features: [
        "ESP32-C6 powered sensors",
        "6+ month battery life",
        "Wi-Fi 6 & Bluetooth 5",
        "iotpush integration",
        "Open protocols (MQTT coming)"
      ],
      icon: "🚪"
    },
    {
      phase: "Phase 2", 
      timeline: "Q4 2026",
      title: "Environmental Sensors",
      status: "planned",
      description: "Temperature, humidity, and air quality monitoring for comprehensive awareness",
      features: [
        "Temperature & humidity sensing",
        "Air quality index monitoring",
        "VOC detection",
        "Smart climate alerts",
        "Integration with HVAC systems"
      ],
      icon: "🌡️"
    },
    {
      phase: "Phase 3",
      timeline: "Q2 2027", 
      title: "Audio Sensors",
      status: "planned",
      description: "Smart sound detection for glass breaking, smoke alarms, and security events",
      features: [
        "Glass break detection",
        "Smoke alarm recognition", 
        "Noise level monitoring",
        "Privacy-first audio processing",
        "Edge-based AI detection"
      ],
      icon: "🔊"
    },
    {
      phase: "Phase 4",
      timeline: "2027+",
      title: "Ecosystem Expansion", 
      status: "future",
      description: "Complete IoT security ecosystem with advanced AI and automation features",
      features: [
        "Vibration sensors",
        "Light sensors",
        "Pressure sensors",
        "Advanced AI pattern recognition",
        "Automated response actions"
      ],
      icon: "🌐"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "emerald";
      case "planned": return "blue";
      case "future": return "purple";
      default: return "gray";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "current": return "In Development";
      case "planned": return "Planned";
      case "future": return "Future Vision";
      default: return "Unknown";
    }
  };

  return (
    <section id="roadmap" className="relative py-24 bg-gradient-to-b from-gray-950/50 to-black overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            The <span className="text-gradient">Future</span> of IoT Security
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            SenseStamp is just the beginning. We're building a complete ecosystem 
            of affordable, subscription-free sensors for every security need.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-0.5 h-full w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 via-purple-500 to-gray-500" />
          
          {/* Roadmap items */}
          <div className="space-y-16">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 0 ? 'lg:text-right' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className={`hidden lg:block absolute left-1/2 top-8 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 ${
                    item.status === 'current' ? 'border-emerald-500' :
                    item.status === 'planned' ? 'border-blue-500' :
                    item.status === 'future' ? 'border-purple-500' : 'border-gray-500'
                  } bg-black z-10`}
                />

                {/* Content */}
                <div className={`${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16 lg:col-start-2'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-500/30 rounded-2xl p-8 transition-all duration-300"
                  >
                    {/* Status badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                      item.status === 'current' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'planned' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      item.status === 'future' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        item.status === 'current' ? 'bg-emerald-400' :
                        item.status === 'planned' ? 'bg-blue-400' :
                        item.status === 'future' ? 'bg-purple-400' : 'bg-gray-400'
                      }`}></span>
                      {getStatusLabel(item.status)}
                    </div>

                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                        <p className={`font-medium ${
                          item.status === 'current' ? 'text-emerald-400' :
                          item.status === 'planned' ? 'text-blue-400' :
                          item.status === 'future' ? 'text-purple-400' : 'text-gray-400'
                        }`}>
                          {item.phase} • {item.timeline}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            item.status === 'current' ? 'bg-emerald-400' :
                            item.status === 'planned' ? 'bg-blue-400' :
                            item.status === 'future' ? 'bg-purple-400' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-gray-400">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Illustration placeholder */}
                <div className={`${index % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16 lg:col-start-1 lg:row-start-1'}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.2 }}
                    className="relative"
                  >
                    {/* Sensor visualization */}
                    <div className="relative w-64 h-64 mx-auto">
                      {/* Background glow */}
                      <div className={`absolute inset-0 rounded-full blur-xl ${
                        item.status === 'current' ? 'bg-gradient-to-br from-emerald-500/20 to-transparent' :
                        item.status === 'planned' ? 'bg-gradient-to-br from-blue-500/20 to-transparent' :
                        item.status === 'future' ? 'bg-gradient-to-br from-purple-500/20 to-transparent' :
                        'bg-gradient-to-br from-gray-500/20 to-transparent'
                      }`} />
                      
                      {/* Main circle */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-8 border-2 rounded-full ${
                          item.status === 'current' ? 'border-emerald-500/30' :
                          item.status === 'planned' ? 'border-blue-500/30' :
                          item.status === 'future' ? 'border-purple-500/30' : 'border-gray-500/30'
                        }`}
                      />
                      
                      {/* Inner sensors */}
                      <div className="absolute inset-1/3 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg ${
                            item.status === 'current' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                            item.status === 'planned' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            item.status === 'future' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                            'bg-gradient-to-br from-gray-500 to-gray-600'
                          }`}
                        >
                          {item.icon}
                        </motion.div>
                      </div>

                      {/* Orbiting dots */}
                      {[...Array(6)].map((_, dotIndex) => (
                        <motion.div
                          key={dotIndex}
                          animate={{ rotate: 360 }}
                          transition={{ 
                            duration: 10 + dotIndex * 2, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: dotIndex * 0.5
                          }}
                          className={`absolute inset-0`}
                        >
                          <div 
                            className={`w-3 h-3 rounded-full absolute ${
                              item.status === 'current' ? 'bg-emerald-400' :
                              item.status === 'planned' ? 'bg-blue-400' :
                              item.status === 'future' ? 'bg-purple-400' : 'bg-gray-400'
                            }`}
                            style={{
                              top: '10%',
                              left: '50%',
                              transform: 'translateX(-50%)'
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-900/30 via-blue-900/30 to-purple-900/30 border border-gray-700/50 rounded-3xl p-12 max-w-4xl mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl lg:text-4xl font-bold mb-6"
            >
              One Ecosystem, <span className="text-gradient">Infinite Awareness</span>
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-8"
            >
              Our vision is simple: every object that matters should be smart, connected, and secure. 
              SenseStamp is building the infrastructure for a world where security is ubiquitous, 
              affordable, and owned by you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 text-sm text-emerald-400"
            >
              {[
                "🔐 Zero vendor lock-in",
                "💰 No subscription fees ever",
                "🌐 Open source protocols",
                "⚡ Ultra-low power design",
                "🛡️ Privacy-first approach"
              ].map((principle, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2"
                >
                  {principle}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}