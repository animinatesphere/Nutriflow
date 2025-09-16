import React, { useState } from "react";
// import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from "../../../utils/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { Checkbox } from "../../../components/ui/Checkbox";

const RegistrationForm = ({ onSubmit, isLoading: parentLoading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    ageRange: "",
    activityLevel: "",
    primaryGoal: "",
    dietaryRestrictions: [],
    cookingExperience: "",
    subscriptionInterest: false,
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Fix: define missing state variables
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const ageRangeOptions = [
    { value: "18-24", label: "18-24 years" },
    { value: "25-34", label: "25-34 years" },
    { value: "35-44", label: "35-44 years" },
    { value: "45-54", label: "45-54 years" },
    { value: "55+", label: "55+ years" },
  ];

  const activityLevelOptions = [
    { value: "sedentary", label: "Sedentary (little to no exercise)" },
    {
      value: "lightly-active",
      label: "Lightly Active (light exercise 1-3 days/week)",
    },
    {
      value: "moderately-active",
      label: "Moderately Active (moderate exercise 3-5 days/week)",
    },
    {
      value: "very-active",
      label: "Very Active (hard exercise 6-7 days/week)",
    },
    {
      value: "extremely-active",
      label: "Extremely Active (very hard exercise, physical job)",
    },
  ];

  const primaryGoalOptions = [
    { value: "weight-loss", label: "Weight Loss" },
    { value: "weight-gain", label: "Weight Gain" },
    { value: "muscle-gain", label: "Muscle Gain" },
    { value: "maintenance", label: "Weight Maintenance" },
    { value: "general-health", label: "General Health & Wellness" },
    { value: "athletic-performance", label: "Athletic Performance" },
  ];

  const dietaryRestrictionOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten-Free" },
    { value: "dairy-free", label: "Dairy-Free" },
    { value: "keto", label: "Ketogenic" },
    { value: "paleo", label: "Paleo" },
    { value: "low-carb", label: "Low Carb" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "none", label: "No Restrictions" },
  ];

  const cookingExperienceOptions = [
    { value: "beginner", label: "Beginner (basic cooking skills)" },
    {
      value: "intermediate",
      label: "Intermediate (comfortable with most recipes)",
    },
    { value: "advanced", label: "Advanced (experienced home cook)" },
    { value: "expert", label: "Expert (professional level skills)" },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[a-z]/?.test(password)) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Real-time password strength calculation
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Real-time password confirmation validation
    if (
      field === "confirmPassword" ||
      (field === "password" && formData?.confirmPassword)
    ) {
      const passwordToCheck = field === "password" ? value : formData?.password;
      const confirmPasswordToCheck =
        field === "confirmPassword" ? value : formData?.confirmPassword;

      if (
        confirmPasswordToCheck &&
        passwordToCheck !== confirmPasswordToCheck
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData?.firstName?.trim())
      newErrors.firstName = "First name is required";
    if (!formData?.lastName?.trim())
      newErrors.lastName = "Last name is required";
    if (!formData?.email?.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData?.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData?.password) newErrors.password = "Password is required";
    else if (formData?.password?.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData?.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData?.password !== formData?.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData?.ageRange)
      newErrors.ageRange = "Please select your age range";
    if (!formData?.activityLevel)
      newErrors.activityLevel = "Please select your activity level";
    if (!formData?.primaryGoal)
      newErrors.primaryGoal = "Please select your primary goal";
    if (!formData?.cookingExperience)
      newErrors.cookingExperience = "Please select your cooking experience";

    if (!formData?.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
    if (!formData?.agreeToPrivacy)
      newErrors.agreeToPrivacy = "You must agree to the Privacy Policy";

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setNotification(null);
    setErrors({});
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
        if (profileError) {
          // Check for duplicate email error
          if (
            profileError.code === "23505" ||
            profileError.message?.includes("duplicate key value")
          ) {
            setNotification({
              type: "error",
              message:
                "Email already registered. Please log in or use a different email.",
            });
            setErrors({
              email:
                "Email already registered. Please log in or use a different email.",
            });
            return;
          }
          throw profileError;
        }
      }

      setNotification(null);
      setShowVerifyEmail(true);
      // Optionally call parent onSubmit for UI feedback
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
      setErrors({
        general: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-error";
    if (passwordStrength < 50) return "bg-warning";
    if (passwordStrength < 75) return "bg-accent";
    return "bg-success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  if (showVerifyEmail) {
    return (
      <motion.div
        className="space-y-8 p-8 max-w-lg mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon
          name="MailCheck"
          size={48}
          className="mx-auto text-primary mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="mb-6 text-muted-foreground">
          We've sent a confirmation email to{" "}
          <span className="font-semibold">{formData.email}</span>.<br />
          Please check your inbox and click the verification link to activate
          your account.
        </p>
        {!isVerified ? (
          <Button
            variant="default"
            size="lg"
            onClick={async () => {
              setIsLoading(true);
              // Check if user is verified
              const { data: userData, error: userError } =
                await supabase.auth.getUser();
              if (userError) {
                setNotification({ type: "error", message: userError.message });
              } else if (userData?.user?.email_confirmed_at) {
                setIsVerified(true);
              } else {
                setNotification({
                  type: "error",
                  message:
                    "Email not verified yet. Please check your inbox and click the link.",
                });
              }
              setIsLoading(false);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "I've Verified My Email"}
          </Button>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-lg border text-center bg-success/10 border-success/20 text-success"
            >
              Registration complete! Your email is verified.
            </motion.div>
            <Button
              variant="default"
              size="lg"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          </>
        )}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 p-4 rounded-lg border text-center ${
                notification.type === "success"
                  ? "bg-success/10 border-success/20 text-success"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
  // Registration form UI restored
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg border text-center ${
              notification.type === "success"
                ? "bg-success/10 border-success/20 text-success"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center">
          <Icon name="User" size={20} className="mr-2 text-primary" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            placeholder="Enter your first name"
            value={formData?.firstName}
            onChange={(e) => handleInputChange("firstName", e?.target?.value)}
            error={errors?.firstName}
            required
          />

          <Input
            label="Last Name"
            type="text"
            placeholder="Enter your last name"
            value={formData?.lastName}
            onChange={(e) => handleInputChange("lastName", e?.target?.value)}
            error={errors?.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange("email", e?.target?.value)}
          error={errors?.email}
          description="We'll use this for account verification and important updates"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={(e) => handleInputChange("password", e?.target?.value)}
              error={errors?.password}
              required
            />

            {formData?.password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength < 50
                        ? "text-error"
                        : passwordStrength < 75
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <div className="space-y-2">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e?.target?.value)
              }
              error={errors?.confirmPassword}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {showConfirmPassword ? "Hide password" : "Show password"}
            </button>
          </div>
        </div>
      </div>
      {/* Health & Fitness Profile Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2 text-primary" />
          Health & Fitness Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Age Range"
            placeholder="Select your age range"
            options={ageRangeOptions}
            value={formData?.ageRange}
            onChange={(value) => handleInputChange("ageRange", value)}
            error={errors?.ageRange}
            required
          />

          <Select
            label="Activity Level"
            placeholder="Select your activity level"
            options={activityLevelOptions}
            value={formData?.activityLevel}
            onChange={(value) => handleInputChange("activityLevel", value)}
            error={errors?.activityLevel}
            description="This helps us calculate your daily calorie needs"
            required
          />
        </div>

        <Select
          label="Primary Nutrition Goal"
          placeholder="What's your main nutrition goal?"
          options={primaryGoalOptions}
          value={formData?.primaryGoal}
          onChange={(value) => handleInputChange("primaryGoal", value)}
          error={errors?.primaryGoal}
          required
        />
      </div>
      {/* Preferences Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center">
          <Icon name="Settings" size={20} className="mr-2 text-primary" />
          Preferences
        </h3>

        <Select
          label="Dietary Restrictions"
          placeholder="Select any dietary restrictions"
          options={dietaryRestrictionOptions}
          value={formData?.dietaryRestrictions}
          onChange={(value) => handleInputChange("dietaryRestrictions", value)}
          multiple
          searchable
          description="Select all that apply to personalize your meal recommendations"
        />

        <Select
          label="Cooking Experience"
          placeholder="How would you rate your cooking skills?"
          options={cookingExperienceOptions}
          value={formData?.cookingExperience}
          onChange={(value) => handleInputChange("cookingExperience", value)}
          error={errors?.cookingExperience}
          description="This helps us suggest appropriate recipes and cooking games"
          required
        />

        <div className="space-y-3">
          <Checkbox
            label="I'm interested in premium subscription features"
            description="Get personalized meal plans, advanced analytics, and exclusive recipes"
            checked={formData?.subscriptionInterest}
            onChange={(e) =>
              handleInputChange("subscriptionInterest", e?.target?.checked)
            }
          />
        </div>
      </div>
      {/* Terms and Privacy Section */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="space-y-3">
          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Terms of Service
                </Link>
              </span>
            }
            checked={formData?.agreeToTerms}
            onChange={(e) =>
              handleInputChange("agreeToTerms", e?.target?.checked)
            }
            error={errors?.agreeToTerms}
            required
          />

          <Checkbox
            label={
              <span>
                I agree to the{" "}
                <Link
                  to="/privacy"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Privacy Policy
                </Link>
              </span>
            }
            checked={formData?.agreeToPrivacy}
            onChange={(e) =>
              handleInputChange("agreeToPrivacy", e?.target?.checked)
            }
            error={errors?.agreeToPrivacy}
            required
          />
        </div>
      </div>
      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          disabled={isLoading || parentLoading}
          iconName={isLoading || parentLoading ? undefined : "UserPlus"}
          iconPosition="left"
        >
          {isLoading || parentLoading ? (
            <span className="flex items-center justify-center w-full">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default RegistrationForm;
