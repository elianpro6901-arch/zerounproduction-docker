import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { EventsSection } from '../components/EventsSection';
import { CommunitySection } from '../components/CommunitySection';
import { getTeamMembers, getGalleryItems } from '../api/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export const Home = () => {
  const [team, setTeam] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamData, galleryData] = await Promise.all([
          getTeamMembers(),
          getGalleryItems()
        ]);
        setTeam(teamData.slice(0, 3));
        setGallery(galleryData.slice(0, 6));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <EventsSection />
      
      {/* Team Preview */}
      {team.length > 0 && (
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Notre Équipe</h2>
              <div className="w-24 h-1 bg-[#FF1B6D] mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Rencontrez les artistes passionnés de notre crew</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {team.map((member, i) => (
                <motion.div key={member.id} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6,delay:i*0.1}}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-80"><img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover"/></div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <p className="text-[#FF1B6D] font-medium">{member.role}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/equipe">
                <Button variant="outline" className="border-2 border-[#FF1B6D] text-[#FF1B6D] hover:bg-[#FF1B6D] hover:text-white">
                  Voir toute l'équipe <ArrowRight className="ml-2" size={18}/>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Galerie</h2>
              <div className="w-24 h-1 bg-[#FF1B6D] mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Nos meilleurs moments en images</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {gallery.map((item, i) => (
                <motion.div key={item.id} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.05}} className="relative group overflow-hidden rounded-lg aspect-square">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/galerie">
                <Button variant="outline" className="border-2 border-[#FF1B6D] text-[#FF1B6D] hover:bg-[#FF1B6D] hover:text-white">
                  Voir toute la galerie <ArrowRight className="ml-2" size={18}/>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <CommunitySection />
    </div>
  );
};