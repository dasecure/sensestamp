"use client";

import { motion } from "framer-motion";

export default function Hero() {
  const scrollToWaitlist = () => {
    const element = document.getElementById("waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-emerald-400 mb-6"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Tamper-Proof IoT Event Logging
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Prove It
              <br />
              <span className="text-gradient">Happened</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-xl"
            >
              Cryptographically signed sensor events with hardware-backed proof of presence. NFC tap verification, HMAC-SHA256 attestation, and
              <span className="text-emerald-400 font-semibold"> immutable audit trails.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                onClick={scrollToWaitlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200 glow"
              >
                Join the Waitlist
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-emerald-500/30 hover:border-emerald-400 text-emerald-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-200"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex items-center space-x-6 text-sm text-gray-400"
            >
              <div className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span>
                HMAC-SHA256 signed
              </div>
              <div className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span>
                NFC tap verification
              </div>
              <div className="flex items-center">
                <span className="text-emerald-400 mr-2">✓</span>
                Public proof URLs
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Sensor visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center relative"
          >
            {/* Main sensor device */}
            <motion.div
              className="relative float"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sensor body */}
              <div className="relative w-48 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl sensor-pulse">
                {/* Top surface */}
                <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl">
                  {/* LED indicator */}
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 bg-emerald-400 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0.7)",
                        "0 0 0 10px rgba(16, 185, 129, 0)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  {/* Circuit pattern */}
                  <svg className="absolute inset-4" viewBox="0 0 100 60" fill="none">
                    <path
                      d="M10 30 L30 30 L30 20 L50 20 L50 40 L70 40 L70 30 L90 30"
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                    <circle cx="30" cy="30" r="2" fill="rgba(16, 185, 129, 0.5)" />
                    <circle cx="50" cy="20" r="2" fill="rgba(16, 185, 129, 0.5)" />
                    <circle cx="50" cy="40" r="2" fill="rgba(16, 185, 129, 0.5)" />
                    <circle cx="70" cy="30" r="2" fill="rgba(16, 185, 129, 0.5)" />
                  </svg>
                  
                  {/* Brand label */}
                  <div className="absolute bottom-2 left-2 text-xs text-emerald-400 font-mono">
                    SenseStamp
                  </div>
                </div>
                
                {/* Side edge */}
                <div className="absolute -right-1 top-1 w-1 h-30 bg-gradient-to-b from-gray-600 to-gray-800 rounded-r"></div>
              </div>

              {/* Signal waves */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ 
                    scale: [0, 2, 3],
                    opacity: [0.8, 0.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                  }}
                >
                  <div className="w-48 h-48 border-2 border-emerald-400/30 rounded-full"></div>
                </motion.div>
              ))}
            </motion.div>

            {/* Floating feature badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3 py-2"
            >
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                ESP32-C6 + NFC
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="absolute -bottom-8 -right-8 bg-black/80 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3 py-2"
            >
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                6 Month Battery
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="absolute top-12 -right-12 bg-black/80 backdrop-blur-sm border border-emerald-500/30 rounded-lg px-3 py-2"
            >
              <div className="flex items-center text-sm">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Signed Events
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}