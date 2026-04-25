import { useEffect, useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import { fetchUserProgress } from '../api/progressApi';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { LEARN_TOPICS } from '../data/lessons';
import '../styles/gamified.css';

function ProfilePage() {
  const { user, token } = useAuth();
  const { xp } = useGamification();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setProgress(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    fetchUserProgress(user.id, token)
      .then((response) => {
        if (!active) return;
        setProgress(response.data || null);
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to load profile progress right now.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, token]);

  const playCleared = [
    progress?.easyCleared,
    progress?.mediumCleared,
    progress?.hardCleared,
  ].filter(Boolean).length;

  const displayName = user?.username || user?.email || 'Learner';
  const initial = (displayName[0] || '?').toUpperCase();
  const topicTotal = LEARN_TOPICS.length;

  return (
    <>
      <TopBar title="Profile" />
      <main className="shell-main shell-scroll">
        <ErrorMessage message={error} />
        {loading ? (
          <LoadingSpinner label="Loading profile..." />
        ) : (
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
        )}
      </main>
    </>
  );
}

export default ProfilePage;
