import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');
    const token = params.get('token');
    if (email) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('user', JSON.stringify({ email, name, token }));
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;