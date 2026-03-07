import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Organizations from './pages/Organizations';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Admin from './pages/Admin';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/organizations" element={<Organizations />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/users/:id" element={<UserProfile />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

