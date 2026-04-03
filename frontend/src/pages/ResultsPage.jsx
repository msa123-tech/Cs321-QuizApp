import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { useGamification } from '../context/GamificationContext';
import '../styles/gamified.css';
import '../styles/results.css';

function getStoredResult() {
  try {
    const raw = localStorage.getItem('quizResult');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addXp, syncTotalXp, completeLessonAtIndex } = useGamification();

  const result = useMemo(
    () => location.state?.result || getStoredResult() || {},
    [location.state]
  );

  const score = result.score ?? result.totalScore ?? 0;
  const xpThisQuiz = result.xpGained ?? result.xp ?? 0;
  const correctAnswers = result.correctAnswers ?? result.correct ?? null;
  const totalQuestions = result.totalQuestions ?? result.total ?? null;

  useEffect(() => {
    const payload = location.state?.result;
    if (!payload?._clientId) return;

    const key = `gp_applied_${payload._clientId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');

    const totalXp = Number(payload.totalXp);
    if (Number.isFinite(totalXp)) {
      syncTotalXp(totalXp);
    } else {
      const xpGain = Number(payload.xpGained ?? payload.xp ?? 0);
      if (Number.isFinite(xpGain) && xpGain > 0) {
        addXp(xpGain);
      }
    }

    const li = location.state?.lessonIndex;
    if (typeof li === 'number' && Number.isFinite(li)) {
      completeLessonAtIndex(li);
    }
  }, [location.state, addXp, syncTotalXp, completeLessonAtIndex]);

  const backTo = location.state?.from || '/dashboard';

  return (
    <main className="results-page gamified-bg">
      <TopBar title="Quiz results" showBack backTo={backTo} />

      <section className="results-card">
        <h2>Your result</h2>

        <div className="result-grid">
          <div className="result-item">
            <span>Score</span>
            <strong>{score}</strong>
          </div>

          <div className="result-item">
            <span>XP (this quiz)</span>
            <strong>{xpThisQuiz}</strong>
          </div>

          {correctAnswers !== null && (
            <div className="result-item">
              <span>Correct answers</span>
              <strong>
                {correctAnswers}
                {typeof totalQuestions === 'number' ? ` / ${totalQuestions}` : ''}
              </strong>
            </div>
          )}
        </div>

        {result.message && <p className="result-message">{result.message}</p>}

        <div className="result-actions">
          <button className="primary-btn" type="button" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
          <button className="secondary-btn" type="button" onClick={() => navigate('/quiz', { replace: true })}>
            Another quiz
          </button>
        </div>
      </section>
    </main>
  );
}

export default ResultsPage;
