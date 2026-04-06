import { useState, useEffect } from 'react';
import { authFetch } from '../api/client';

export const BrowseResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    keyword: '',
    semester: '',
    subject_id: '',
    status: ''
  });

  useEffect(() => {
    fetchSubjects();
    fetchResources();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await authFetch('/api/subjects');
      const data = await res.json();
      if (res.ok) setAllSubjects(data);
    } catch (err) {
      console.error("Failed to fetch subjects");
    }
  };

  const fetchResources = async (currentFilters = filters) => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (currentFilters.keyword) params.append('keyword', currentFilters.keyword);
      if (currentFilters.semester) params.append('semester', currentFilters.semester);
      if (currentFilters.subject_id) params.append('subject_id', currentFilters.subject_id);
      if (currentFilters.status) params.append('status', currentFilters.status);

      const res = await authFetch(`/api/resources?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setResources(data);
      }
    } catch (err) {
      console.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      // Reset subject if semester changes
      if (name === 'semester') {
        newFilters.subject_id = '';
      }
      return newFilters;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources(filters);
  };

  const handleClear = () => {
    const resetFilters = { keyword: '', semester: '', subject_id: '', status: '' };
    setFilters(resetFilters);
    fetchResources(resetFilters);
  };

  const handleDownload = async (resourceId) => {
    // Open in new tab, the server redirects it to the static URL natively
    const token = localStorage.getItem('token');
    
    // We can fetch to trigger the download count
    try {
      const res = await fetch(`http://localhost:5000/api/resources/${resourceId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // The fetch redirect follows to the static asset. We can parse the URL and open it.
      if (res.ok) {
        window.open(res.url, '_blank');
      }
    } catch (err) {
      console.error("Download failed");
    }
  };

  // Derive available subjects based on selected semester
  const availableSubjects = filters.semester 
    ? allSubjects.filter(sub => sub.semester.toString() === filters.semester)
    : allSubjects;

  const StatusBadge = ({ status }) => {
    if (status === 'approved') return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded border border-green-200">✓ Verified</span>;
    if (status === 'rejected') return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded border border-red-200">Rejected</span>;
    return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded border border-gray-300">Pending</span>;
  };

  return (
    <div className="w-full">
      <div className="mb-6 pb-2 border-b-2 border-gold flex justify-between items-center">
        <h2 className="text-2xl font-serif text-navy-900 font-bold uppercase">Browse Resources</h2>
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Semester</label>
            <select name="semester" value={filters.semester} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Subject</label>
            <select name="subject_id" value={filters.subject_id} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
              <option value="">All Subjects</option>
              {availableSubjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Search Keyword</label>
            <input 
              type="text" 
              name="keyword"
              placeholder="Title keyword..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
            />
          </div>

          <div className="md:col-span-1 flex space-x-2">
            <button type="submit" className="flex-1 bg-navy-900 text-white font-bold py-2 rounded text-sm uppercase hover:bg-gold hover:text-navy-900 transition-colors">
              Search
            </button>
            <button type="button" onClick={handleClear} className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded text-sm uppercase hover:bg-gray-400 transition-colors">
              Clear
            </button>
          </div>

        </form>
      </div>

      {/* Resource Grid */}
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
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <div className="text-4xl mb-4 text-gray-400">📂</div>
          <h3 className="text-lg font-bold text-gray-600">No resources found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or clearing the search keyword.</p>
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
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">👤</span> Uploaded by: <span className="font-semibold ml-1">{res.uploaded_by_name}</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    Uploaded on: {new Date(res.created_at).toLocaleDateString()}
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
