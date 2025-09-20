import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

const LandingPage = () => {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    const handleSmoothScroll = (e) => {
      const target = e?.target?.getAttribute("href");
      if (target && target?.startsWith("#")) {
        e?.preventDefault();
        const element = document.querySelector(target);
        if (element) {
          element?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    // Add event listeners for smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links?.forEach((link) => {
      link?.addEventListener("click", handleSmoothScroll);
    });

    // Cleanup event listeners
    return () => {
      links?.forEach((link) => {
        link?.removeEventListener("click", handleSmoothScroll);
      });
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>
          {" "}
          NutriFlow - Transform Your Nutrition Journey with Gamified Meal
          Planning
        </title>
        <meta
          name="description"
          content="Join 50,000+ users transforming their nutrition habits with NutriFlow's gamified meal planning, interactive cooking challenges, and comprehensive tracking tools. Start your free trial today!"
        />
        <meta
          name="keywords"
          content="nutrition tracking, meal planning, cooking games, healthy eating, diet tracker, nutrition app, meal prep, healthy recipes"
        />
        <meta
          property="og:title"
          content="NutriFlow - Transform Your Nutrition Journey"
        />
        <meta
          property="og:description"
          content="Gamified nutrition tracking with interactive cooking challenges and personalized meal planning. Start free today!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nutriflow.com" />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="NutriFlow - Transform Your Nutrition Journey"
        />
        <meta
          name="twitter:description"
          content="Gamified nutrition tracking with interactive cooking challenges and personalized meal planning."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        />
        <link rel="canonical" href="https://nutriflow.com" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "NutriFlow",
            description:
              "Comprehensive nutrition tracking and meal planning application with gamification",
            url: "https://nutriflow.com",
            applicationCategory: "HealthApplication",
            operatingSystem: "Web, iOS, Android",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free trial available",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "50000",
            },
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>
      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>
      {/* Call to Action Section */}
      <CTASection />
      {/* Footer */}
      <Footer />
    </motion.div>
  );
};

export default LandingPage;
