import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import logo from '/assets/images/logo.webp';

const Footer = ({ language }) => {
  const currentYear = new Date().getFullYear();

  const content = {
    en: {
      helpCenter: {
        title: "Help Center",
        links: [
          { label: "Contact Us", href: "/about-page#contact" },
          { label: "FAQs", href: "/faqs" },
          { label: "Support", href: "/support" },
          { label: "Training Resources", href: "/resources" },
          { label: "Community Guidelines", href: "/guidelines" }
        ]
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Cookie Policy", href: "/cookies" },
          { label: "Data Protection", href: "/data-protection" },
          { label: "Disclaimer", href: "/disclaimer" }
        ]
      },
      additional: {
        title: "Quick Links",
        links: [
          { label: "About Us", href: "/team-leadership-page" },
          { label: "Our Programs", href: "/our-vision-mission-page" },
          { label: "Timeline", href: "/andolan-timeline-page" },
          { label: "Become a Member", href: "#member-registration" },
          { label: "Admin Portal", href: "/admin-dashboard" }
        ]
      },
      newsletter: {
        title: "Stay Updated",
        description: "Get the latest news and updates from Rashtriya Kisan Manch",
        placeholder: "Enter your email",
        subscribe: "Subscribe"
      },
      social: {
        title: "Follow Us"
      },
      copyright: "All rights reserved",
      organization: "Rashtriya Kisan Manch"
    },
    hi: {
      helpCenter: {
        title: "सहायता केंद्र",
        links: [
          { label: "संपर्क करें", href: "/contact" },
          { label: "अक्सर पूछे जाने वाले प्रश्न", href: "/faqs" },
          { label: "सहायता", href: "/support" },
          { label: "प्रशिक्षण संसाधन", href: "/resources" },
          { label: "समुदायिक दिशानिर्देश", href: "/guidelines" }
        ]
      },
      legal: {
        title: "कानूनी",
        links: [
          { label: "गोपनीयता नीति", href: "/privacy" },
          { label: "सेवा की शर्तें", href: "/terms" },
          { label: "कुकी नीति", href: "/cookies" },
          { label: "डेटा सुरक्षा", href: "/data-protection" },
          { label: "अस्वीकरण", href: "/disclaimer" }
        ]
      },
      additional: {
        title: "त्वरित लिंक",
        links: [
          { label: "हमारे बारे में", href: "/team-leadership-page" },
          { label: "हमारे कार्यक्रम", href: "/our-vision-mission-page" },
          { label: "समयसीमा", href: "/andolan-timeline-page" },
          { label: "सदस्य बनें", href: "#member-registration" },
          { label: "एडमिन पोर्टल", href: "/admin-dashboard" }
        ]
      },
      newsletter: {
        title: "अपडेट रहें",
        description: "किसान आंदोलन से नवीनतम समाचार और अपडेट प्राप्त करें",
        placeholder: "अपना ईमेल दर्ज करें",
        subscribe: "सब्सक्राइब करें"
      },
      social: {
        title: "हमें फॉलो करें"
      },
      copyright: "सभी अधिकार सुरक्षित",
      organization: "राष्ट्रीय किसान मंच"
    }
  };

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", href: "https://www.facebook.com/orgrkmkisan" },
    { name: "Twitter", icon: "Twitter", href: "https://x.com/rkmkisanmanch" },
    { name: "Instagram", icon: "Instagram", href: "https://www.instagram.com/rkmkisanmanch/" },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Organization Info & Newsletter */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className='bg-white p-2 rounded-md'>
                  <img src={logo} alt="alt" />
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mb-8">
              <h4 className="text-lg font-heading font-semibold mb-3">
                {content[language].newsletter.title}
              </h4>
              <p className="text-sm opacity-80 mb-4">
                {content[language].newsletter.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={content[language].newsletter.placeholder}
                  className="flex-1 px-4 py-2 rounded-md text-text-primary bg-white border border-transparent focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
                />
                <button className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
                  {content[language].newsletter.subscribe}
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-heading font-semibold mb-4">
                {content[language].social.title}
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 transform hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Help Center */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">
              {content[language].helpCenter.title}
            </h4>
            <ul className="space-y-3">
              {content[language].helpCenter.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 group"
                  >
                    <Icon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">
              {content[language].legal.title}
            </h4>
            <ul className="space-y-3">
              {content[language].legal.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 group"
                  >
                    <Icon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6">
              {content[language].additional.title}
            </h4>
            <ul className="space-y-3">
              {content[language].additional.links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-80 hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 group"
                  >
                    <Icon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white border-opacity-20">
        <div className="container-custom py-6">
            <div className="text-sm text-center opacity-80">
              © {currentYear} {content[language].organization}. {content[language].copyright}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;