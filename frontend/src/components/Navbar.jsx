import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar({ title = 'Code Quiz Platform', showQuizButton = false, xp = null }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1>{title}</h1>
        {user?.username && <span className="navbar-user">Hi, {user.username}</span>}
      </div>
      <div className="navbar-right">
        {typeof xp === 'number' && <span className="xp-chip">XP: {xp}</span>}
        {showQuizButton && (
          <button className="secondary-btn" onClick={() => navigate('/quiz')}>
            Back to Quiz
          </button>
        )}
        <button className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
