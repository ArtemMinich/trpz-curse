import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '0 20px'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '60px'
      }}>
        <Link to="/" style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textDecoration: 'none',
          color: '#007bff'
        }}>
          TRPZ Opportunities
        </Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/opportunities" style={{ textDecoration: 'none', color: '#333' }}>
              Можливості
            </Link>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#333' }}>
              Профіль
            </Link>
            <span>Привіт, {user.name}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Вийти
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-primary">Увійти</Link>
            <Link to="/register" className="btn btn-secondary">Реєстрація</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;