import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Outlet, NavLink } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return <div className="p-8">Loading...</div>;

  const links = [];

  // Common link
  links.push({ to: '/dashboard/browse', label: 'Browse Resources', icon: '📚' });

  if (user.role === 'student' || user.role === 'faculty' || user.role === 'admin') {
    links.push({ to: '/dashboard/upload', label: 'Upload Resource', icon: '📤' });
    links.push({ to: '/dashboard/my-uploads', label: 'My Uploads', icon: '📁' });
  }

  if (user.role === 'faculty') {
    links.push({ to: '#', label: 'Pending Verifications (Coming Soon)', icon: '📋' });
  }

  if (user.role === 'admin') {
    links.push({ to: '#', label: 'Manage Users (Coming Soon)', icon: '⚙️' });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-navy-900 border-r border-navy-900 text-white transition-all duration-300 flex flex-col shadow-lg z-10`}>
          <div className="p-4 flex items-center justify-between border-b border-gray-700">
            {sidebarOpen && <span className="font-bold tracking-wider text-sm text-gold uppercase">Navigation</span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300 hover:text-white">
              ☰
            </button>
          </div>
          
          <nav className="flex-1 py-4 space-y-1">
            {links.map((link, idx) => (
              link.to === '#' ? (
                <div key={idx} className="flex items-center px-4 py-3 text-gray-400 text-sm cursor-not-allowed border-l-4 border-transparent">
                  <span className="mr-3 text-lg opacity-50">{link.icon}</span>
                  {sidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
                </div>
              ) : (
                <NavLink
                  key={idx}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm transition-colors border-l-4 ${
                      isActive 
                      ? 'bg-navy-900 border-gold text-gold font-bold shadow-[inset_0_3px_6px_rgba(0,0,0,0.16)]' 
                      : 'border-transparent text-gray-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <span className={`mr-3 text-lg`}>{link.icon}</span>
                  {sidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
                </NavLink>
              )
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
