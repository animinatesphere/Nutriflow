import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoginBackground = () => {
  const floatingElements = [
    { icon: 'Apple', size: 24, delay: 0, duration: 3 },
    { icon: 'Carrot', size: 20, delay: 0.5, duration: 4 },
    { icon: 'Fish', size: 28, delay: 1, duration: 3.5 },
    { icon: 'Wheat', size: 22, delay: 1.5, duration: 4.5 },
    { icon: 'Grape', size: 18, delay: 2, duration: 3.2 },
    { icon: 'Cherry', size: 16, delay: 2.5, duration: 4.2 }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_24%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_26%,transparent_27%,transparent_74%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05)_76%,transparent_77%,transparent)] bg-[length:20px_20px]" />
      </div>
      {/* Floating Food Icons */}
      {floatingElements?.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${10 + (index * 15)}%`,
            top: `${20 + (index * 10)}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: element?.duration,
            delay: element?.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="p-3 bg-card/20 backdrop-blur-sm rounded-full border border-border/30">
            <Icon 
              name={element?.icon} 
              size={element?.size} 
              color="var(--color-primary)" 
            />
          </div>
        </motion.div>
      ))}
      {/* Additional Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="p-4 bg-secondary/10 backdrop-blur-sm rounded-2xl border border-secondary/20">
          <Icon name="Utensils" size={32} color="var(--color-secondary)" />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/5"
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-3 bg-accent/10 backdrop-blur-sm rounded-xl border border-accent/20">
          <Icon name="ChefHat" size={28} color="var(--color-accent)" />
        </div>
      </motion.div>
      {/* Subtle Particles */}
      <div className="absolute inset-0">
        {[...Array(20)]?.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-full" />
    </div>
  );
};

export default LoginBackground;