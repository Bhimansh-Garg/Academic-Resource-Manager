import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-navy-900 border-b-4 border-gold py-4 px-6 text-center">
            <h2 className="text-xl font-serif text-white font-bold tracking-wider">NEW REGISTRATION</h2>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded text-sm border border-green-200">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  name="role"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 transition-colors bg-gray-50 focus:bg-white text-gray-900"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-navy-900 text-white font-medium py-3 px-4 rounded hover:bg-gold hover:text-navy-900 transition-colors uppercase tracking-wider text-sm mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-900"
              >
                Register Account
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-navy-900 font-semibold hover:underline">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
