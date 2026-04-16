import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { readPlayProgress } from '../data/playProgress';
import '../styles/gamified.css';

function DashboardPage() {
  const navigate = useNavigate();
  const progress = readPlayProgress();

  const mediumLocked = !progress.easy;
  const hardLocked = !progress.medium;

  const startDifficulty = (level, locked) => {
    if (locked) return;
    navigate(`/quiz?difficulty=${level}&from=dashboard`);
  };

  return (
    <>
      <TopBar title="Play" subtitle="Pick a difficulty" />
      <main className="shell-main shell-scroll">
        <section className="section-card section-card--enter">
          <div className="section-card-header">
            <h2 className="section-card-title">Challenges</h2>
            <p className="section-card-desc">
              Finish Easy to unlock Medium, then Medium to unlock Hard.
            </p>
          </div>

          <div className="play-diff-grid">
            <button
              type="button"
              className="play-diff-card play-diff-card--easy play-diff-card--enter"
              onClick={() => startDifficulty('easy', false)}
            >
              <span className="play-diff-icon" aria-hidden="true">
                🌱
              </span>
              <h3 className="play-diff-title">Easy</h3>
              <p className="play-diff-desc">10 questions · +10 XP each</p>
              <span className="play-diff-cta">Start</span>
            </button>

            <button
              type="button"
              className={`play-diff-card play-diff-card--enter${mediumLocked ? ' play-diff-card--locked' : ' play-diff-card--medium'}`}
              disabled={mediumLocked}
              onClick={() => startDifficulty('medium', mediumLocked)}
              aria-disabled={mediumLocked}
            >
              <span className="play-diff-icon" aria-hidden="true">
                {mediumLocked ? '🔒' : '⚡'}
              </span>
              <h3 className="play-diff-title">Medium</h3>
              <p className="play-diff-desc">
                {mediumLocked ? 'Complete Easy first' : '10 questions · +15 XP each'}
              </p>
              {!mediumLocked && <span className="play-diff-cta">Start</span>}
            </button>

            <button
              type="button"
              className={`play-diff-card play-diff-card--enter${hardLocked ? ' play-diff-card--locked' : ' play-diff-card--hard'}`}
              disabled={hardLocked}
              onClick={() => startDifficulty('hard', hardLocked)}
              aria-disabled={hardLocked}
            >
              <span className="play-diff-icon" aria-hidden="true">
                {hardLocked ? '🔒' : '🔥'}
              </span>
              <h3 className="play-diff-title">Hard</h3>
              <p className="play-diff-desc">
                {hardLocked ? 'Complete Medium first' : '10 questions · +20 XP each'}
              </p>
              {!hardLocked && <span className="play-diff-cta">Start</span>}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
