import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const features = [
    {
      id: 1,
      icon: "Calendar",
      title: "Smart Meal Planning",
      description: "AI-powered meal suggestions based on your dietary preferences, nutritional goals, and seasonal ingredients. Plan weeks ahead with automated grocery lists.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: ["Weekly meal automation", "Grocery list generation", "Dietary restriction support", "Seasonal recipe suggestions"],
      cookingElements: ["Carrot", "Beef", "Fish", "Sandwich"]
    },
    {
      id: 2,
      icon: "Gamepad2",
      title: "Interactive Cooking Games",
      description: "Learn cooking techniques through engaging challenges and mini-games. Master knife skills, timing, and flavor combinations while earning achievements.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: ["Skill-building challenges", "Achievement system", "Progress tracking", "Technique tutorials"],
      cookingElements: ["ChefHat", "Timer", "Zap", "Target"]
    },
    {
      id: 3,
      icon: "BarChart3",
      title: "Comprehensive Nutrition Tracking",
      description: "Monitor macronutrients, vitamins, and minerals with detailed analytics. Set personalized goals and track your progress with beautiful visualizations.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: ["Macro & micronutrient tracking", "Goal setting & monitoring", "Progress visualization", "Health insights"],
      cookingElements: ["TrendingUp", "Activity", "Heart", "Award"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const itemVariants = {
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

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section ref={ref} className="relative py-20 bg-gradient-to-b from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 text-orange-300">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Icon name="Apple" size={80} color="currentColor" />
          </motion.div>
        </div>
        <div className="absolute top-1/3 right-20 text-amber-300">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Icon name="Coffee" size={100} color="currentColor" />
          </motion.div>
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-yellow-300">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Icon name="Cookie" size={90} color="currentColor" />
          </motion.div>
        </div>
      </motion.div>
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          style={{ y: textY }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full mb-8 border border-orange-200"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Icon name="Utensils" size={20} color="var(--color-primary)" />
            </motion.div>
            <span className="ml-3 text-sm font-semibold text-gray-700">Powerful Culinary Features</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-heading font-bold text-gray-800 mb-8">
            Everything You Need for
            <motion.span 
              className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Cooking Success
            </motion.span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Our comprehensive culinary platform combines meal planning, cooking education, and nutrition tracking 
            to help you build lasting healthy cooking habits throughout the year.
          </p>
        </motion.div>

        <motion.div
          className="space-y-32"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features?.map((feature, index) => (
            <motion.div
              key={feature?.id}
              variants={itemVariants}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
            >
              <div className="flex-1 space-y-8 relative">
                {/* Floating Cooking Elements */}
                <div className="absolute -top-10 -right-10 opacity-20">
                  {feature?.cookingElements?.map((element, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute text-orange-400"
                      style={{
                        left: `${idx * 30}px`,
                        top: `${idx * 20}px`
                      }}
                      variants={floatingVariants}
                      animate="animate"
                      transition={{ delay: idx * 0.2 }}
                    >
                      <Icon name={element} size={24} color="currentColor" />
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="flex items-center space-x-6"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon name={feature?.icon} size={28} color="white" />
                  </motion.div>
                  <h3 className="text-4xl font-heading font-bold text-gray-800">
                    {feature?.title}
                  </h3>
                </motion.div>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature?.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature?.benefits?.map((benefit, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex items-center space-x-4 bg-white/70 p-4 rounded-xl border border-orange-100"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full"
                        animate={{ 
                          rotate: [0, 360] 
                        }}
                        transition={{ 
                          duration: 8, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: idx * 0.2 
                        }}
                      >
                        <Icon name="Check" size={16} color="white" />
                      </motion.div>
                      <span className="text-sm font-semibold text-gray-700">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="pt-6"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="inline-flex items-center space-x-3 text-primary hover:text-orange-600 font-bold text-lg transition-colors group">
                    <span>Explore {feature?.title?.toLowerCase()}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Icon name="ArrowRight" size={20} color="currentColor" />
                    </motion.div>
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
                  initial={{ rotateY: index % 2 === 0 ? -15 : 15 }}
                  whileInView={{ rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={feature?.image}
                    alt={feature?.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Animated Overlay Elements */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;