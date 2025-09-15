import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Home Chef & Food Blogger",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c395a29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      content: "NutriFlow transformed how I approach cooking! The gamified challenges made learning new techniques so engaging. My family loves the personalized meal plans, and I've never been more confident in the kitchen.",
      rating: 5,
      cookingStyle: "Mediterranean",
      achievement: "Knife Skills Master"
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Busy Professional & Weekend Cook",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      content: "As someone with a hectic schedule, NutriFlow's meal planning is a lifesaver. The nutrition tracking helps me stay healthy while the cooking games are surprisingly addictive. I've improved my skills tremendously!",
      rating: 5,
      cookingStyle: "Quick & Healthy",
      achievement: "Meal Planning Pro"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Nutrition Student & Aspiring Chef",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      content: "The comprehensive nutrition tracking combined with interactive cooking lessons is exactly what I needed for my studies. The achievement system keeps me motivated, and I love sharing my progress with friends!",
      rating: 5,
      cookingStyle: "Plant-Based",
      achievement: "Nutrition Expert"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Cooking Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-16 text-orange-300"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <Icon name="ChefHat" size={120} color="currentColor" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-amber-300"
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon name="Utensils" size={100} color="currentColor" />
        </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-8 border border-orange-200"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Icon name="MessageCircle" size={20} color="var(--color-primary)" />
            </motion.div>
            <span className="ml-3 text-sm font-semibold text-gray-700">Chef Success Stories</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-gray-800 mb-8">
            What Home Chefs
            <motion.span 
              className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Are Saying
            </motion.span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of cooking enthusiasts who've transformed their culinary journey 
            with our comprehensive cooking and nutrition platform.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials?.map((testimonial, index) => (
            <motion.div
              key={testimonial?.id}
              variants={cardVariants}
              className="relative"
            >
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100 relative overflow-hidden"
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Background Element */}
                <motion.div
                  className="absolute top-4 right-4 text-orange-200 opacity-30"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Icon name="Quote" size={32} color="currentColor" />
                </motion.div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial?.rating)]?.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.1, duration: 0.3 }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: i * 0.2 
                        }}
                      >
                        <Icon name="Star" size={20} color="var(--color-warning)" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  "{testimonial?.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-orange-200 shadow-lg">
                      <Image
                        src={testimonial?.avatar}
                        alt={testimonial?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Icon name="ChefHat" size={12} color="white" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{testimonial?.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial?.role}</p>
                  </div>
                </div>

                {/* Cooking Style & Achievement */}
                <div className="flex flex-wrap gap-2">
                  <motion.span 
                    className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {testimonial?.cookingStyle}
                  </motion.span>
                  <motion.span 
                    className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-amber-700 text-xs font-semibold rounded-full border border-yellow-200"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    🏆 {testimonial?.achievement}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-xl text-gray-600 mb-8">
            Ready to join our community of passionate home chefs?
          </p>
          <motion.button
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon name="Users" size={20} color="white" />
            <span>Join Our Chef Community</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon name="ArrowRight" size={16} color="white" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;