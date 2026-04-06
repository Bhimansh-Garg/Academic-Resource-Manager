import { useState, useEffect } from 'react';
import { authFetch } from '../api/client';
import { Link } from 'react-router-dom';

export const MyUploadsPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/resources?uploaded_by=me`);
      const data = await res.json();
      if (res.ok) {
        setResources(data);
      }
    } catch (err) {
      console.error("Failed to fetch my uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/resources/${resourceId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        window.open(res.url, '_blank');
      }
    } catch (err) {
      console.error("Download failed");
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === 'approved') return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded border border-green-200">✓ Verified</span>;
    if (status === 'rejected') return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded border border-red-200">Rejected</span>;
    return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded border border-gray-300">Pending</span>;
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-2 border-b-2 border-gold flex justify-between items-center">
        <h2 className="text-2xl font-serif text-navy-900 font-bold uppercase">My Uploads</h2>
        
        <Link 
          to="/dashboard/upload"
          className="bg-navy-900 text-white font-bold py-2 px-4 rounded shadow-sm hover:bg-gold hover:text-navy-900 transition-colors uppercase tracking-wider text-sm flex items-center gap-2"
        >
          <span className="text-lg">⊕</span> New Upload
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => (
             <div key={n} className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col gap-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-300 rounded mt-4 w-full"></div>
             </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <div className="text-5xl mb-4 text-gray-400">📁</div>
          <h3 className="text-xl font-bold text-gray-600 mb-2">You haven't uploaded any resources yet.</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Share your knowledge with your peers by uploading class notes, past papers, or assignments to the platform.</p>
          <Link 
            to="/dashboard/upload"
            className="inline-block bg-navy-900 text-white font-bold py-3 px-8 rounded shadow-sm hover:bg-gold hover:text-navy-900 transition-colors uppercase tracking-wider text-sm"
          >
            Upload First Resource
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {resources.map(res => (
            <div key={res.id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-navy-900 line-clamp-2 leading-tight flex-1 mr-2" title={res.title}>
                    {res.title}
                  </h3>
                  <StatusBadge status={res.verification_status} />
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm border border-gray-200 bg-gray-50 px-2 py-1 rounded inline-block text-gray-800 font-medium w-full truncate">
                    <span className="font-bold text-navy-900 mr-2">SEM-{res.semester}</span> {res.subject_name}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide flex items-center justify-between">
                    <span>Uploaded on: {new Date(res.created_at).toLocaleDateString()}</span>
                    <span>v{res.version}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {res.download_count} Downloads
                </span>
                <button 
                  onClick={() => handleDownload(res.id)}
                  className="px-4 py-2 bg-navy-900 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-gold hover:text-navy-900 transition-colors flex items-center gap-1"
                >
                  Download ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
