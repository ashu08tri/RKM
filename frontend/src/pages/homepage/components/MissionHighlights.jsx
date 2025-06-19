import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MissionHighlights = ({ language }) => {
  const content = {
    en: {
      title: "Our Mission Highlights",
      subtitle: "Transforming agriculture through innovation, education, and community empowerment",
      highlights: [
        {
          id: 1,
          icon: "Leaf",
          title: "Sustainable Farming",
          description: "Promoting eco-friendly agricultural practices that preserve soil health and increase crop yields while protecting the environment for future generations.",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
        },
        {
          id: 2,
          icon: "GraduationCap",
          title: "Farmer Education",
          description: "Comprehensive training programs covering modern farming techniques, financial literacy, and technology adoption to empower farmers with knowledge.",
          image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?w=400&h=300&fit=crop"
        },
        {
          id: 3,
          icon: "Users",
          title: "Community Building",
          description: "Creating strong networks of farmers and agricultural communities to share resources, knowledge, and support each other\'s growth and success.",
          image: "https://images.pixabay.com/photo/2016/11/29/06/15/adult-1867743_1280.jpg?w=400&h=300&fit=crop"
        }
      ]
    },
    hi: {
      title: "हमारे मिशन की मुख्य बातें",
      subtitle: "नवाचार, शिक्षा और सामुदायिक सशक्तिकरण के माध्यम से कृषि का रूपांतरण",
      highlights: [
        {
          id: 1,
          icon: "Leaf",
          title: "टिकाऊ खेती",
          description: "पर्यावरण-अनुकूल कृषि प्रथाओं को बढ़ावा देना जो मिट्टी के स्वास्थ्य को संरक्षित करती है और फसल की पैदावार बढ़ाती है।",
          image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop"
        },
        {
          id: 2,
          icon: "GraduationCap",
          title: "किसान शिक्षा",
          description: "आधुनिक खेती की तकनीकों, वित्तीय साक्षरता और प्रौद्योगिकी अपनाने को कवर करने वाले व्यापक प्रशिक्षण कार्यक्रम।",
          image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?w=400&h=300&fit=crop"
        },
        {
          id: 3,
          icon: "Users",
          title: "समुदाय निर्माण",
          description: "संसाधनों, ज्ञान को साझा करने और एक-दूसरे की वृद्धि और सफलता का समर्थन करने के लिए किसानों के मजबूत नेटवर्क बनाना।",
          image: "https://images.pixabay.com/photo/2016/11/29/06/15/adult-1867743_1280.jpg?w=400&h=300&fit=crop"
        }
      ]
    }
  };

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            {content[language].title}
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {content[language].subtitle}
          </p>
        </div>

        {/* Highlights Grid */}
        <Carousel
          responsive={responsive}
          infinite={true}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          >
            {content[language].highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 m-2"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg mb-6 h-48">
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 mx-auto group-hover:bg-secondary transition-colors duration-300">
                  <Icon name={highlight.icon} size={32} color="white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-heading font-semibold text-text-primary mb-4">
                    {highlight.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            ))}
        </Carousel>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-primary font-medium cursor-pointer hover:text-secondary transition-colors duration-200">
            <span>{language === 'en' ? 'Learn more about our programs' : 'हमारे कार्यक्रमों के बारे में और जानें'}</span>
            <Icon name="ArrowRight" size={20} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionHighlights;