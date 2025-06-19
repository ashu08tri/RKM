import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import banner1 from '/assets/images/banner1.jpeg';
import banner2 from '/assets/images/banner2.webp';
import banner3 from '/assets/images/banner3.webp';

const banners = [banner1, banner2, banner3];

const HeroSection = ({ onMemberRegistration, onYouthLeadership }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 1 }
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 1 }
    })
  };

  return (
    <div className='w-full overflow-hidden pt-20'>
      <section className="relative h-[90vh]">
      <AnimatePresence custom={direction}>
        <motion.img
          key={index}
          src={banners[index]}
          alt={`Banner ${index + 1}`}
          className="absolute top-0 left-0 w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        />
      </AnimatePresence>

      {/* Buttons at bottom */}
      <div className="absolute bottom-2 left-0 right-0 z-10 flex flex-col sm:flex-row justify-center items-center gap-4 px-4">
        <button
          onClick={onMemberRegistration}
          className="btn-primary w-full sm:w-auto px-6 py-2 text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Become a Member
        </button>
        <button
          onClick={onYouthLeadership}
          className="btn-outline w-full sm:w-auto px-6 py-2 text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Youth Leadership Program
        </button>
      </div>
    </section>
    </div>
  );
};

export default HeroSection;
