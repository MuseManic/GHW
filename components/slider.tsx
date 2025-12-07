'use client';

import { useState, useEffect } from 'react';

interface SlideImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface SliderProps {
  images: SlideImage[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Slider({ images, autoPlay = true, interval = 5000 }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images provided</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-64 md:h-128 overflow-hidden rounded-lg shadow-lg bg-gray-300">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: index === currentSlide ? 1 : 0, zIndex: 0 }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          {/* Overlay with text
          {(image.title || image.description) && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-3 sm:p-6">
              {image.title && (
                <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{image.title}</h2>
              )}
              {image.description && (
                <p className="text-white text-xs sm:text-base md:text-lg">{image.description}</p>
              )}
            </div>
          )} */}
        </div>
      ))}

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 text-black rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center transition-all text-sm sm:text-base"
        aria-label="Previous slide"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 text-black rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center transition-all text-sm sm:text-base"
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}