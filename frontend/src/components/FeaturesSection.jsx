import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Image } from 'lucide-react';
import { features } from '../mock';
import { Card, CardContent } from './ui/card';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const iconMap = {
  users: Users,
  calendar: Calendar,
  image: Image
};

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = iconMap[feature.icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
    >
      <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-none bg-white h-full">
        <CardContent className="p-8 text-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#FF1B6D]/10 rounded-full mb-6 group-hover:bg-[#FF1B6D] transition-colors duration-300"
          >
            <Icon
              size={40}
              className="text-[#FF1B6D] group-hover:text-white transition-colors duration-300"
            />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="apropos" className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Pourquoi Nous Choisir
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#FF1B6D] mx-auto"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};