import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';

function TopBar({
  title = 'CodePath',
  showBack = false,
  backTo = '/dashboard',
  subtitle,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { xp } = useGamification();

  return (
    <header className="top-bar">
      <div className="top-bar-leading">
        {showBack && (
          <button
            type="button"
            className="top-bar-back"
            onClick={() => navigate(backTo)}
            aria-label="Go back"
          >
            ←
          </button>
        )}
        <div className="top-bar-titles">
          <h1 className="top-bar-title">{title}</h1>
          {subtitle && <p className="top-bar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="top-bar-xp" aria-label={`${xp} experience points`}>
        <span className="top-bar-xp-glow" aria-hidden="true" />
        <span className="top-bar-xp-value">{xp}</span>
        <span className="top-bar-xp-label">XP</span>
      </div>

      <button
        type="button"
        className="top-bar-logout"
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Log out
      </button>
    </header>
  );
}

export default TopBar;
