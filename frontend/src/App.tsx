import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Organizations from './pages/Organizations';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import Map from './pages/Map';
import BankDashboard from './pages/BankDashboard';
// import LayoutMap from './components/LayoutMap';
import GovernmentDashboard from './pages/GovernmentDashboard';
import TypicalOrgDashboard from './pages/TypicalOrgDashboard';
// import Rangs from './pages/Rangs';
import FullWidthLayout from './components/FullWidthLayout';
import UserProfile from './pages/UserProfile';
import TypicalSuborgDashboard from './pages/TypicalSuborgDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<PrivateRoute><FullWidthLayout><Map /></FullWidthLayout></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><FullWidthLayout><Profile /></FullWidthLayout></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute><FullWidthLayout><UserProfile /></FullWidthLayout></PrivateRoute>} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/organizations" element={<Organizations />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/banks/dashboard/:id" element={<BankDashboard />} />
                    <Route path="/government/dashboard/:id" element={<GovernmentDashboard />} />
                    <Route path="/org/dashboard/:id" element={<TypicalOrgDashboard />} />
                    <Route path="/suborg/dashboard/:id" element={<TypicalSuborgDashboard />} />
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

