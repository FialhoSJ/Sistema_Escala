import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '../../firebaseConnection';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function Escala() {
  const [servidores, setServidores] = useState([]);
  const [servidorSelecionado, setServidorSelecionado] = useState('');
  const [data, setData] = useState('');
  const [baseSelecionada, setBaseSelecionada] = useState('Base Antônio Lemos (Breves) - 1 Quinzena');
  const [escalas, setEscalas] = useState({});
  const [usuario, setUsuario] = useState(null);
  const [ferias, setFerias] = useState([]);


  const bases = [
    'Base Antônio Lemos (Breves) - 1 Quinzena',
    'Base Antônio Lemos (Breves) - 2 Quinzena',
    'Base Candiru (Óbidos) - 1 Quinzena',
    'Base Candiru (Óbidos) - 2 Quinzena',
    'Base Abaetetuba - 1 Quinzena',
    'Base Abaetetuba - 2 Quinzena'
  ];

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        carregarServidores();
        carregarEscalas();
        carregarFerias(); // <-- adiciona aqui
      } else {
        console.error('Usuário não autenticado.');
        alert('Você precisa estar autenticado para acessar os dados.');
        realizarLogin();
      }
    });
  }, []);
  

  async function realizarLogin() {
    const auth = getAuth();
    try {
      // Substitua pelo email e senha do usuário
      const email = 'usuario@exemplo.com';
      const senha = 'senha123';
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      setUsuario(userCredential.user);
      console.log('Usuário autenticado:', userCredential.user);
      carregarServidores();
      carregarEscalas();
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Verifique suas credenciais.');
    }
  }

  async function carregarFerias() {
    try {
      const snapshot = await getDocs(collection(db, 'ferias'));
      const lista = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        lista.push({
          id: doc.id,
          ...data,
          inicio: data.inicio?.toDate ? data.inicio.toDate() : null, // Converter para Date
          fim: data.fim?.toDate ? data.fim.toDate() : null // Converter para Date
        });
      });
      console.log('Férias carregadas:', lista); // Depuração
      setFerias(lista);
    } catch (error) {
      console.error('Erro ao carregar férias:', error);
    }
  }
  

  async function carregarServidores() {
    try {
      const snapshot = await getDocs(collection(db, 'servidores'));
      let lista = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name) { // Verifica se o campo 'name' existe
          lista.push({ id: doc.id, ...data });
        }
      });
      console.log('Servidores carregados:', lista); // Depuração
      setServidores(lista);
    } catch (error) {
      console.error('Erro ao carregar servidores:', error);
    }
  }

  async function carregarEscalas() {
    try {
      const querySnapshot = await getDocs(collection(db, 'escalas'));
      const dados = {};
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        if (item.base) { // Verifica se o campo 'base' existe
          if (!dados[item.base]) dados[item.base] = [];
          dados[item.base].push({ ...item, id: doc.id });
        }
      });
      console.log('Escalas carregadas:', dados); // Depuração
      setEscalas(dados);
    } catch (error) {
      console.error('Erro ao carregar escalas:', error);
    }
  }

  async function adicionarServidor() {
    if (!servidorSelecionado || !data) {
      return alert('Preencha todos os campos.');
    }

    // Verificar se o servidor está de férias na data selecionada
    const feriasServidor = ferias.find(f => f.nome === servidorSelecionado);

    if (feriasServidor) {
      const inicio = feriasServidor.inicio;
      const fim = feriasServidor.fim;

      if (inicio instanceof Date && fim instanceof Date) {
        alert(`Período de férias do servidor: ${inicio.toLocaleDateString()} a ${fim.toLocaleDateString()}`);
      } else {
        console.error('As datas de início ou fim não são válidas:', { inicio, fim });
        alert('Erro ao carregar o período de férias. Verifique os dados.');
        return;
      }

      const dataSelecionada = new Date(data);
      if (dataSelecionada >= inicio && dataSelecionada <= fim) {
        alert('Este servidor está de férias nesta data e não pode ser adicionado na escala.');
        return;
      }
    }

    // Adicionar o servidor à escala
    try {
      await addDoc(collection(db, 'escalas'), {
        nome: servidorSelecionado,
        data,
        base: baseSelecionada,
        userUid: usuario.uid
      });

      setServidorSelecionado('');
      setData('');
      carregarEscalas();
    } catch (error) {
      console.error('Erro ao adicionar servidor:', error);
    }
  }
  
  async function removerServidor(id) {
    try {
      await deleteDoc(doc(db, 'escalas', id));
      carregarEscalas();
    } catch (error) {
      console.error('Erro ao remover servidor:', error);
    }
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Adicionar Servidores</h2>

        <select
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

        <input
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />

        <select
          value={baseSelecionada}
          onChange={(e) => setBaseSelecionada(e.target.value)}
        >
          {bases.map((base, index) => (
            <option key={index} value={base}>
              {base}
            </option>
          ))}
        </select>

        <button onClick={adicionarServidor}>Adicionar</button>
        <button className="danger" onClick={() => setEscalas({})}>Limpar Tudo (visual)</button>
        <button onClick={() => {
          const doc = new jsPDF();

          doc.setFontSize(18);
          doc.text('Escalas de Viagens', 14, 20);

          let y = 30; // Começa um pouco mais embaixo pra dar espaço

          for (const base in escalas) {
            doc.setFontSize(14);
            doc.text(base, 14, y);
            y += 6;

            const tableData = escalas[base].map(item => [
              item.nome,
              item.data ? item.data.split('-').reverse().join('/') : ''
            ]);

            autoTable(doc, {
              head: [['Nome', 'Data']],
              body: tableData,
              startY: y,
              styles: { fontSize: 10 },
              headStyles: { fillColor: [41, 128, 185] }, 
              margin: { left: 14, right: 14 },
              theme: 'striped', 
            });

            y = doc.lastAutoTable.finalY + 10; // Começa depois da tabela
          }

          doc.save('escalas.pdf');
        }}>
          Gerar PDF
        </button>

      </div>

      <div className="main">
        <h1>Escala de Viagens</h1>
        <div className="cards">
          {[...new Set(bases.map((b) => b.split(' - ')[0]))].map((basePrincipal) => (
            <div key={basePrincipal} className="card">
              <h3>{basePrincipal}</h3>
              {[1, 2].map((q) => (
                <div key={q}>
                  <strong>{q} - Quinzena</strong>
                  <ul>
                    {(escalas[`${basePrincipal} - ${q} Quinzena`] || []).map((item) => (
                      <li key={item.id}>
                        {item.nome} - {item.data?.split('-').reverse().join('/')}
                        <button className="remove" onClick={() => removerServidor(item.id)}>x</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}