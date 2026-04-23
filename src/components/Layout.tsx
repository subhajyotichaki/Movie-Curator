import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";
    const isResults = location.pathname === "/results";

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col">

            {/* Hide navbar on landing */}
            {!isHome && !isResults && (
                <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

                        {/* 🎬 Logo */}
                        <h1
                            onClick={() => navigate("/")}
                            className="flex items-center gap-3 text-xl sm:text-2xl font-bold tracking-wide cursor-pointer group"
                        >

                            <span className="text-2xl transition group-hover:scale-110">
                                🎬
                            </span>

                            <span className="w-[1px] h-5 bg-white/20"></span>

                            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent transition duration-300 group-hover:brightness-125">
                                Movie Curator
                            </span>

                        </h1>


                    </div>

                </header>
            )}



            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

        </div>
    );
}