import { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "./listaferias.css";
import Sidebar from '../Sidebar/siderbar';
import { getAuth } from 'firebase/auth';

export default function Ferias() {
  const [ferias, setFerias] = useState([]);
  const [servidores, setServidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para o formulário
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
      setError('Erro ao carregar servidores.');
    }
  }

  // Função para carregar férias
  async function carregarFerias() {
    try {
      const snapshot = await getDocs(collection(db, 'ferias'));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        inicio: doc.data().inicio?.toDate() || null,
        fim: doc.data().fim?.toDate() || null
      }));
      setFerias(lista);
    } catch (error) {
      console.error('Erro ao carregar férias:', error);
      setError('Erro ao carregar férias.');
    } finally {
      setLoading(false);
    }
  }

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

    const servidor = servidores.find(s => s.name === servidorSelecionado);

    try {
      await addDoc(collection(db, 'ferias'), {
        servidorId: servidorSelecionado,
        nome: servidor?.name || 'Desconhecido',
        inicio: new Date(inicio),
        fim: new Date(fim),
        status: 'pendente',
        userUid: user.uid,
      });

      alert('Férias cadastradas com sucesso!');
      setServidorSelecionado('');
      setInicio('');
      setFim('');
      carregarFerias();
    } catch (error) {
      console.error('Erro ao cadastrar férias:', error);
      alert('Erro ao cadastrar férias. Tente novamente.');
    }
  }

  // Função para remover férias
  async function removerFerias(id) {
    const confirmar = window.confirm('Tem certeza que deseja remover este período de férias?');
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'ferias', id));
      alert('Férias removidas com sucesso!');
      carregarFerias();
    } catch (error) {
      console.error('Erro ao remover férias:', error);
      alert('Erro ao remover férias. Tente novamente.');
    }
  }

  // useEffect para carregar dados ao montar o componente
  useEffect(() => {
    carregarServidores();
    carregarFerias();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar />
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
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fim">Término:</label>
            <input
              type="date"
              id="fim"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              autoComplete="off"
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
                  <th>Ações</th>
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
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => removerFerias(item.id)}
                      >
                        Remover
                      </button>
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