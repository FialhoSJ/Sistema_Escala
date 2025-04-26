import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom"; // importa o hook
import Home from "../src/pages/Home/home";
import Register from "../src/pages/Register/register";
import Admin from "../src/pages/Admin/admin";
import Private from "./private";
import Cadastro from "./pages/CadastroEscala/cadastro";
import Escala from "./pages/EscalaViagens/escala";
import Sidebar from "./pages/Sidebar/siderbar";

function RoutesApp() {
    const location = useLocation(); // pega a rota atual

    return (
        <>
            {location.pathname !== "/" && <Sidebar />} {/* mostra só se NÃO for home */}
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/escala" element={<Escala />} />
                <Route path="/admin" element={<Private><Admin /></Private>} />
            </Routes>
        </>
    );
}

export default RoutesApp;
