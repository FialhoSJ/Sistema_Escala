import { useState } from 'react';
import { db } from '../../firebaseConnection';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Importar o auth

export default function CadastroServidor() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  async function handleAddServidor(e) {
    e.preventDefault();

    if (name.trim() === '') {
      alert('Por favor, preencha o nome do servidor.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Usuário não autenticado.');
      return;
    }

    try {
      await addDoc(collection(db, 'servidores'), {
        name,
        userUid: user.uid,                 // Pegando o UID do usuário
        createdAt: serverTimestamp()        // Usando timestamp correto
      });
      alert('Servidor cadastrado com sucesso!');
      setName('');
      // navigate('/admin'); // Ou a página que você quiser
    } catch (error) {
      console.error("Erro ao cadastrar servidor: ", error);
      alert('Erro ao cadastrar servidor.');
    }
  }

  return (
    <div className='home-container'>
      <h1>Cadastro de Servidor</h1>
      <form className='form-container' onSubmit={handleAddServidor}>
        <input
          type="text"
          placeholder="Nome do servidor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className='form-button' type='submit'>Cadastrar Servidor</button>
      </form>
    </div>
  );
}
