import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import Icon from "../AppIcon";
import Button from "./Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const menuRef = useRef(null);

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/user-dashboard",
      icon: "BarChart3",
      tooltip: "View your nutrition progress and daily overview",
    },
    {
      label: "Meal Planning",
      path: "/meal-planning",
      icon: "Calendar",
      tooltip: "Plan your weekly meals and discover recipes",
    },
    {
      label: "Cooking Games",
      path: "/cooking-games",
      icon: "Gamepad2",
      tooltip: "Interactive cooking challenges and skill building",
    },
  ];

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // First, try to get the current user from Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      console.log("Header.jsx Supabase Auth User:", user);
      console.log("Header.jsx Supabase Auth Error:", authError);

      let userId = null;
      let userEmail = null;

      if (user) {
        // User is authenticated with Supabase
        userId = user.id;
        userEmail = user.email;
        console.log(
          "Header.jsx User from Supabase Auth - ID:",
          userId,
          "Email:",
          userEmail
        );
      } else {
        // Fallback to localStorage
        let userData = JSON.parse(
          localStorage.getItem("nutriflow_user") || "null"
        );
        console.log("Header.jsx localStorage userData:", userData);

        if (userData) {
          if (Array.isArray(userData)) userData = userData[0];

          // Try different possible paths for user ID
          userId = userData?.user?.id || userData?.id || userData?.user_id;
          userEmail =
            userData?.email ||
            userData?.user_metadata?.email ||
            userData?.user?.email;

          console.log(
            "Header.jsx User from localStorage - ID:",
            userId,
            "Email:",
            userEmail
          );
        }
      }

      if (!userId) {
        console.warn("Header.jsx: No user ID found, redirecting to login");
        navigate("/user-login");
        return;
      }

      // Fetch profile from Supabase
      console.log("Header.jsx: Fetching profile for user ID:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("Header.jsx Supabase profile data:", data);
      console.log("Header.jsx Supabase profile error:", error);

      let profile = null;

      if (data && !error) {
        let name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
        if (!name) name = data.email || userEmail || "User";

        profile = {
          name,
          email: data.email || userEmail,
          avatar: data.avatar_url || "/assets/images/avatar-placeholder.jpg",
          subscriptionTier: data.subscription_tier || "Free",
          dailyProgress: data.daily_progress || 0,
          ageRange: data.age_range || "",
          activityLevel: data.activity_level || "",
          primaryGoal: data.primary_goal || "",
          dietaryRestrictions: data.dietary_restrictions || "",
          cookingExperience: data.cooking_experience || "",
          subscriptionInterest: data.subscription_interest || "",
        };
      } else {
        // Profile not found or error occurred
        console.warn("Header.jsx: Profile not found, using fallback");
        profile = {
          name: userEmail || "User",
          email: userEmail || "No email",
          avatar: "/assets/images/avatar-placeholder.jpg",
          subscriptionTier: "Free",
          dailyProgress: 0,
        };

        // If error is not just "no rows returned", log it
        if (error && error.code !== "PGRST116") {
          console.error("Header.jsx: Error fetching profile:", error);
        }
      }

      setUserProfile(profile);
    } catch (err) {
      console.error("Header.jsx: Error in fetchProfile:", err);
      // Set a minimal fallback profile
      setUserProfile({
        name: "User",
        email: "No email",
        avatar: "/assets/images/avatar-placeholder.jpg",
        subscriptionTier: "Free",
        dailyProgress: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  // Also listen for auth state changes (but avoid unnecessary reloads)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Header.jsx Auth state changed:", event, session?.user?.id);
      if (event === "SIGNED_OUT") {
        setUserProfile(null);
        localStorage.removeItem("nutriflow_user");
        navigate("/user-login");
      } else if (event === "SIGNED_IN" && session?.user && !userProfile) {
        // Only refetch if we don't have user profile yet (avoid reload loop)
        fetchUserProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, userProfile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef?.current &&
        !profileRef?.current?.contains(event?.target)
      ) {
        setIsProfileOpen(false);
      }
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActivePath = (path) => location?.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("nutriflow_user");
      setUserProfile(null);
      navigate("/user-login");
    } catch (error) {
      console.error("Header.jsx: Error during logout:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Utensils" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">
              NutriFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link
          to="/user-dashboard"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Utensils" size={20} color="white" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">
            NutriFlow
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                isActivePath(item?.path)
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={item?.tooltip}
            >
              <Icon
                name={item?.icon}
                size={18}
                color={isActivePath(item?.path) ? "white" : "currentColor"}
              />
              <span className="font-body font-medium">{item?.label}</span>
              {isActivePath(item?.path) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-foreground rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-caption text-muted-foreground">
              {userProfile?.dailyProgress || 0}% daily goal
            </span>
          </div>

          {/* Subscription Badge */}
          <div className="hidden md:flex items-center px-2 py-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full border border-accent/30">
            <Icon name="Crown" size={14} color="var(--color-accent)" />
            <span className="ml-1 text-xs font-caption font-medium text-accent-foreground">
              {userProfile?.subscriptionTier || "Free"}
            </span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-heading font-semibold text-primary-foreground">
                  {userProfile?.name
                    ?.split(" ")
                    ?.map((n) => n?.[0])
                    ?.join("") || "U"}
                </span>
              </div>
              <Icon name="ChevronDown" size={16} color="currentColor" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated animate-slide-down">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-heading font-semibold text-primary-foreground">
                        {userProfile?.name
                          ?.split(" ")
                          ?.map((n) => n?.[0])
                          ?.join("") || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-body font-medium text-popover-foreground">
                        {userProfile?.name || "User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.email || "No email"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {userProfile?.subscriptionTier || "Free"} Plan
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile-settings");
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                  >
                    <Icon name="User" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">
                      Profile Settings
                    </span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors">
                    <Icon name="Settings" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">
                      Preferences
                    </span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors">
                    <Icon name="HelpCircle" size={16} color="currentColor" />
                    <span className="font-body text-popover-foreground">
                      Help & Support
                    </span>
                  </button>
                  <div className="border-t border-border my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                  >
                    <Icon name="LogOut" size={16} color="currentColor" />
                    <span className="font-body">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Icon
              name={isMenuOpen ? "X" : "Menu"}
              size={20}
              color="currentColor"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="md:hidden bg-card border-t border-border animate-slide-down"
          ref={menuRef}
        >
          <nav className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon
                  name={item?.icon}
                  size={20}
                  color={isActivePath(item?.path) ? "white" : "currentColor"}
                />
                <div>
                  <span className="font-body font-medium">{item?.label}</span>
                  <p className="text-xs opacity-75 mt-1">{item?.tooltip}</p>
                </div>
              </Link>
            ))}

            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm font-caption text-muted-foreground">
                  Daily Progress
                </span>
                <span className="text-sm font-mono font-medium text-success">
                  {userProfile?.dailyProgress || 0}%
                </span>
              </div>
              <div className="px-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${userProfile?.dailyProgress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
