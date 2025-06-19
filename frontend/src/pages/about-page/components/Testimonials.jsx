import React, { useState, useEffect } from 'react';
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      quote: "Kisan Andolan has transformed our village\'s approach to agriculture. The training on water conservation techniques helped us increase crop yields by 40% while using less water. Their practical, hands-on approach makes complex farming techniques accessible to everyone.",
      author: "Ramesh Patel",
      role: "Farmer, Gujarat",
      image: "https://images.pexels.com/photos/1822095/pexels-photo-1822095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      impact: "40% increase in crop yields"
    },
    {
      id: 2,
      quote: "As a woman farmer, I faced many challenges in accessing resources and training. The Women in Agriculture program provided not just agricultural knowledge but also leadership training that helped me start a cooperative with 15 other women farmers in my village. Now we negotiate better prices and support each other.",
      author: "Lakshmi Devi",
      role: "Cooperative Leader, Tamil Nadu",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop",
      impact: "Founded a 15-member women\'s cooperative"
    },
    {
      id: 3,
      quote: "The organic certification assistance from Kisan Andolan was invaluable. They guided us through every step of the complex process and connected us to premium markets. Our income has increased by 65% since transitioning to certified organic farming, and I\'ve been able to send both my children to college.",
      author: "Surinder Singh",
      role: "Organic Farmer, Punjab",
      image: "https://images.pexels.com/photos/16963494/pexels-photo-16963494.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      impact: "65% income increase through organic certification"
    },
    {
      id: 4,
      quote: "When I joined the Youth Leadership Program at 22, I had little knowledge about modern agricultural techniques. Three years later, I\'m running a successful agri-tech startup that helps small farmers access weather forecasting data. Kisan Andolan provided mentorship, initial funding, and connections that made this possible.",
      author: "Arjun Mehta",
      role: "Agri-Tech Entrepreneur, Maharashtra",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop",
      impact: "Founded a successful agri-tech startup"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="mb-20">
      <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Community Voices</h2>
      
      <div className="bg-surface rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Image Column */}
          <div className="lg:col-span-1 h-60 lg:h-auto relative">
            <Image
              src={testimonials[activeIndex].image}
              alt={testimonials[activeIndex].author}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent lg:bg-gradient-to-r flex items-end lg:items-center p-6">
              <div className="text-white">
                <div className="mb-2">
                  <Icon name="MessageCircle" size={24} />
                </div>
                <h3 className="text-xl font-heading font-semibold">{testimonials[activeIndex].author}</h3>
                <p className="opacity-90">{testimonials[activeIndex].role}</p>
                <div className="mt-3 bg-primary bg-opacity-20 px-3 py-1 rounded-full inline-block">
                  <span className="text-sm font-medium">{testimonials[activeIndex].impact}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quote Column */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <Icon name="Quote" size={36} className="text-accent mb-4" />
              <blockquote className="text-lg text-text-primary italic mb-8">
                {testimonials[activeIndex].quote}
              </blockquote>
            </div>
            
            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${activeIndex === index ? 'bg-primary w-6' : 'bg-accent'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Testimonial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Users" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">850+</h3>
          <p className="text-text-secondary">Success stories collected</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Star" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">92%</h3>
          <p className="text-text-secondary">Program satisfaction rate</p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="TrendingUp" size={24} color="#4a7c59" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">45%</h3>
          <p className="text-text-secondary">Average income increase</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;