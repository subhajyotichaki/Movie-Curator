import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [mood, setMood] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!mood.trim()) return;

    // if input looks like a movie name → search
    navigate(`/results?query=${encodeURIComponent(mood)}`);
  };

  // ✨ typing animation
  const moods = ["happy", "sad", "romantic", "excited", "bored"];
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = moods[index];

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + current[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setPlaceholder("");
        setCharIndex(0);
        setIndex((prev) => (prev + 1) % moods.length);
      }, 1500);
    }
  }, [charIndex, index]);

  return (


    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full relative overflow-hidden text-white"
    >
      {/* your existing content */}


      {/* 🎬 Background Posters */}
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 opacity-50 scale-110 animate-[spin_60s_linear_infinite]">

        {[
          "https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
          "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
          "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
          "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
          "https://image.tmdb.org/t/p/w500/y6hZ9R0gJk4z5XbQ2YlYkW2T7vM.jpg"
        ].map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-full object-cover rounded-lg blur-sm"
          />
        ))}

      </div>

      {/* 🌑 Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* 🎯 Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4 sm:px-6">

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fadeIn bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-xl">
          Movie Curator
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mb-10 max-w-xl text-lg">
          Your mood deserves the perfect movie. Let us find it for you.
        </p>

        {/* Search */}
        <div className="flex flex-col sm:flex-row bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl w-full max-w-md">
          <input
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={`I feel ${placeholder}...`}
            className="px-6 py-4 bg-transparent outline-none text-white w-full placeholder-gray-400 focus:ring-2 focus:ring-red-500"
          />

          <button
            onClick={handleSearch}
            className="bg-red-500 px-8 py-4 hover:bg-red-600 transition font-semibold w-full sm:w-auto hover:scale-105 active:scale-95"
          >
            Explore
          </button>
        </div>

        {/* Mood Chips */}
        <div className="flex gap-3 mt-8 flex-wrap justify-center">
          {["Happy", "Sad", "Romantic", "Excited", "Bored"].map((m) => (
            <button
              key={m}
              onClick={() => navigate(`/results?mood=${m.toLowerCase()}`)}
              className="px-4 sm:px-6 py-2 bg-white/10 backdrop-blur rounded-full text-sm hover:bg-red-500 transition hover:scale-105 active:scale-95"
            >
              {m}
            </button>
          ))}
        </div>

      </div>
    </motion.div>

  );
}