import { useState, useEffect } from 'react';
import { authFetch } from '../api/client';

export const UploadResourcePage = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await authFetch('/api/subjects');
      const data = await res.json();
      if (res.ok) setSubjects(data);
    } catch (err) {
      console.error("Failed to load subjects");
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.file) {
      setError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subject_id', formData.subject_id);
    payload.append('file', formData.file);

    try {
      // Direct fetch to allow FormData to set Content-Type correctly with boundary
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/resources/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: payload
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setSuccess("Resource uploaded successfully! It is pending faculty verification.");
      setFormData({ title: '', subject_id: '', file: null });
      // Reset file input via ID
      document.getElementById('fileUploadInput').value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-navy-900 border-b-2 border-gold py-3 px-6">
          <h2 className="text-lg font-serif text-white font-bold uppercase tracking-wide">Upload Academic Resource</h2>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded text-sm border border-red-200 font-medium">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded text-sm border border-green-200 font-medium">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Resource Title</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 bg-gray-50 focus:bg-white transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Operating Systems Notes - Unit 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Subject</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-navy-900 focus:border-navy-900 bg-gray-50 focus:bg-white transition-colors"
                value={formData.subject_id}
                onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} (Semester {sub.semester}) - {sub.department_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">File Attachment</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-navy-900 transition-colors bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="fileUploadInput" className="relative cursor-pointer bg-white rounded-md font-medium text-navy-900 hover:text-gold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy-900 px-1">
                      <span>Upload a file</span>
                      <input id="fileUploadInput" name="file" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg" required />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, PPT, PNG, JPG up to 10MB</p>
                </div>
              </div>
              {formData.file && (
                <p className="mt-2 text-sm text-green-600 font-medium font-sans">
                  Selected: {formData.file.name}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-navy-900 text-white font-bold rounded shadow-sm hover:bg-gold hover:text-navy-900 transition-colors uppercase tracking-wider text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
