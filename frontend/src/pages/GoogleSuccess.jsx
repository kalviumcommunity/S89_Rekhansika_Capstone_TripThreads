import { useEffect } from 'react';

const GoogleSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const name = params.get('name');
    const token = params.get('token');
    if (email) {
      localStorage.setItem('user', JSON.stringify({ email, name, token }));
      localStorage.setItem('userEmail', email); // <-- This line is required!
      window.location.href = '/home';
    } else {
      window.location.href = '/login';
    }
  }, []);

  return <div>Logging you in...</div>;
};

export default GoogleSuccess;