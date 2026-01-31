"use client";

import { motion } from "framer-motion";

export default function Problem() {
  const problems = [
    {
      icon: "💰",
      title: "Subscription Fatigue",
      description: "Monthly fees for basic security features add up to hundreds per year",
    },
    {
      icon: "🏠",
      title: "Hub Dependency",
      description: "Expensive hubs that become single points of failure in your security system",
    },
    {
      icon: "🔒",
      title: "Vendor Lock-in",
      description: "Proprietary apps and protocols trap you in closed ecosystems",
    },
    {
      icon: "⚡",
      title: "Power Hungry",
      description: "Devices that drain batteries quickly, requiring constant maintenance",
    },
    {
      icon: "🛠",
      title: "Complex Setup",
      description: "Hours of configuration and technical knowledge just to get started",
    },
    {
      icon: "📱",
      title: "App Overload",
      description: "Another app cluttering your phone for each brand of smart device",
    },
  ];

  return (
    <section id="problem" className="relative py-24 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Smart Home Security is 
            <span className="text-gradient"> Broken</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Current IoT security solutions are expensive, complex, and lock you into proprietary ecosystems. 
            There has to be a better way.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-500/10">
                <div className="text-3xl mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution teaser */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-8 max-w-4xl mx-auto">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              💡
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-4">
              What if security was <span className="text-gradient">simple</span>?
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Imagine sensors that just work. No subscriptions, no hubs, no proprietary apps. 
              Just stick them anywhere and get instant notifications when something moves.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-emerald-400">
              <span>✓ Buy once, own forever</span>
              <span>•</span>
              <span>✓ Works with everything</span>
              <span>•</span>
              <span>✓ Setup in seconds</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}