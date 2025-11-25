import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { heroContent } from '../mock';
import { Button } from './ui/button';
import { useSiteContent } from '../contexts/SiteContentContext';

export const HeroSection = () => {
  const content = useSiteContent();
  const scrollToSection = (section) => {
    const element = document.querySelector(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="accueil" className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroContent.videoUrl} type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#FF1B6D] mb-6 tracking-tight"
          >
            {content?.heroTitle || heroContent.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-12 font-light tracking-wide"
          >
            {content?.heroSubtitle || heroContent.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Button
              onClick={() => scrollToSection('#evenements')}
              className="bg-[#FF1B6D] hover:bg-[#E01660] text-white font-bold text-base sm:text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#FF1B6D]/50"
            >
              {content?.heroPrimaryCTA || heroContent.primaryCTA}
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => scrollToSection('#videos')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-base sm:text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2" size={20} />
              {content?.heroSecondaryCTA || heroContent.secondaryCTA}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};