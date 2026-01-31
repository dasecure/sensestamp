"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://waitlistwin.com/api/waitlist/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          waitlist_id: "e99df38d-3b85-48b0-bf79-eeb925a7bb6d",
          email: email,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        throw new Error("Failed to join waitlist");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="relative py-24 bg-gradient-to-b from-black to-gray-950">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-emerald-400 rounded-full mr-3"
              />
              Early Access Available
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            Be the First to Experience
            <br />
            <span className="text-gradient">True IoT Freedom</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Join thousands of early adopters who are ready to break free from subscription-based 
            security. Get exclusive early access pricing and be first to secure your home.
          </motion.p>

          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-lg mx-auto"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gray-900/80 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-all duration-300 text-lg"
                  />
                  <motion.div
                    className="absolute inset-0 border border-emerald-500/50 rounded-2xl pointer-events-none opacity-0"
                    whileHover={{ opacity: 1 }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !email}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 disabled:cursor-not-allowed glow-strong"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Joining Waitlist...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Reserve Your SenseStamp</span>
                    </>
                  )}
                </motion.button>
              </form>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 text-sm text-gray-400"
              >
                <p className="mb-4">🔒 Your email is safe with us. No spam, ever.</p>
                <div className="flex flex-wrap justify-center gap-6 text-xs">
                  <span>✓ Early bird pricing (up to 40% off)</span>
                  <span>✓ Exclusive updates & behind-the-scenes</span>
                  <span>✓ First access to new sensor types</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border border-emerald-500/40 rounded-3xl p-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-6"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  You're In!
                </h3>
                <p className="text-xl text-emerald-400 mb-6">
                  Welcome to the SenseStamp early access waitlist.
                </p>
                <p className="text-gray-300">
                  We'll email you with exclusive updates, early bird pricing, 
                  and first access when SenseStamp launches. 
                  <br /><br />
                  <strong>Get ready to revolutionize your security setup!</strong>
                </p>
              </div>
            </motion.div>
          )}

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid md:grid-cols-3 gap-8 text-center"
          >
            {[
              {
                number: "5,000+",
                label: "Waitlist Members",
                icon: "👥"
              },
              {
                number: "12 Months",
                label: "Battery Life Target",
                icon: "🔋"
              },
              {
                number: "$0/month",
                label: "Subscription Fees",
                icon: "💰"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}