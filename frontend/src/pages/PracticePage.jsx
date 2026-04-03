import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useGamification } from '../context/GamificationContext';
import '../styles/gamified.css';

const PRACTICE_MODES = [
  {
    id: 'mistakes',
    title: 'Mistakes',
    description: 'Review questions you missed and fix weak spots.',
    icon: '✗',
  },
  {
    id: 'concepts',
    title: 'Concepts',
    description: 'Mixed drill on core ideas from recent lessons.',
    icon: '◆',
  },
  {
    id: 'timed',
    title: 'Timed quiz',
    description: 'Race the clock — accuracy under pressure.',
    icon: '⏱',
  },
];

function PracticePage() {
  const navigate = useNavigate();
  const { addXp } = useGamification();

  const handleWeakAreas = () => {
    addXp(20);
    navigate('/quiz', {
      state: {
        from: '/practice',
        practiceMode: 'weak',
        title: 'Weak areas',
      },
    });
  };

  const handleMode = (mode) => {
    navigate('/quiz', {
      state: {
        from: '/practice',
        practiceMode: mode.id,
        title: mode.title,
      },
    });
  };

  return (
    <>
      <TopBar title="Practice" subtitle="Level up skills" />
      <main className="shell-main shell-scroll">
        <section className="practice-hero practice-hero--enter">
          <h2 className="practice-hero-title">Target weak areas</h2>
          <p className="practice-hero-text">
            Focused sets based on your mistakes and tricky concepts.
          </p>
          <button type="button" className="btn-duo btn-duo--green practice-cta" onClick={handleWeakAreas}>
            Start +20 XP
          </button>
        </section>

        <div className="practice-grid">
          {PRACTICE_MODES.map((mode, i) => (
            <button
              key={mode.id}
              type="button"
              className="practice-card practice-card--enter"
              style={{ animationDelay: `${0.12 + i * 0.06}s` }}
              onClick={() => handleMode(mode)}
            >
              <span className="practice-card-icon" aria-hidden="true">
                {mode.icon}
              </span>
              <h3 className="practice-card-title">{mode.title}</h3>
              <p className="practice-card-desc">{mode.description}</p>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export default PracticePage;
