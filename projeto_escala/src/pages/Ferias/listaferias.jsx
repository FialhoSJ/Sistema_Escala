import { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "./listaferias.css"; // Arquivo CSS externo
import Sidebar from '../Sidebar/siderbar'; // Certifique-se de importar a sidebar corretamente
import { getAuth } from 'firebase/auth';

export default function Ferias() {
  const [ferias, setFerias] = useState([]);
  const [servidores, setServidores] = useState([]); // Estado para armazenar os servidores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o formulário de cadastro
  const [servidorSelecionado, setServidorSelecionado] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  // Função para carregar servidores
  async function carregarServidores() {
    try {
      const snapshot = await getDocs(collection(db, 'servidores'));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServidores(lista);
    } catch (error) {
      console.error('Erro ao carregar servidores:', error);
    }
  }

  // Função para carregar férias
  async function carregarFerias() {
    try {
      const feriasRef = collection(db, 'ferias');
      const q = query(feriasRef, orderBy('inicio', 'desc'));
      const querySnapshot = await getDocs(q);

      const feriasArray = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nome: data.nome || 'Desconhecido',
          inicio: data.inicio?.toDate() || null,
          fim: data.fim?.toDate() || null
        };
      });

      setFerias(feriasArray);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar férias:', error);
      setError('Erro ao carregar dados. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarServidores(); // Carrega os servidores ao montar o componente
    carregarFerias(); // Carrega as férias ao montar o componente
  }, []);

  // Função para cadastrar férias
  async function cadastrarFerias(e) {
    e.preventDefault();

    if (!servidorSelecionado || !inicio || !fim) {
      alert('Preencha todos os campos.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Você precisa estar autenticado para cadastrar férias.');
      return;
    }

    // Obter o nome do servidor selecionado
    const servidor = servidores.find((s) => s.name === servidorSelecionado);

    try {
      await addDoc(collection(db, 'ferias'), {
        servidorId: servidorSelecionado, // ID ou nome do servidor
        nome: servidor?.name || 'Desconhecido', // Nome do servidor
        inicio: new Date(inicio), // Convertido para timestamp automaticamente pelo Firestore
        fim: new Date(fim), // Convertido para timestamp automaticamente pelo Firestore
        status: 'pendente', // Status inicial
        userUid: user.uid, // UID do usuário autenticado
      });

      alert('Férias cadastradas com sucesso!');
      setServidorSelecionado('');
      setInicio('');
      setFim('');
      carregarFerias(); // Atualiza a lista de férias
    } catch (error) {
      console.error('Erro ao cadastrar férias:', error);
      alert('Erro ao cadastrar férias. Tente novamente.');
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>Erro!</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar /> {/* Sidebar fixa */}
      <div className="main">
        <h2 className="ferias-title">Monitoramento de Férias</h2>

        {/* Formulário de Cadastro */}
        <form className="ferias-form" onSubmit={cadastrarFerias}>
          <div className="form-group">
            <label htmlFor="servidor">Servidor:</label>
            <select
              id="servidor"
              value={servidorSelecionado}
              onChange={(e) => setServidorSelecionado(e.target.value)}
            >
              <option value="">Selecione um servidor</option>
              {servidores.map((servidor) => (
                <option key={servidor.id} value={servidor.name}>
                  {servidor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="inicio">Início:</label>
            <input
              type="date"
              id="inicio"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fim">Término:</label>
            <input
              type="date"
              id="fim"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">Cadastrar Férias</button>
        </form>

        {/* Lista de Férias */}
        {ferias.length === 0 ? (
          <div className="no-data-message">
            Nenhum período de férias cadastrado.
          </div>
        ) : (
          <div className="table-container">
            <table className="ferias-table">
              <thead>
                <tr>
                  <th>Servidor</th>
                  <th>Início</th>
                  <th>Término</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                {ferias.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.inicio ? format(item.inicio, "dd/MM/yyyy", { locale: ptBR }) : 'Não informado'}</td>
                    <td>{item.fim ? format(item.fim, "dd/MM/yyyy", { locale: ptBR }) : 'Não informado'}</td>
                    <td>
                      {item.inicio && item.fim
                        ? `${Math.ceil((item.fim - item.inicio) / (1000 * 60 * 60 * 24))} dias`
                        : 'Dados incompletos'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
