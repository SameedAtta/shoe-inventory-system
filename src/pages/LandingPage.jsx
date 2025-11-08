import React, { useRef, useEffect } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function LandingPage() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  const nextSlide = () => {
    if (slider.current) slider.current.next();
  };

  const startAutoplay = () => {
    if (timeoutRef.current) return;
    timeoutRef.current = setInterval(() => {
      nextSlide();
    }, 2000);
  };

  const stopAutoplay = () => {
    clearInterval(timeoutRef.current);
    timeoutRef.current = null;
  };

  const images = [
    "https://picsum.photos/seed/slide1/1920/1080",
    "https://picsum.photos/seed/slide2/1920/1080",
    "https://picsum.photos/seed/slide3/1920/1080",
    "https://picsum.photos/seed/slide4/1920/1080",
    "https://picsum.photos/seed/slide5/1920/1080",
  ];
  useEffect(() => {
    window.startAutoplay = startAutoplay;
    window.stopAutoplay = stopAutoplay;
    startAutoplay();

    return () => {
      window.startAutoplay = null;
      window.stopAutoplay = null;
      stopAutoplay();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔁 Background Slider */}
      <div
        ref={sliderRef}
        onMouseEnter={stopAutoplay}
        onMouseLeave={startAutoplay}
        className="keen-slider absolute inset-0 z-0"
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex items-center justify-center"
          >
            <motion.img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-screen object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        ))}
        {/* {images.map((img, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex items-center justify-center"
          >
            <img
              src={img}
              alt={`slide-${idx}`}
              className="w-full h-screen object-cover"
            />
          </div>
        ))} */}
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 bg-black bg-opacity-50 min-h-screen flex flex-col items-center justify-center text-white text-center p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Jafir Enterprises
        </h1>
        <p className="text-lg md:text-xl mb-4">
          Manage your inventory. Track sales. Control stock. All in one place.
        </p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
