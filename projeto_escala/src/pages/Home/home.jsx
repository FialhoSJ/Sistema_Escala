import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>SISTEMA DE ESCALA DE VIAGENS NT/SEGUP</h1>
            <p>Texto a ser inserido </p>

            <div>
              <Link to='/escala' className="btn btn-black">Ir para Escala</Link>
            </div>
        </div>
    );
}

export default Home;
