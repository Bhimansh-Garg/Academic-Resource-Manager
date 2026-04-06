import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowseResourcesPage } from './pages/BrowseResourcesPage';
import { UploadResourcePage } from './pages/UploadResourcePage';
import { MyUploadsPage } from './pages/MyUploadsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      >
        <Route index element={<Navigate to="browse" replace />} />
        <Route path="browse" element={<BrowseResourcesPage />} />
        <Route path="upload" element={<UploadResourcePage />} />
        <Route path="my-uploads" element={<MyUploadsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
