import { useState, useEffect } from "react";
import { auth } from './firebaseConnection';
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";

export default function Private({children}) {
    const [loading, setLoading] = useState(true);
    const [signed, setSigned] = useState(false);


    useEffect(() => {
        async function checkLogin() {
            const unsub = onAuthStateChanged(auth, (user) => {
                //se tem um user logado
                if(user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                    }
                    localStorage.setItem('@userData', JSON.stringify(userData));
                    setLoading(false);
                    setSigned(true);
                }else{
                    //se não tem um user logado
                    setLoading(false);
                    setSigned(false);
                }
            })
        }
        checkLogin();
    },[])

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <h1>Carregando...</h1>
            </div>
        )
    }

    if(!signed){
        return <Navigate to="/" />
    }

    return (children);
}