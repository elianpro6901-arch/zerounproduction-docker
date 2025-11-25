import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export const Partenaires = () => {
  const partners = [
    { name: 'Ville de Bourg-en-Bresse', description: 'Soutien municipal' },
    { name: 'Département de l\'Ain', description: 'Partenaire institutionnel' },
    { name: 'Région Auvergne-Rhône-Alpes', description: 'Aide régionale' },
    { name: 'Ministère de la Culture', description: 'Soutien national' },
    { name: 'CAF de l\'Ain', description: 'Action sociale' },
    { name: 'MJC Bourg-en-Bresse', description: 'Partenaire culturel' },
    { name: 'Associations locales', description: 'Réseau associatif' },
    { name: 'Sponsors privés', description: 'Entreprises partenaires' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="text-center">
            <h1 className="text-5xl lg:text-6xl font-black text-[#FF1B6D] mb-6">Nos Partenaires</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Merci à nos partenaires qui soutiennent la culture urbaine</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {partners.map((partner, i) => (
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.1}} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 bg-[#FF1B6D] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-white font-black text-2xl">{partner.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-center mb-2">{partner.name}</h3>
                <p className="text-gray-600 text-sm text-center">{partner.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/contact">
              <Button className="bg-[#FF1B6D] hover:bg-[#E01660] text-white font-bold text-lg px-10 py-7 rounded-full">
                Contactez-nous <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
