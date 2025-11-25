import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { useSiteContent } from '../contexts/SiteContentContext';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const { toast } = useToast();
  const content = useSiteContent();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Nous vous répondrons bientôt !" });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="text-5xl lg:text-6xl font-black text-white mb-16">CONTACTEZ-NOUS</motion.h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Contact Info */}
            <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} className="space-y-12">
              <p className="text-white/80 text-xl leading-relaxed">Vous avez des questions ? N'hésitez pas à nous contacter. Nous serons ravis de vous répondre.</p>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-[#FF1B6D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">ADRESSE</h3>
                    <p className="text-white/70 text-lg">{content?.contactAddress || 'Ain, France'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-[#FF1B6D] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">EMAIL</h3>
                    <p className="text-white/70 text-lg">{content?.contactEmail || 'zeroundprod@gmail.com'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}>
              <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 p-8 rounded-2xl border border-gray-800">
                <div>
                  <Input placeholder="Votre nom" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} required className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-14" />
                </div>
                <div>
                  <Input type="email" placeholder="Votre email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} required className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-14" />
                </div>
                <div>
                  <Input placeholder="Sujet" value={formData.subject} onChange={(e)=>setFormData({...formData,subject:e.target.value})} required className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 h-14" />
                </div>
                <div>
                  <Textarea placeholder="Votre message" value={formData.message} onChange={(e)=>setFormData({...formData,message:e.target.value})} required rows={6} className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 resize-none" />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg h-14 rounded-lg">
                  <Send size={20} className="mr-2" />Envoyer le message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};