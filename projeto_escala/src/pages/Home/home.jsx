import { useState } from 'react';
import React from 'react';
import { Link} from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';	
import './home.css';

export default function Home() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        if(email !== '' && password !== '') {
            
            await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('/escala', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                alert("Erro ao fazer login!");
            });

        }else{
                alert("Preencha todos os campos!");
            }
    }
    
    return (
        <div className='home-container'>
        <h1>Escala NT</h1>

        <form className='form-container' onSubmit={handleLogin}>
            <input type="text" placeholder='Digite seu email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input autoComplete={false} type="password" placeholder='Digite sua senha...' value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className='form-button' type='submit'>Acessar</button>
        </form>

        <Link className='link-button' to='/register'>
            Não possui uma conta? Cadastre-se
        </Link>

        </div>
    )
};
