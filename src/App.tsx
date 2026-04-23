import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// import your pages
import Home from "./pages/Home";
import Results from "./pages/Results";
import Movie from "./pages/Movie";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/movie/:id" element={<Movie />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;