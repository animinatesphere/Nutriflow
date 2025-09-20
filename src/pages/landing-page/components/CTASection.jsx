import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cookingElements = [
    { icon: "ChefHat", x: 10, y: 20, delay: 0.2 },
    { icon: "Utensils", x: 85, y: 15, delay: 0.4 },
    { icon: "Coffee", x: 15, y: 80, delay: 0.6 },
    { icon: "Apple", x: 90, y: 75, delay: 0.8 },
    { icon: "Cookie", x: 50, y: 5, delay: 1.0 },
    { icon: "Carrot", x: 5, y: 50, delay: 1.2 },
    { icon: "Fish", x: 95, y: 45, delay: 1.4 },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {cookingElements?.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-white/20"
            style={{
              left: `${element?.x}%`,
              top: `${element?.y}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={
              isInView
                ? {
                    opacity: 0.3,
                    scale: 1,
                    rotate: 0,
                    y: [0, -30, 0],
                    x: [0, 15, 0],
                  }
                : {}
            }
            transition={{
              delay: element?.delay,
              duration: 0.8,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              },
            }}
          >
            <Icon name={element?.icon} size={60} color="currentColor" />
          </motion.div>
        ))}

        {/* Steam/Cooking Smoke Animation */}
        <motion.div
          className="absolute top-1/4 left-1/3 opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -50, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-40 h-40 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-2xl" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/4 opacity-15"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.15, 0.4, 0.15],
            y: [0, -60, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-xl" />
        </motion.div>
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon name="Zap" size={20} color="white" />
            </motion.div>
            <span className="ml-3 text-sm font-semibold text-white">
              Start Your Culinary Adventure
            </span>
          </motion.div>

          <motion.h2
            className="text-[26px] sm:text-[33px] md:text-[40px] lg:text-[50px] font-heading font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Ready to Transform
            <motion.span
              className="block text-yellow-200"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 30px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your Kitchen?
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Join thousands of home chefs mastering cooking skills, planning
            healthy meals, and building lasting culinary habits. Your culinary
            journey starts here!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/user-registration">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="default"
                  size="lg"
                  iconName="ChefHat"
                  iconPosition="right"
                  className="w-full sm:w-auto px-12 py-5 text-xl font-bold bg-white text-orange-600 hover:bg-gray-50 border-0 rounded-full shadow-2xl"
                >
                  Start Cooking Free
                </Button>
              </motion.div>
            </Link>

            <Link to="/user-login">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  iconName="LogIn"
                  iconPosition="left"
                  className="w-full sm:w-auto px-12 py-5 text-xl font-bold bg-transparent border-2 border-white text-white hover:bg-white/20 rounded-full backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon name="Zap" size={28} color="white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Instant Setup
              </h3>
              <p className="text-white/80">Start cooking in under 2 minutes</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Icon name="Shield" size={28} color="white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Free Trial</h3>
              <p className="text-white/80">No credit card required</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
                animate={{
                  y: [0, -8, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Icon name="Heart" size={28} color="white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Expert Support
              </h3>
              <p className="text-white/80">Culinary guidance every step</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
