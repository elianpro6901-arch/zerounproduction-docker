import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { communitySection } from '../mock';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../contexts/SiteContentContext';

export const CommunitySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const navigate = useNavigate();
  const content = useSiteContent();
  
  const handleContact = () => {
    navigate('/contact');
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-72 h-72 bg-[#FF1B6D] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF1B6D] rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            {content?.communityTitle || communitySection.title}
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 leading-relaxed"
          >
            {content?.communityDescription || communitySection.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={handleContact}
              className="bg-[#FF1B6D] hover:bg-[#E01660] text-white font-bold text-lg px-10 py-7 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FF1B6D]/50"
            >
              {content?.communityCTA || communitySection.ctaText}
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};