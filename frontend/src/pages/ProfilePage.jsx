import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { LEARN_TOPICS } from '../data/lessons';
import { readPlayProgress } from '../data/playProgress';
import '../styles/gamified.css';

function ProfilePage() {
  const { user } = useAuth();
  const { xp } = useGamification();
  const play = readPlayProgress();
  const playCleared = [play.easy, play.medium, play.hard].filter(Boolean).length;

  const displayName = user?.username || user?.email || 'Learner';
  const initial = (displayName[0] || '?').toUpperCase();
  const topicTotal = LEARN_TOPICS.length;

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
              <span className="profile-stat-value">
                {playCleared}/3
              </span>
              <span className="profile-stat-label">Play difficulties cleared</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{topicTotal}</span>
              <span className="profile-stat-label">Learn topics</span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ProfilePage;
