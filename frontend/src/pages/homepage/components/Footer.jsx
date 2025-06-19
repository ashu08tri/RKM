import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Icon from 'components/AppIcon';
import logo from '/assets/images/logo.webp';

const Footer = ({ language }) => {
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);

  const currentYear = new Date().getFullYear();

  const loadRazorpay = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    if (!amount) return alert("Please enter donation amount");

    const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const { data } = await axios.post("https://api.rashtriyakisanmanch.com/api/donate/create-order", { amount });

    const keyRes = await axios.get("https://api.rashtriyakisanmanch.com/getKey");
    const key = keyRes.data;

    const options = {
      key: key,
      amount: data.order.amount,
      currency: "INR",
      name: "Rashtriya Kisan Manch",
      description: "Donation",
      order_id: data.order.id,
      handler: function (response) {
        setAmount("");
        setPaymentResponse(response);
        setShowModal(true);
      },
      prefill: {
        name: "",
        email: "",
        contact: ""
      },
      theme: {
        color: "#0f766e"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const content = {
    en: {
      helpCenter: {
        title: "Help Center",
        links: [
          { label: "Contact Us", href: "/about-page#contact" },
          { label: "FAQs", href: "/faqs" },
          { label: "Community Guidelines", href: "/guidelines" }
        ]
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Data Protection", href: "/data-protection" },
          { label: "Disclaimer", href: "/disclaimer" }
        ]
      },
      additional: {
        title: "Quick Links",
        links: [
          { label: "About Us", href: "/team-leadership-page" },
          { label: "Our Programs", href: "/our-vision-mission-page" },
          { label: "Timeline", href: "/andolan-timeline-page" }
        ]
      },
      newsletter: {
        title: "Donate to Us",
        description: "Support Rashtriya Kisan Manch in empowering farmers and driving change.",
        placeholder: "Enter donation amount",
        subscribe: "Donate Now"
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
        title: "दान करें",
        description: "राष्ट्रीय किसान मंच का समर्थन करें और किसानों को सशक्त बनाएं।",
        placeholder: "दान राशि दर्ज करें",
        subscribe: "दान करें"
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
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={content[language].newsletter.placeholder}
                  className="flex-1 px-4 py-2 rounded-md text-text-primary bg-white border border-transparent focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary"
                />
                <button onClick={handleDonate} className="bg-secondary hover:bg-accent text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">
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

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-700">🎉 Donation Successful</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Thank you for your donation to Rashtriya Kisan Manch!</p>
            <div className="text-sm text-gray-700 bg-gray-100 rounded p-4 overflow-auto max-h-60">
              <div><strong>Payment ID:</strong> {paymentResponse?.razorpay_payment_id}</div>
              <div><strong>Order ID:</strong> {paymentResponse?.razorpay_order_id}</div>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};

export default Footer;