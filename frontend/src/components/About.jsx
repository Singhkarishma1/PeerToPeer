import React, { useState, useEffect } from 'react';

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPeople, setTotalPeople] = useState(0); 
  const [animatedCount, setAnimatedCount] = useState(0); 

  // Array of card content
  const cards = [
    {
      title: 'Our Vision',
      description: 'To build a global network of learners and experts who uplift each other...',
      extendedInfo: 'Through our platform, we seek to make learning more human...'
    },
    {
      title: 'Our Mission',
      description: 'To bridge the gap between learners and experts by offering a collaborative platform...',
      extendedInfo: 'We aim to create a sustainable ecosystem where learners can grow...'
    },
    {
      title: 'Our Goals',
      description: 'Our goal is to provide an inclusive, accessible platform that empowers individuals...',
      extendedInfo: 'Additionally, our goal is to help foster a mindset of curiosity...'
    }
  ];

  // Auto slide to next card every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch total count of people
  const fetchTotalPeople = async () => {
    const count = 1200; // Replace this with your actual API call
    setTotalPeople(count);
  };

  // Animated counter effect
  useEffect(() => {
    let start = 0;
    const duration = 2000; // Animation duration in milliseconds
    const increment = Math.ceil(totalPeople / duration * 100);

    const animateCounter = () => {
      if (start < totalPeople) {
        start += increment;
        setAnimatedCount(Math.min(start, totalPeople)); // Ensure it doesn't overshoot
        requestAnimationFrame(animateCounter);
      }
    };
    if (totalPeople > 0) {
      animateCounter();
    }
  }, [totalPeople]);

  // Fetch total count on mount
  useEffect(() => {
    fetchTotalPeople();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {cards.map((card, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-white shadow-lg rounded-lg p-6 h-auto flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{card.title}</h3>
                  <p className="text-gray-700">{card.description}</p>
                  <p className="text-gray-600">{card.extendedInfo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Students Registered Section */}
        <div className="mt-6 text-center">
          <div
            className="bg-blue-500 text-white shadow-lg rounded-lg p-6 transform transition-all duration-500 ease-in-out hover:scale-105"
          >
            <h4 className="text-lg font-semibold">Students Registered</h4>
            <p className="text-3xl font-bold mt-4">
              {animatedCount.toLocaleString()}+
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
