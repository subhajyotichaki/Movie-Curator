import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState<any[]>([]);

  const API_KEY = "34b47e303e954d17fae52b72fcf86f7e";

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        const videoRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );

        // find trailer
        const trailer = videoRes.data.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
        setMovie(res.data);
        const similarRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`
        );

        setSimilar(similarRes.data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      {/* 🎬 BACKDROP */}
      <div className="relative h-[70vh] w-full overflow-hidden">

        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover scale-105"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>

        {/* 🔙 Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/10 backdrop-blur px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition hover:scale-105 active:scale-95"
        >
          ← Back
        </button>

        {/* 🎬 Title + rating */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          {/* LEFT */}
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm font-semibold">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

              <span className="text-gray-300 text-sm">
                {movie.release_date}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition duration-300"
              >
                ▶ Trailer
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 🎯 CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-8">

        {/* 🎬 Poster */}
        <div className="flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-64 rounded-xl shadow-2xl hover:scale-105 transition duration-300"
          />
        </div>

        {/* 📝 Details */}
        <div className="flex-1">

          <h2 className="text-2xl font-semibold mb-4">
            Overview
          </h2>

          <p className="text-gray-300 leading-relaxed">
            {movie.overview || "No description available."}
          </p>

          {/* 🎭 Genres */}
          <div className="flex flex-wrap gap-2 mt-6">
            {movie.genres?.map((g: any) => (
              <button
                key={g.id}
                onClick={() => navigate(`/results?mood=${g.name.toLowerCase()}`)}
                className="bg-white/10 backdrop-blur px-3 py-1 rounded-full text-sm border border-white/10 hover:bg-red-500 hover:text-white transition duration-300 hover:scale-105 active:scale-95"
              >
                {g.name}
              </button>
            ))}
          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 mb-10">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
      {/* 🎬 Similar Movies */}
      {/* 🎬 Similar Movies */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-14">

        {/* 🎯 Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white transition-all duration-500 ease-out hover:tracking-wide">
              More like this{" "}
              <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
                {movie?.genres?.[0]?.name || ""}
              </span>
            </h2>

            <div className="h-[2px] w-16 mt-2 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* 🎬 Scroll Row */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">

          {similar.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/movie/${m.id}`)}
              className="min-w-[150px] sm:min-w-[170px] cursor-pointer group transition"
            >

              {/* 🎬 Poster */}
              <div className="relative rounded-xl overflow-hidden">

                <img
                  src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                  alt={m.title}
                  className="w-full h-56 object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75"
                />

                {/* ✨ Subtle overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>

              </div>

              {/* 🎬 Title */}
              <p className="text-sm mt-3 text-gray-300 line-clamp-2 group-hover:text-white transition">
                {m.title}
              </p>

            </div>
          ))}

        </div>
      </div>

      {showTrailer && trailerKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowTrailer(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-[90%] max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ❌ Close Button */}
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-sm hover:bg-black/80 transition"
            >
              Close
            </button>

            {/* 🎬 YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
              title="Trailer"
              className="w-full h-full"
              allow="autoplay; encrypted-media; allowFullScreen"
              
            ></iframe>

          </motion.div>
        </motion.div>
      )}

    </motion.div>
  );
}