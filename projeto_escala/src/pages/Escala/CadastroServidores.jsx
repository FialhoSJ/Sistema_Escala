import { useState } from "react";

const CadastroServidores = ({ servidores, setServidores }) => {
  const [novoServidor, setNovoServidor] = useState("");
  const [mensagem, setMensagem] = useState("");

  const adicionarServidor = () => {
    if (novoServidor.trim() === "") return alert("Nome inválido!");
    if (servidores.includes(novoServidor))
      return alert("Servidor já cadastrado!");

    setServidores([...servidores, novoServidor]);
    setNovoServidor("");
    setMensagem("Servidor cadastrado com sucesso!");

    setTimeout(() => setMensagem(""), 3000);
  };

  return (
    <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Cadastrar Servidor</h2>
      <div className="flex flex-col gap-2">
        <input
          className="border p-2 rounded"
          value={novoServidor}
          onChange={(e) => setNovoServidor(e.target.value)}
          placeholder="Nome do servidor"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={adicionarServidor}
        >
          Adicionar
        </button>
        {mensagem && <span className="text-green-600 text-sm">{mensagem}</span>}
      </div>
    </div>
  );
};

export default CadastroServidores;
