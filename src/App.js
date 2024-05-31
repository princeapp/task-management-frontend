import {React, useContext} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
// import Logout from './components/Auth/Logout';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import Categories from './components/Category';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <AuthContext.Consumer>
          {({ isAuthenticated }) => (
            <>
              {isAuthenticated && <Navbar />}
              <Routes>
                <Route path="/login" element={<ProtectedRoute inverse><Login /></ProtectedRoute>} />
                <Route path="/register" element={<ProtectedRoute inverse><Register /></ProtectedRoute>} />
                {/* <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} /> */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/task" element={<PrivateRoute><Task /></PrivateRoute>} />
                <Route path="/category" element={<PrivateRoute><Categories /></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </>
          )}
        </AuthContext.Consumer>
      </Router>
    </AuthProvider>
  );
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const ProtectedRoute = ({ children, inverse = false }) => {
  const { isAuthenticated } = useContext(AuthContext);
  if (inverse) {
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
