import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import LoginBackground from './components/LoginBackground';

const UserLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('nutriflow_user');
    if (user) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Sign In - NutriFlow | Your Nutrition Journey Continues</title>
        <meta name="description" content="Sign in to NutriFlow to continue your personalized nutrition tracking, meal planning, and cooking game adventures. Secure login with social options available." />
        <meta name="keywords" content="NutriFlow login, nutrition app signin, meal planning login, cooking games access" />
        <meta property="og:title" content="Sign In - NutriFlow" />
        <meta property="og:description" content="Access your personalized nutrition dashboard and continue your healthy eating journey" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/user-login" />
      </Helmet>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Elements */}
        <LoginBackground />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-6 px-6"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/landing-page')}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                  <span className="text-lg font-heading font-bold text-primary-foreground">N</span>
                </div>
                <span className="text-xl font-heading font-bold text-foreground">NutriFlow</span>
              </motion.div>

              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => navigate('/landing-page')}
                  className="text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/user-registration')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-body font-medium"
                >
                  Sign Up
                </button>
              </nav>
            </div>
          </motion.header>

          {/* Main Login Section */}
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Welcome Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="hidden lg:block"
                >
                  <div className="max-w-lg">
                    <h1 className="text-4xl font-heading font-bold text-foreground mb-6">
                      Continue Your
                      <span className="text-primary block">Nutrition Journey</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-body mb-8 leading-relaxed">
                      Access your personalized dashboard, track your progress, and discover new recipes tailored to your goals.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
                          <div className="w-2 h-2 bg-success rounded-full" />
                        </div>
                        <span className="text-foreground font-body">Track daily nutrition goals</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-foreground font-body">Plan weekly meals effortlessly</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-full">
                          <div className="w-2 h-2 bg-secondary rounded-full" />
                        </div>
                        <span className="text-foreground font-body">Play interactive cooking games</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Column - Login Form */}
                <div className="w-full">
                  <LoginForm />
                </div>
              </div>
            </div>
          </main>

          {/* Trust Signals Section */}
          <section className="px-6 py-12 border-t border-border/50 bg-muted/20">
            <TrustSignals />
          </section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full py-6 px-6 border-t border-border/50 bg-card/30 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <p className="text-sm text-muted-foreground font-body">
                  © {new Date()?.getFullYear()} NutriFlow. All rights reserved.
                </p>
              </div>
              
              <div className="flex items-center space-x-6">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                  Privacy Policy
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                  Terms of Service
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
                  Support
                </button>
              </div>
            </div>
          </motion.footer>
        </div>
      </div>
    </>
  );
};

export default UserLogin;