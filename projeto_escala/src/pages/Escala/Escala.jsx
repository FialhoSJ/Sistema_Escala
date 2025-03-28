import { useState, useEffect } from "react";
import CadastroServidores from "./CadastroServidores";
import ListaEscala from "./ListaEscala";

const Escala = () => {
  const carregarDados = (chave, valorPadrao) => {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : valorPadrao;
  };

  const [servidores, setServidores] = useState(carregarDados("servidores", []));
  const [escalas, setEscalas] = useState(
    carregarDados("escalas", {
      "Local 1": { "1ª semana": [], "2ª semana": [] },
      "Local 2": { "1ª semana": [], "2ª semana": [] },
    })
  );

  useEffect(() => {
    localStorage.setItem("servidores", JSON.stringify(servidores));
    localStorage.setItem("escalas", JSON.stringify(escalas));
  }, [servidores, escalas]);

  return (
    <div className="flex gap-6 p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      {/* Lista de Cadastro na Lateral */}
      <CadastroServidores servidores={servidores} setServidores={setServidores} />

      {/* Escala Centralizada */}
      <div className="flex-1 p-4 border rounded-lg bg-gray-50 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Escala de Servidores</h1>
        <ListaEscala escalas={escalas} />
      </div>
    </div>
  );
};

export default Escala;
