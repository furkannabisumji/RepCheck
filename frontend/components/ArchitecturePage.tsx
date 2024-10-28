import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LevitatingLogo from '../app/logo';

const ArchitecturePage = () => {
  const FeatureCard = ({ title, items, delay }: { title: string; items: string[]; delay: number }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-blue-800/30 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 
                 rounded-xl p-6 transition-all"
    >
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="text-blue-200 flex items-start">
            <span className="mr-2 text-blue-300">•</span>
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkblue to-blue-900 text-white">
      {/* Header */}
      <div className="w-full flex justify-between items-center py-6 px-8 bg-blue-900/30 backdrop-blur-sm border-b border-blue-400/10">
        <w3m-account-button />
        <Link 
          href="/" 
          className="text-blue-200 hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <LevitatingLogo />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white mb-6"
          >
            System Architecture
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-blue-200 max-w-3xl mx-auto"
          >
            Discover how RepCheck harnesses Quicknode's powerful infrastructure to create a 
            transparent and efficient on-chain reputation system
          </motion.p>
        </div>

        {/* Architecture Diagram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16 p-8 bg-blue-800/30 backdrop-blur-sm border border-blue-400/30 rounded-2xl"
        >
          <img
            src="architecture.png"
            alt="Architecture Diagram"
            className="w-full h-auto rounded-lg"
          />
        </motion.div>

        {/* Features Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  <FeatureCard 
    title="Quicknode Streams"
    items={[
      "Real-time blockchain event monitoring",
      "High-performance data indexing",
      "Reliable transaction capture",
      "Scalable infrastructure"
    ]}
    delay={0.4}
  />
  
  <FeatureCard 
    title="Quicknode Functions"
    items={[
      "Automated point allocation system",
      "Custom filtering logic",
      "Efficient data processing",
      "Serverless architecture"
    ]}
    delay={0.5}
  />
  
  <FeatureCard 
    title="Application-Specific Rollup"
    items={[
      "Custom rollup powered by Avail",
      "Optimized for reputation tracking",
      "Enhanced scalability and throughput",
      "Reduced transaction costs"
    ]}
    delay={0.6}
  />
  
  <FeatureCard 
    title="PYUSD Integration"
    items={[
      "Stablecoin-powered point boost system",
      "Deposit-based level multipliers",
      "Secure PYUSD smart contracts",
      "Automated reward calculations"
    ]}
    delay={0.7}
  />
  
  <FeatureCard 
    title="Avail Data Availability"
    items={[
      "Decentralized data storage",
      "Light client validation",
      "Bridge security guarantees",
      "Cross-chain interoperability"
    ]}
    delay={0.8}
  />
  
  <FeatureCard 
    title="Smart Contract Infrastructure"
    items={[
      "Custom appchain reputation tracking",
      "Transparent point system",
      "Secure user registration",
      "App specific rollup chain"
    ]}
    delay={0.9}
  />
</div>

{/* Additional Tech Stack Section */}
<div className="mb-16">
  <motion.h2 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.0 }}
    className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white"
  >
    Advanced Technology Stack
  </motion.h2>
  
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.1 }}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <div className="bg-blue-800/30 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Avail Powered Rollup</h3>
      <div className="space-y-3 text-blue-200">
        <p>Our application-specific rollup leverages Avail's data availability layer to provide:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Dedicated blockchain infrastructure for reputation tracking</li>
          <li>High throughput with minimal latency</li>
          <li>Cost-effective transaction processing</li>
          <li>Secure bridge integration with mainnet</li>
        </ul>
      </div>
    </div>
    
    <div className="bg-blue-800/30 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">PYUSD Boost System</h3>
      <div className="space-y-3 text-blue-200">
        <p>Enhanced reputation building through PYUSD stablecoin integration:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Deposit PYUSD to unlock multipliers</li>
          <li>Tiered reward system based on deposit amount</li>
          <li>Automated level calculation and updates</li>
          <li>Secure stablecoin smart contracts</li>
        </ul>
      </div>
    </div>
  </motion.div>
</div>

{/* CTA Section */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.2 }}
  className="text-center"
>
  <Link 
    href="/"
    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 
               hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all 
               shadow-lg hover:shadow-xl"
  >
    Start Building Your Reputation
  </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 bg-blue-900/30 backdrop-blur-sm border-t border-blue-400/10 text-center mt-16">
        <p className="text-blue-200 text-sm">
          © {new Date().getFullYear()} RepCheck - Building Trust on Blockchain
        </p>
      </div>
    </div>
  );
};

export default ArchitecturePage;