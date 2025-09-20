import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Icon from "../../components/AppIcon";
import Image from "../../components/AppImage";
import Button from "../../components/ui/Button";
import RegistrationForm from "./components/RegistrationForm";
import SocialRegistration from "./components/SocialRegistration";
import ProgressIndicator from "./components/ProgressIndicator";
import SuccessMessage from "./components/SuccessMessage";

const UserRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const registrationSteps = [
    {
      id: "account",
      label: "Account",
      title: "Create Your Account",
      subtitle: "Join thousands of users on their nutrition journey",
      description: "Basic info",
    },
    {
      id: "verification",
      label: "Verify",
      title: "Verify Your Email",
      subtitle: "Check your inbox for the verification link",
      description: "Email check",
    },
    {
      id: "complete",
      label: "Complete",
      title: "Welcome to NutriFlow!",
      subtitle: "Your account is ready to use",
      description: "All done",
    },
  ];

  // Mock credentials for testing
  const mockCredentials = {
    testUser: {
      email: "test@nutriflow.com",
      password: "TestUser123!",
      firstName: "John",
      lastName: "Doe",
    },
    premiumUser: {
      email: "premium@nutriflow.com",
      password: "Premium123!",
      firstName: "Sarah",
      lastName: "Johnson",
    },
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const handleRegistrationSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // 1. Register user with Supabase Auth
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
      if (signUpError) throw signUpError;

      // 2. Insert profile data into profiles table
      const userId = signUpData?.user?.id || signUpData?.user?.id;
      if (userId) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: userId,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          age_range: formData.ageRange,
          activity_level: formData.activityLevel,
          primary_goal: formData.primaryGoal,
          dietary_restrictions: formData.dietaryRestrictions,
          cooking_experience: formData.cookingExperience,
          subscription_interest: formData.subscriptionInterest,
        });
        if (profileError) throw profileError;
      }

      setUserEmail(formData?.email);
      setCurrentStep(2);
      setRegistrationComplete(true);
      setTimeout(() => {
        /* ...existing code... */
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegistration = async (provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.id,
      });
      if (error) throw error;
      // On success, Supabase will redirect to your configured redirect URL
    } catch (error) {
      console.error("Social registration failed:", error);
      // Optionally show error to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);

    try {
      // Simulate resend verification email
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Verification email resent to:", userEmail);
    } catch (error) {
      console.error("Failed to resend verification:", error);
    } finally {
      setIsResending(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <SocialRegistration
              onSocialRegister={handleSocialRegistration}
              isLoading={isLoading}
            />
            <RegistrationForm
              onSubmit={handleRegistrationSubmit}
              isLoading={isLoading}
            />
          </div>
        );

      case 2:
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Icon name="Mail" size={32} color="white" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Check Your Email
              </h2>
              <p className="text-muted-foreground">
                We've sent a verification link to <strong>{userEmail}</strong>
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Didn't receive the email? Check your spam folder or click below
                to resend.
              </p>
              <Button
                variant="outline"
                onClick={handleResendVerification}
                loading={isResending}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Resend Email
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <SuccessMessage
            userEmail={userEmail}
            onResendVerification={handleResendVerification}
            isResending={isResending}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - NutriFlow | Start Your Nutrition Journey</title>
        <meta
          name="description"
          content="Join NutriFlow and start tracking your nutrition goals with personalized meal planning, cooking games, and expert guidance. Create your free account today."
        />
        <meta
          name="keywords"
          content="nutrition tracking, meal planning, healthy eating, diet tracker, cooking games, fitness nutrition"
        />
        <meta property="og:title" content="Create Account - NutriFlow" />
        <meta
          property="og:description"
          content="Start your nutrition journey with NutriFlow's comprehensive tracking and meal planning tools."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/landing-page" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Utensils" size={20} color="white" />
                </div>
                <span className="text-xl font-heading font-bold text-foreground">
                  NutriFlow
                </span>
              </Link>

              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/user-login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Hero Content */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero Image */}
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop"
                  alt="Healthy meal preparation with fresh ingredients"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    Start Your Nutrition Journey
                  </h2>
                  <p className="text-white/90">
                    Join thousands of users achieving their health goals
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  What you'll get with NutriFlow:
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      icon: "Target",
                      title: "Personalized Goals",
                      description:
                        "Custom nutrition targets based on your lifestyle and objectives",
                    },
                    {
                      icon: "Calendar",
                      title: "Smart Meal Planning",
                      description:
                        "AI-powered meal suggestions that fit your preferences and schedule",
                    },
                    {
                      icon: "Gamepad2",
                      title: "Interactive Cooking Games",
                      description:
                        "Learn cooking skills through fun, engaging challenges",
                    },
                    {
                      icon: "BarChart3",
                      title: "Progress Tracking",
                      description:
                        "Detailed analytics and insights into your nutrition journey",
                    },
                  ]?.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon
                          name={feature?.icon}
                          size={16}
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <h4 className="font-body font-medium text-foreground">
                          {feature?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {feature?.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-muted rounded-lg p-6">
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      50K+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Users
                    </div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      4.8★
                    </div>
                    <div className="text-sm text-muted-foreground">
                      User Rating
                    </div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-heading font-bold text-foreground">
                      1M+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Meals Tracked
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Registration Form */}
            <motion.div
              className="bg-card border border-border rounded-2xl p-8 shadow-soft"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {!registrationComplete && (
                <ProgressIndicator
                  currentStep={currentStep}
                  totalSteps={registrationSteps?.length}
                  steps={registrationSteps}
                />
              )}

              {renderStepContent()}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm text-muted-foreground">
                  Your data is protected with enterprise-grade security
                </span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <Link
                  to="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/help"
                  className="hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </div>
            </div>

            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} NutriFlow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default UserRegistration;
