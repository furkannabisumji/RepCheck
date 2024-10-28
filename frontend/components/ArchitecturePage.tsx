'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ArchitecturePage = () => {
  return (
    <div className="min-h-screen bg-darkblue text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">System Architecture</h1>
        <p className="text-lg text-gray-300">
          Explore how RepCheck leverages Quicknode's cutting-edge technologies to create a next-generation reputation tracking system
        </p>
      </div>

      {/* Main Architecture Diagram */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <img
            src="architecture.png"
            alt="Architecture Diagram"
            className="w-full h-auto"
          />
        </motion.div>
      </div>

      {/* Architecture Components Description */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Quicknode Streams</h3>
          <ul className="space-y-2">
            <li>• Real-time blockchain data capture</li>
            <li>• Fast and accurate transaction monitoring</li>
            <li>• Historical data access</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Quicknode Functions</h3>
          <ul className="space-y-2">
            <li>• Serverless data processing</li>
            <li>• Efficient transaction filtering</li>
            <li>• Accurate reputation point allocation</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Reputation System</h3>
          <ul className="space-y-2">
            <li>• Transparent and immutable reputation tracking</li>
            <li>• User control over on-chain credibility</li>
            <li>• Real-time reputation updates</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-blue-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-4">Blockchain Integration</h3>
          <ul className="space-y-2">
            <li>• Uniswap transaction monitoring</li>
            <li>• Real-time reputation point allocation</li>
            <li>• On-chain activity tracking</li>
          </ul>
        </motion.div>
      </div>

      {/* Navigation Button */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </motion.a>
      </div>
    </div>
  );
};

export default ArchitecturePage;