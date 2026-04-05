import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components/Header';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-navy-900 border-b-4 border-gold py-4 px-6 text-center">
            <h2 className="text-xl font-serif text-white font-bold tracking-wider">PORTAL LOGIN</h2>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-navy-900 text-white font-medium py-3 px-4 rounded hover:bg-gold hover:text-navy-900 transition-colors uppercase tracking-wider text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              New User? <Link to="/register" className="text-navy-900 font-semibold hover:underline">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
