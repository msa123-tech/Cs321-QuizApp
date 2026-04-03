import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/dashboard', label: 'Home', icon: '🏠' },
  { to: '/learn', label: 'Learn', icon: '📚' },
  { to: '/practice', label: 'Practice', icon: '🎯' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {LINKS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-link${isActive ? ' bottom-nav-link--active' : ''}`}
          end={to === '/dashboard'}
        >
          <span className="bottom-nav-icon" aria-hidden="true">
            {icon}
          </span>
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
