import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { supabase } from '../../../utils/supabaseClient';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);


  // Set your admin email(s) here
  const ADMIN_EMAILS = ['youradmin@email.com']; // Replace with your real admin email(s)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setNotification(null);
    try {
      // Supabase Auth sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
        setNotification({ type: 'error', message: 'Invalid email or password. Please try again.' });
        setIsLoading(false);
        return;
      }
      // Check if admin
      const userEmail = data?.user?.email;
      setNotification({ type: 'success', message: 'Login successful! Redirecting...' });
      setTimeout(() => {
        if (ADMIN_EMAILS.includes(userEmail)) {
          navigate('/admin/games');
        } else {
          navigate('/user-dashboard');
        }
      }, 1000);
    } catch (error) {
      setErrors({ general: 'Login failed. Please check your connection and try again.' });
      setNotification({ type: 'error', message: 'Login failed. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border border-border rounded-2xl shadow-elevated p-8">
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-lg border text-center ${
              notification.type === 'success'
                ? 'bg-success/10 border-success/20 text-success'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto mb-4">
            <Icon name="Utensils" size={32} color="white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground font-body">
            Sign in to continue your nutrition journey
          </p>
        </div>

        {/* Error Message */}
        {errors?.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-destructive)" />
              <p className="text-sm text-destructive font-body">{errors?.general}</p>
            </div>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
            </button>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 font-body font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            disabled={isLoading}
            iconName={isLoading ? undefined : 'LogIn'}
            iconPosition="left"
          >
            {isLoading ? (
              <span className="flex items-center justify-center w-full">
                <svg className="animate-spin h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-muted/50 rounded-lg border border-border"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} color="var(--color-primary)" />
            <span className="text-sm font-body font-medium text-foreground">Demo Credentials</span>
          </div>
          <div className="text-sm text-muted-foreground font-mono space-y-1">
            <p>Email: {mockCredentials?.email}</p>
            <p>Password: {mockCredentials?.password}</p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground font-body">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconName="Mail"
            iconPosition="left"
            disabled={isLoading}
          >
            Continue with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconName="Facebook"
            iconPosition="left"
            disabled={isLoading}
          >
            Continue with Facebook
          </Button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8 pt-6 border-t border-border">
          <p className="text-muted-foreground font-body">
            Don't have an account?{' '}
            <Link
              to="/user-registration"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;