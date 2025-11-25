import React from 'react';
import { motion } from 'framer-motion';
import { EventsSection } from '../components/EventsSection';

export const Evenements = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-black text-[#FF1B6D] mb-6">
              Événements
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez tous nos événements, battles et spectacles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events */}
      <EventsSection showTitle={false} />
    </div>
  );
};