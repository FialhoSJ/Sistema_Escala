import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Escala from "./pages/Escala/Escala";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escala" element={<Escala />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
