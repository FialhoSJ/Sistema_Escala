import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth';
import './admin.css';
import {
    addDoc,
    collection,
} from 'firebase/firestore';


export default function Admin() {
    const [escalainput, setEscalaInput] = useState('');
    const [user, setUser] = useState({});

    useEffect(() =>{
        async function loadEscalas() {
            const userDetails = localStorage.getItem('@userData');
            setUser(JSON.parse(userDetails));
        }

        loadEscalas();
    },[])

    async function handleRegister(e){
        e.preventDefault();

        if(escalainput === '') {
            alert("Preencha todos os campos!");
            return;
        }

        await addDoc(collection(db, 'escalas'), {
            escalas: escalainput,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            setEscalaInput('');
            alert("Escala registrada com sucesso!");
        })
        .catch((error) => {
            console.log("ERROR AO REGISTRAR" + error);
            alert("Erro ao registrar escala!");
        })

    }

    async function handleLogout() {
        await signOut(auth);
    }

    return (
        <div className='admin-container'>
            <h1>Escalas</h1>

            <form className="form-container" onSubmit={handleRegister}>
                <textarea
                    placeholder='Digite aqui sua escala...'
                    value={escalainput}
                    onChange={(e) => setEscalaInput(e.target.value)}
                />

                <button className='form-button' type="submit">Registrar Escala</button>
            </form>

            <article className='list'>
                <p>Antonio Lemos</p>

                <div>
                    <button>Editar</button>
                    <button className='btn-concluir'>Concluir</button>
                </div>
            </article>

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}