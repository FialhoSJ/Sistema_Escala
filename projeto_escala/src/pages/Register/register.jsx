import { useState } from 'react';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { createUserWithEmailAndPassword } from 'firebase/auth';
 
export default function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();

        if(email !== '' && password !== '') {
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Cadastrado com sucesso!");
                navigate('/admin', {replace: true});
            })
            .catch((error) => {
                console.log(error);
                alert("Erro ao cadastrar!");
            });
            
        }else{
                alert("Preencha todos os campos!");
            }
    }
    
    return (
        <div className='home-container'>
        <h1>Cadastre-se</h1>

        <form className='form-container' onSubmit={handleRegister}>
            <input type="text" placeholder='Digite seu email...' value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder='Digite sua senha...' value={password} onChange={(e) => setPassword(e.target.value)} />

            <button className='form-button' type='submit'>Cadastrar</button>
        </form>

        <Link className='link-button' to='/'>
            Ja possui uma conta? faça o Login!
        </Link>

        </div>
    )
};
