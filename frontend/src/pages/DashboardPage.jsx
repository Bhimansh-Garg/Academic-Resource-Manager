import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components/Header';

export const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  const getRoleMessage = (role) => {
    switch (role) {
      case 'student': return "You can browse and upload resources.";
      case 'faculty': return "You can verify submitted resources.";
      case 'admin': return "You can manage users and the system.";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 border-b-2 border-gold pb-4">
          <h2 className="text-2xl font-serif text-navy-900 font-bold uppercase">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-2 font-sans font-medium text-lg">
            {user ? getRoleMessage(user.role) : 'Loading...'}
          </p>
        </div>

        {/* ERP Style Module Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          
          <div className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center gap-4 group">
            <div className="text-3xl">📚</div>
            <h3 className="text-black font-bold uppercase tracking-wide group-hover:text-navy-900 transition-colors">
              Academic Resources
            </h3>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center gap-4 group">
            <div className="text-3xl">📋</div>
            <h3 className="text-black font-bold uppercase tracking-wide group-hover:text-navy-900 transition-colors">
              Verification Portal
            </h3>
          </div>

          <div className="bg-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center gap-4 group">
            <div className="text-3xl">⚙️</div>
            <h3 className="text-black font-bold uppercase tracking-wide group-hover:text-navy-900 transition-colors">
              System Settings
            </h3>
          </div>

        </div>
      </main>
    </div>
  );
};
