import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      padding: '1rem', 
      borderBottom: '1px solid #ccc', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
        FitPlanHub
      </Link>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/">Home</Link>
        
        {user ? (
          <>
            {user.role === 'trainer' ? (
               <Link to="/trainer-dashboard">My Dashboard</Link>
            ) : (
               <>
                 <Link to="/feed">My Feed</Link>
                 <Link to="/my-subscriptions">Subscriptions</Link>
               </>
            )}
            
            <span>Hello, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

