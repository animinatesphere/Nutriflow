import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Meal Planning", href: "/meal-planning" },
      { label: "Cooking Games", href: "/cooking-games" },
      { label: "Mobile App", href: "#mobile" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Press Kit", href: "#press" },
      { label: "Contact", href: "#contact" },
      { label: "Blog", href: "#blog" },
    ],
    support: [
      { label: "Help Center", href: "#help" },
      { label: "Community", href: "#community" },
      { label: "Nutrition Guides", href: "#guides" },
      { label: "API Documentation", href: "#api" },
      { label: "System Status", href: "#status" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" },
      { label: "Accessibility", href: "#accessibility" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: "Twitter", href: "#twitter" },
    { name: "Facebook", icon: "Facebook", href: "#facebook" },
    { name: "Instagram", icon: "Instagram", href: "#instagram" },
    { name: "YouTube", icon: "Youtube", href: "#youtube" },
    { name: "LinkedIn", icon: "Linkedin", href: "#linkedin" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              to="/landing-page"
              className="flex items-center space-x-2 mb-6"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="Utensils" size={20} color="white" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">
                NutriFlow
              </span>
            </Link>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transform your nutrition journey with gamified meal planning,
              interactive cooking challenges, and comprehensive tracking tools
              designed for lasting healthy habits.
            </p>

            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.href}
                  className="flex items-center justify-center w-10 h-10 bg-muted hover:bg-primary rounded-lg transition-colors group"
                  aria-label={social?.name}
                >
                  <Icon
                    name={social?.icon}
                    size={18}
                    color="var(--color-muted-foreground)"
                    className="group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks?.product?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks?.legal?.map((link) => (
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-muted/30 rounded-2xl p-8 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              Stay Updated with Nutrition Tips
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly nutrition insights, healthy recipes, and exclusive
              cooking challenges delivered straight to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <Icon name="Send" size={16} color="currentColor" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates from our company.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-x-6 mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} NutriFlow. All rights reserved.
            </p>

            <div className="flex items-center  space-x-4">
              <div className="flex items-center space-x-2 mt-5">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span className="text-xs text-success font-medium">
                  SSL Secured
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} color="var(--color-primary)" />
                <span className="text-xs text-primary font-medium">
                  FDA Compliant
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="MapPin" size={14} color="currentColor" />
              <span>Made in USA</span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Heart" size={14} color="var(--color-error)" />
              <span>Built with care for your health</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
