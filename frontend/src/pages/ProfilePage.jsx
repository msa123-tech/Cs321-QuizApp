import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { JAVA_BASICS_LESSONS } from '../data/lessons';
import '../styles/gamified.css';

function ProfilePage() {
  const { user } = useAuth();
  const { xp, lessonsCompleted } = useGamification();

  const displayName = user?.username || user?.email || 'Learner';
  const initial = (displayName[0] || '?').toUpperCase();
  const pathTotal = JAVA_BASICS_LESSONS.length;
  const pathProgress = Math.min(lessonsCompleted, pathTotal);

  return (
    <>
      <TopBar title="Profile" />
      <main className="shell-main shell-scroll">
        <section className="profile-card profile-card--enter">
          <div className="profile-avatar" aria-hidden="true">
            {initial}
          </div>
          <h2 className="profile-name">{displayName}</h2>
          <div className="profile-xp-pill">
            <span className="profile-xp-value">{xp}</span>
            <span className="profile-xp-label">total XP</span>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{lessonsCompleted}</span>
              <span className="profile-stat-label">Lessons completed</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">
                {pathProgress}/{pathTotal}
              </span>
              <span className="profile-stat-label">Java Basics path</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ProfilePage;
