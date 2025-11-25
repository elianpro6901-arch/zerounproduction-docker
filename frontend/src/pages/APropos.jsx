import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSiteContent } from '../api/api';
import { FeaturesSection } from '../components/FeaturesSection';

export const APropos = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getSiteContent();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-black text-[#FF1B6D] mb-6">
              À Propos de Nous
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Nous sommes une équipe passionnée de danseurs dédiés à la culture breakdance et hip-hop.
              Notre mission est de promouvoir cet art à travers des événements, des cours et des performances.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Story Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">
                Notre Histoire
              </h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Fondé avec la passion du breakdance et de la culture urbaine, notre crew rassemble des danseurs de tous horizons unis par l'amour du mouvement et de l'expression artistique.
                </p>
                <p>
                  Nous organisons régulièrement des battles, des cours pour tous les niveaux, et des spectacles qui célèbrent la richesse de la culture hip-hop. Notre objectif est de créer une communauté soudée où chacun peut progresser et s'épanouir.
                </p>
                <p>
                  Que vous soyez débutant ou confirmé, vous êtes les bienvenus pour rejoindre notre famille et partager cette passion avec nous.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};