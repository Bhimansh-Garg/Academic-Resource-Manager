import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="h-1 bg-gold w-full"></div>
      <header className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-full p-1 border-2 border-gold h-12 w-12 flex items-center justify-center">
            {/* Placeholder logo */}
            <span className="text-navy-900 font-bold text-xl leading-none">NITJ</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold uppercase tracking-wide">National Institute of Technology Jalandhar</h1>
            <p className="text-xs text-gray-300">Internal Academic Resource & Notes Exchange</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <div className="text-sm">
                <span className="text-gold font-medium">Welcome {user.name}</span>
                <span className="text-gray-300 ml-2 border-l border-gray-600 pl-2 capitalize">{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-gold transition-colors text-sm font-medium flex items-center gap-1"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="text-gold font-medium text-sm">
              | ERP - NITJ |
            </div>
          )}
        </div>
      </header>
    </>
  );
};
