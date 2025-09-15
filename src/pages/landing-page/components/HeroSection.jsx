import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e?.clientX - window.innerWidth / 2) / 25,
        y: (e?.clientY - window.innerHeight / 2) / 25
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cookingElements = [
    { icon: "ChefHat", delay: 0.2, x: 100, y: -50 },
    { icon: "Utensils", delay: 0.4, x: -120, y: -100 },
    { icon: "Coffee", delay: 0.6, x: 150, y: 100 },
    { icon: "Apple", delay: 0.8, x: -100, y: 120 },
    { icon: "Cookie", delay: 1.0, x: 200, y: -20 }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Cooking Elements */}
        {cookingElements?.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-orange-200/30"
            style={{
              left: `${50 + element?.x / 10}%`,
              top: `${50 + element?.y / 10}%`,
              x: mousePosition?.x * (index + 1) * 0.1,
              y: mousePosition?.y * (index + 1) * 0.1
            }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: [0, -20, 0],
            }}
            transition={{
              delay: element?.delay,
              duration: 0.8,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Icon name={element?.icon} size={64} color="currentColor" />
          </motion.div>
        ))}

        {/* Cooking Steam Animation */}
        <motion.div
          className="absolute top-1/4 right-1/4 opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-t from-orange-300/50 to-transparent rounded-full blur-xl" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/4 opacity-15"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            y: [0, -40, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-t from-amber-300/50 to-transparent rounded-full blur-lg" />
        </motion.div>
      </div>
      {/* Hero Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        style={{ y, opacity, scale }}
      >
        <motion.div variants={fadeInUp} className="mb-8">
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/50 mb-8 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Icon name="ChefHat" size={20} color="var(--color-primary)" />
            </motion.div>
            <span className="ml-3 text-sm font-semibold text-gray-700">Transform Your Culinary Journey</span>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-6xl md:text-8xl font-heading font-bold mb-8 leading-tight"
        >
          <motion.span 
            className="block text-gray-800"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Master the Art of
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Healthy Cooking
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Join thousands who've transformed their culinary skills with our gamified cooking challenges, 
          personalized meal planning, and interactive nutrition tracking system.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link to="/user-registration">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="default"
                size="lg"
                iconName="ChefHat"
                iconPosition="right"
                className="w-full sm:w-auto px-10 py-5 text-xl font-bold shadow-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0 rounded-full"
              >
                Start Cooking Journey
              </Button>
            </motion.div>
          </Link>
          
          <Link to="/user-login">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                iconName="LogIn"
                iconPosition="left"
                className="w-full sm:w-auto px-10 py-5 text-xl font-bold bg-white/90 backdrop-blur-sm border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full"
              >
                Sign In to Cook
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <motion.div 
            className="flex items-center justify-center space-x-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Icon name="Users" size={32} color="var(--color-success)" />
            </motion.div>
            <div className="text-left">
              <p className="text-3xl font-bold text-success">50K+</p>
              <p className="text-sm font-medium text-gray-600">Home Chefs</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center space-x-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -15, 15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Icon name="Star" size={32} color="var(--color-warning)" />
            </motion.div>
            <div className="text-left">
              <p className="text-3xl font-bold text-warning">4.9</p>
              <p className="text-sm font-medium text-gray-600">Chef Rating</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center space-x-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Icon name="Trophy" size={32} color="var(--color-primary)" />
            </motion.div>
            <div className="text-left">
              <p className="text-3xl font-bold text-primary">1M+</p>
              <p className="text-sm font-medium text-gray-600">Meals Created</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center text-gray-600 cursor-pointer group"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-sm font-medium mb-2 group-hover:text-primary transition-colors">Discover More</span>
          <motion.div
            animate={{ 
              y: [0, 8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="bg-white/80 rounded-full p-2 shadow-lg border border-orange-200"
          >
            <Icon name="ChevronDown" size={24} color="currentColor" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;