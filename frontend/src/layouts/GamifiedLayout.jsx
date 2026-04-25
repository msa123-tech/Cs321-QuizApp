import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function GamifiedLayout() {
  return (
    <div className="app-shell gamified-bg">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default GamifiedLayout;
