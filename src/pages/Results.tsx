import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Results() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("query");
  const mood = searchParams.get("mood");
  const [movies, setMovies] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const API_KEY = "34b47e303e954d17fae52b72fcf86f7e";

  const getGenresFromMood = (input: string | null) => {
    if (!input) return "35";

    const mood = input.toLowerCase();

    if (mood.includes("sad") || mood.includes("depressed") || mood.includes("lonely"))
      return "18";

    if (mood.includes("happy") || mood.includes("fun") || mood.includes("joy"))
      return "35,10751";

    if (mood.includes("love") || mood.includes("romantic"))
      return "10749";

    if (mood.includes("excited") || mood.includes("thrill"))
      return "28,53";

    if (mood.includes("scared") || mood.includes("horror"))
      return "27";

    if (mood.includes("bored"))
      return "28,12,35";

    if (mood.includes("think") || mood.includes("deep"))
      return "18,9648";

    // 🔥 multi-mood intelligence
    if (mood.includes("sad") && mood.includes("love"))
      return "18,10749";

    return "35";
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      let res;

      if (query) {
        // 🔍 search by name
        res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
        );
      } else {
        // 🎭 mood logic
        const genre = getGenresFromMood(mood);

        res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}`
        );
      }

      setMovies(res.data.results);
      setLoading(false);
    };

    fetchMovies();
  }, [mood, query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 sm:px-6 py-6"
    >

      {/* 🔙 Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 blur-2xl opacity-60"></div>

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">

          <div className="mb-6 space-y-1">

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                {query ? "Search results" : "Curated for"}
              </span>{" "}
              {!query && <span className="text-white">your mood</span>}
            </h2>

            <p className="text-gray-400 text-sm sm:text-base">
              {query ? (
                <>
                  Showing results for{" "}
                  <span className="text-red-400 font-medium">"{query}"</span>
                </>
              ) : (
                <>
                  Mood detected:{" "}
                  <span className="text-red-400 font-medium capitalize">{mood}</span>
                </>
              )}
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-white/10 backdrop-blur px-5 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition hover:scale-105 active:scale-95 text-sm"
          >
            ← Back
          </button>

        </div>
      </motion.div>

      {/* ⏳ Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-800 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : movies.length === 0 ? (
        /* ❌ Empty State */
        <div className="text-center mt-20 text-gray-400">
          <p className="text-xl mb-2">No movies found 😕</p>
          <p>Try a different mood</p>
        </div>
      ) : (
        /* 🎬 Movie Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {movies.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/movie/${m.id}`)}
              className="relative group cursor-pointer rounded-xl overflow-hidden transition duration-300"
            >

              {/* 🎬 Poster */}
              <img
                src={
                  m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={m.title}
                className="w-full h-full object-cover"
              />

              {/* ⭐ Rating Badge (upgraded) */}
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-1 rounded-md text-xs flex items-center gap-1 shadow">
                <span className="text-yellow-400">★</span>
                <span className="text-white font-medium">
                  {m.vote_average?.toFixed(1)}
                </span>
              </div>

              {/* ✨ Hover Glow Border */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-red-500/50 transition duration-300" />

              {/* 🎭 Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-3">

                <p className="text-sm font-semibold mb-2 line-clamp-2">
                  {m.title}
                </p>

                <button className="bg-red-500 text-xs py-1 rounded hover:bg-red-600 transition">
                  View Details
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </motion.div>
  );
}