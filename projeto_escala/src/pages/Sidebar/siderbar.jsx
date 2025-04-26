import { useNavigate } from 'react-router-dom';
import { FaHome, FaBullhorn, FaUserCog, FaUserPlus } from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '250px',
      backgroundColor: '#f8f9fa',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      padding: '20px',
      zIndex: 1000
    }}>
      <img 
        src="https://pisp.segup.pa.gov.br/static/media/segup.c19e474c.png" 
        alt="Logo Pará" 
        style={{ width: '100%', marginBottom: '20px' }}
      />
      <h4>Menu Principal</h4>
      <button 
        style={buttonStyle} 
        onClick={() => navigate('/')}
      >
        <FaHome style={{ marginRight: '10px' }} /> Página Inicial
      </button>

      <button 
        style={buttonStyle} 
        onClick={() => navigate('/escala')}
      >
        <FaBullhorn style={{ marginRight: '10px' }} /> Escalas
      </button>

      <button 
        style={buttonStyle} 
        onClick={() => navigate('/cadastro')}
      >
        <FaUserCog style={{ marginRight: '10px' }} /> Cadastro
      </button>

    </div>
  );
}

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  backgroundColor: '#ffffff',
  border: '1px solid #ced4da',
  borderRadius: '5px',
  cursor: 'pointer',
  textAlign: 'left'
};
