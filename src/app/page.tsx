"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Component imports
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Specs from "./components/Specs";
import Roadmap from "./components/Roadmap";
import Waitlist from "./components/Waitlist";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      
      <div className="relative">
        {/* Background grid */}
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
        
        {/* Background gradients */}
        <div className="fixed inset-0 hero-bg pointer-events-none" />
        
        {/* Content sections */}
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Specs />
        <Roadmap />
        <Waitlist />
        
        {/* Footer */}
        <footer className="relative border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gradient mb-4">SenseStamp</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  One ecosystem, infinite awareness. The future of IoT security starts here.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-500">
                  <span>© 2024 SenseStamp</span>
                  <span>•</span>
                  <span>Privacy Policy</span>
                  <span>•</span>
                  <span>Terms of Service</span>
                  <span>•</span>
                  <a href="https://iotpush.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
                    Alerts by iotpush
                  </a>
                  <span>•</span>
                  <a href="https://waitlistwin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
                    Waitlist by WaitlistWin
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}