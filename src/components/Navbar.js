import React, {useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/Navbar.css';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/task">Tasks</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </ul>
      <ul className="navbar-user">
        {username && (
          <li>
            <span>{username}</span>
          </li>
        )}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
