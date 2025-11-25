import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { getEvents } from '../api/api';
import { useWebSocket } from '../hooks/useWebSocket';

const EventCard = ({ event, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-none h-full">
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
            className="absolute top-4 left-4 bg-[#FF1B6D] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
          >
            <Calendar size={16} className="inline mr-2" />
            {event.date}
          </motion.div>
        </div>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#FF1B6D] transition-colors duration-300">
            {event.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={18} className="mr-2 text-[#FF1B6D]" />
            <span className="font-medium">{event.location}</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {event.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const EventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useWebSocket(useCallback((data) => {
    if (data.type === 'events') fetchEvents();
  }, [fetchEvents]));

  if (isLoading) {
    return (
      <section id="evenements" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF1B6D] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="evenements" className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Événements à Venir
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: "6rem" } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-[#FF1B6D] mx-auto"
          />
        </motion.div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun événement pour le moment</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Button
            variant="outline"
            className="border-2 border-[#FF1B6D] text-[#FF1B6D] hover:bg-[#FF1B6D] hover:text-white font-bold text-lg px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Voir tous les événements
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};