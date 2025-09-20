import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import Icon from "../AppIcon";
import Button from "./Button";

// Notification Component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "warning":
        return "AlertTriangle";
      default:
        return "Info";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full mx-auto`}>
      <div
        className={`flex items-center p-4 border rounded-lg shadow-lg ${getNotificationStyles()}`}
      >
        <Icon name={getIcon()} size={20} className="flex-shrink-0 mr-3" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // Get current user from Supabase Auth
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      let userId = null;
      let userEmail = null;

      if (user) {
        userId = user.id;
        userEmail = user.email;
      } else {
        // Fallback to localStorage
        let userData = JSON.parse(
          localStorage.getItem("nutriflow_user") || "null"
        );
        if (userData) {
          if (Array.isArray(userData)) userData = userData[0];
          userId = userData?.user?.id || userData?.id || userData?.user_id;
          userEmail =
            userData?.email ||
            userData?.user_metadata?.email ||
            userData?.user?.email;
        }
      }

      if (!userId) {
        navigate("/user-login");
        return;
      }

      // Fetch profile from Supabase
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      let profile = null;

      if (data && !error) {
        let name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
        if (!name) name = data.email || userEmail || "User";

        profile = {
          id: data.id,
          name,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
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
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          notifications: data.notifications || true,
          privacy: data.privacy || "public",
        };
      } else {
        // Profile not found - create basic profile
        profile = {
          name: userEmail || "User",
          first_name: "",
          last_name: "",
          email: userEmail || "",
          avatar: "/assets/images/avatar-placeholder.jpg",
          subscriptionTier: "Free",
          dailyProgress: 0,
          ageRange: "",
          activityLevel: "",
          primaryGoal: "",
          dietaryRestrictions: "",
          cookingExperience: "",
          subscriptionInterest: "",
          phone: "",
          location: "",
          bio: "",
          notifications: true,
          privacy: "public",
        };
      }

      setUserProfile(profile);
      setFormData(profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      showNotification(
        "error",
        "Failed to load profile data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/user-login");
        return;
      }

      // Update profile in Supabase
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        age_range: formData.ageRange,
        activity_level: formData.activityLevel,
        primary_goal: formData.primaryGoal,
        dietary_restrictions: formData.dietaryRestrictions,
        cooking_experience: formData.cookingExperience,
        subscription_interest: formData.subscriptionInterest,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        notifications: formData.notifications,
        privacy: formData.privacy,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error updating profile:", error);
        showNotification("error", "Error saving profile. Please try again.");
        return;
      }

      // Update local state
      setUserProfile(formData);
      setEditing(false);
      showNotification("success", "Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      showNotification("error", "Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 sm:pt-20 px-3 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 sm:h-8 bg-muted rounded w-1/2 sm:w-1/3"></div>
            <div className="h-24 sm:h-32 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20 px-3 sm:px-6">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
            >
              <Icon name="ArrowLeft" size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground truncate">
              Profile Settings
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  {saving ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Save Changes</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setEditing(true)}
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                <Icon
                  name="Edit2"
                  size={14}
                  className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
                />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0 self-center sm:self-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-heading font-bold text-primary-foreground">
                {userProfile?.name
                  ?.split(" ")
                  ?.map((n) => n?.[0])
                  ?.join("") || "U"}
              </div>
              <button className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary hover:underline block w-full text-center sm:text-left">
                Change Photo
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-3 sm:space-y-4 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-foreground truncate">
                      {userProfile?.first_name || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm sm:text-base text-foreground truncate">
                      {userProfile?.last_name || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                  Email Address
                </label>
                <p className="text-sm sm:text-base text-foreground truncate">
                  {userProfile?.email || "adeyemipelumi1980@gmail.com"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>
            </div>

            {/* Subscription Badge */}
            <div className="flex-shrink-0 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-3 sm:p-4 border border-accent/30">
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1 sm:mb-2">
                  <Icon
                    name="Crown"
                    size={14}
                    className="sm:w-4 sm:h-4"
                    color="var(--color-accent)"
                  />
                  <span className="text-xs sm:text-sm font-medium text-accent-foreground">
                    {userProfile?.subscriptionTier || "Free"} Plan
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
                  Daily Progress: {userProfile?.dailyProgress || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Health & Fitness Information */}
        <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-4 sm:mb-6">
            Health & Fitness Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Age Range
              </label>
              {editing ? (
                <select
                  value={formData.ageRange || ""}
                  onChange={(e) =>
                    handleInputChange("ageRange", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55-64">55-64</option>
                  <option value="65+">65+</option>
                </select>
              ) : (
                <p className="text-sm sm:text-base text-foreground">
                  {userProfile?.ageRange || "18-24"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Activity Level
              </label>
              {editing ? (
                <select
                  value={formData.activityLevel || ""}
                  onChange={(e) =>
                    handleInputChange("activityLevel", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select activity level</option>
                  <option value="sedentary">
                    Sedentary (little/no exercise)
                  </option>
                  <option value="light">
                    Light (light exercise 1-3 days/week)
                  </option>
                  <option value="moderate">
                    Moderate (moderate exercise 3-5 days/week)
                  </option>
                  <option value="active">
                    Active (hard exercise 6-7 days/week)
                  </option>
                  <option value="very-active">
                    Very Active (physical job + exercise)
                  </option>
                </select>
              ) : (
                <p className="text-sm sm:text-base text-foreground capitalize">
                  {userProfile?.activityLevel || "sedentary"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Primary Goal
              </label>
              {editing ? (
                <select
                  value={formData.primaryGoal || ""}
                  onChange={(e) =>
                    handleInputChange("primaryGoal", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select primary goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="weight-gain">Weight Gain</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general-health">General Health</option>
                </select>
              ) : (
                <p className="text-sm sm:text-base text-foreground capitalize">
                  {userProfile?.primaryGoal?.replace("-", " ") || "weight-loss"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Cooking Experience
              </label>
              {editing ? (
                <select
                  value={formData.cookingExperience || ""}
                  onChange={(e) =>
                    handleInputChange("cookingExperience", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              ) : (
                <p className="text-sm sm:text-base text-foreground capitalize">
                  {userProfile?.cookingExperience || "beginner"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
              Dietary Restrictions
            </label>
            {editing ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {[
                  "vegetarian",
                  "vegan",
                  "gluten-free",
                  "dairy-free",
                  "nut-free",
                  "keto",
                  "paleo",
                  "mediterranean",
                ].map((diet) => {
                  const currentRestrictions =
                    typeof formData.dietaryRestrictions === "string"
                      ? formData.dietaryRestrictions.split(",").filter(Boolean)
                      : [];

                  return (
                    <label key={diet} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={currentRestrictions.includes(diet)}
                        onChange={(e) => {
                          const current =
                            typeof formData.dietaryRestrictions === "string"
                              ? formData.dietaryRestrictions
                              : "";
                          const diets = current.split(",").filter(Boolean);
                          if (e.target.checked) {
                            diets.push(diet);
                          } else {
                            const index = diets.indexOf(diet);
                            if (index > -1) diets.splice(index, 1);
                          }
                          handleInputChange(
                            "dietaryRestrictions",
                            diets.join(",")
                          );
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-xs sm:text-sm capitalize">
                        {diet.replace("-", " ")}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-foreground">
                {userProfile?.dietaryRestrictions &&
                typeof userProfile.dietaryRestrictions === "string"
                  ? userProfile.dietaryRestrictions
                      .split(",")
                      .filter(Boolean)
                      .join(", ")
                  : "vegetarian, vegan, gluten-free"}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-4 sm:mb-6">
            Additional Information
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground">
                  {userProfile?.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Location
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter your location"
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground">
                  {userProfile?.location || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Bio
              </label>
              {editing ? (
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                  placeholder="Tell us about yourself, your fitness journey, or goals..."
                />
              ) : (
                <p className="text-sm sm:text-base text-foreground">
                  {userProfile?.bio || "No bio provided yet. Share your story!"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1 sm:mb-2">
                Subscription Interest
              </label>
              {editing ? (
                <select
                  value={formData.subscriptionInterest || ""}
                  onChange={(e) =>
                    handleInputChange("subscriptionInterest", e.target.value)
                  }
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select interest level</option>
                  <option value="very-interested">Very Interested</option>
                  <option value="somewhat-interested">
                    Somewhat Interested
                  </option>
                  <option value="maybe-later">Maybe Later</option>
                  <option value="not-interested">Not Interested</option>
                </select>
              ) : (
                <p className="text-sm sm:text-base text-foreground">
                  {typeof formData.subscriptionInterest === "string" &&
                  formData.subscriptionInterest
                    ? formData.subscriptionInterest.replace(/-/g, " ")
                    : "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-card rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-4 sm:mb-6">
            Account Settings
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Email Notifications
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Receive updates about your nutrition goals and meal plans
                </p>
              </div>
              {editing ? (
                <input
                  type="checkbox"
                  checked={formData.notifications || false}
                  onChange={(e) =>
                    handleInputChange("notifications", e.target.checked)
                  }
                  className="rounded border-border flex-shrink-0"
                />
              ) : (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    userProfile?.notifications
                      ? "bg-success/20 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {userProfile?.notifications ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>

            <div className="flex items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  Profile Privacy
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Control who can see your profile information
                </p>
              </div>
              {editing ? (
                <select
                  value={formData.privacy || "public"}
                  onChange={(e) => handleInputChange("privacy", e.target.value)}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-border rounded-md sm:rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent flex-shrink-0"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              ) : (
                <span className="capitalize text-sm sm:text-base text-foreground flex-shrink-0">
                  {userProfile?.privacy || "public"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
