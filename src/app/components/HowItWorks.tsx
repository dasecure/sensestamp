"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Stick & Connect",
      description: "Peel, stick anywhere it matters. Connect to your Wi-Fi with one tap.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      step: "02", 
      title: "Configure Alerts",
      description: "Set your notification preferences. SMS, email, webhook, or integrate with your smart home.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      step: "03",
      title: "Get Protected",
      description: "Motion detected? You'll know instantly. Battery running low? We'll tell you weeks ahead.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 bg-gradient-to-b from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Setup in <span className="text-gradient">Seconds</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            No technical expertise required. No complicated installation. 
            SenseStamp works right out of the box.
          </p>
        </motion.div>

        {/* Steps visualization */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent z-0">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    className="w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-400 origin-left"
                  />
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Step number */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full text-2xl font-bold text-white mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  {step.step}
                </motion.div>

                {/* Icon */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-emerald-400 mb-6 flex justify-center"
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto group-hover:text-gray-300 transition-colors">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Demo visualization */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Visual demo */}
            <div className="relative">
              <motion.div
                className="relative mx-auto w-80 h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Simulated phone screen */}
                <div className="absolute inset-4 bg-black rounded-2xl overflow-hidden">
                  {/* Status bar */}
                  <div className="h-8 bg-gray-900 flex items-center justify-between px-4 text-xs text-gray-400">
                    <span>9:41</span>
                    <span>SenseStamp</span>
                    <span>100%</span>
                  </div>
                  
                  {/* Notification */}
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="mx-4 mt-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs">🚪</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">Front Door</div>
                        <div className="text-xs text-emerald-400">Motion detected • Now</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Sensor list */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm text-white">Front Door</div>
                          <div className="text-xs text-gray-400">Active • 87% battery</div>
                        </div>
                      </div>
                      <div className="text-emerald-400">●</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm text-white">Kitchen Window</div>
                          <div className="text-xs text-gray-400">Quiet • 92% battery</div>
                        </div>
                      </div>
                      <div className="text-gray-500">●</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm text-white">Safe</div>
                          <div className="text-xs text-gray-400">Secure • 78% battery</div>
                        </div>
                      </div>
                      <div className="text-gray-500">●</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl">📡</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
            </div>

            {/* Right side - Benefits */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                It Really Is <span className="text-gradient">That Simple</span>
              </h3>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">No Hub Required</h4>
                    <p className="text-gray-400">Direct Wi-Fi connection means one less device to manage and no single point of failure.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Universal Notifications</h4>
                    <p className="text-gray-400">Use any notification service you prefer - SMS, email, Slack, Discord, or your smart home system.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Smart Battery Management</h4>
                    <p className="text-gray-400">Adaptive power modes and early low-battery warnings ensure you're never caught off guard.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}