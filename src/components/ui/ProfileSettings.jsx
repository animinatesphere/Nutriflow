import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import Icon from "../AppIcon";
import Button from "./Button";

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
        alert("Error saving profile. Please try again.");
        return;
      }

      // Update local state
      setUserProfile(formData);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile. Please try again.");
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
      <div className="min-h-screen bg-background pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
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
    <div className="min-h-screen bg-background pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Profile Settings
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {editing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[100px]"
                >
                  {saving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Icon name="Edit2" size={16} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-2xl font-heading font-bold text-primary-foreground">
                {userProfile?.name
                  ?.split(" ")
                  ?.map((n) => n?.[0])
                  ?.join("") || "U"}
              </div>
              <button className="mt-3 text-sm text-primary hover:underline">
                Change Photo
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  ) : (
                    <p className="text-foreground">
                      {userProfile?.first_name || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  ) : (
                    <p className="text-foreground">
                      {userProfile?.last_name || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <p className="text-foreground">
                  {userProfile?.email || "adeyemipelumi1980@gmail.com"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed here. Contact support if needed.
                </p>
              </div>
            </div>

            {/* Subscription Badge */}
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-4 border border-accent/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Crown" size={16} color="var(--color-accent)" />
                  <span className="text-sm font-medium text-accent-foreground">
                    {userProfile?.subscriptionTier || "Free"} Plan
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Daily Progress: {userProfile?.dailyProgress || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Health & Fitness Information */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
            Health & Fitness Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Age Range
              </label>
              {editing ? (
                <select
                  value={formData.ageRange || ""}
                  onChange={(e) =>
                    handleInputChange("ageRange", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
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
                <p className="text-foreground">
                  {userProfile?.ageRange || "18-24"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Activity Level
              </label>
              {editing ? (
                <select
                  value={formData.activityLevel || ""}
                  onChange={(e) =>
                    handleInputChange("activityLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
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
                <p className="text-foreground capitalize">
                  {userProfile?.activityLevel || "sedentary"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Primary Goal
              </label>
              {editing ? (
                <select
                  value={formData.primaryGoal || ""}
                  onChange={(e) =>
                    handleInputChange("primaryGoal", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select primary goal</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="weight-gain">Weight Gain</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="general-health">General Health</option>
                </select>
              ) : (
                <p className="text-foreground capitalize">
                  {userProfile?.primaryGoal?.replace("-", " ") || "weight-loss"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Cooking Experience
              </label>
              {editing ? (
                <select
                  value={formData.cookingExperience || ""}
                  onChange={(e) =>
                    handleInputChange("cookingExperience", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              ) : (
                <p className="text-foreground capitalize">
                  {userProfile?.cookingExperience || "beginner"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Dietary Restrictions
            </label>
            {editing ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                      <span className="text-sm capitalize">
                        {diet.replace("-", " ")}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-foreground">
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
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
            Additional Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-foreground">
                  {userProfile?.phone || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Location
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Enter your location"
                />
              ) : (
                <p className="text-foreground">
                  {userProfile?.location || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Bio
              </label>
              {editing ? (
                <textarea
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="Tell us about yourself, your fitness journey, or goals..."
                />
              ) : (
                <p className="text-foreground">
                  {userProfile?.bio || "No bio provided yet. Share your story!"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Subscription Interest
              </label>
              {editing ? (
                <select
                  value={formData.subscriptionInterest || ""}
                  onChange={(e) =>
                    handleInputChange("subscriptionInterest", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
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
                <p className="text-foreground">
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
        <div className="bg-card rounded-xl border border-border p-8">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
            Account Settings
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Email Notifications
                </h3>
                <p className="text-sm text-muted-foreground">
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
                  className="rounded border-border"
                />
              ) : (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userProfile?.notifications
                      ? "bg-success/20 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {userProfile?.notifications ? "Enabled" : "Disabled"}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Profile Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can see your profile information
                </p>
              </div>
              {editing ? (
                <select
                  value={formData.privacy || "public"}
                  onChange={(e) => handleInputChange("privacy", e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              ) : (
                <span className="capitalize text-foreground">
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
