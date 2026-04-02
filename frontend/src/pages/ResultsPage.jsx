import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
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

  const result = useMemo(
    () => location.state?.result || getStoredResult() || {},
    [location.state]
  );

  const score = result.score ?? result.totalScore ?? 0;
  const xp = result.xpGained ?? result.xp ?? result.totalXp ?? 0;
  const correctAnswers = result.correctAnswers ?? result.correct ?? null;
  const totalQuestions = result.totalQuestions ?? result.total ?? null;

  return (
    <main className="results-page">
      <Navbar title="Quiz Results" showQuizButton xp={typeof xp === 'number' ? xp : null} />

      <section className="results-card">
        <h2>Your Result</h2>

        <div className="result-grid">
          <div className="result-item">
            <span>Score</span>
            <strong>{score}</strong>
          </div>

          <div className="result-item">
            <span>XP</span>
            <strong>{xp}</strong>
          </div>

          {correctAnswers !== null && (
            <div className="result-item">
              <span>Correct Answers</span>
              <strong>
                {correctAnswers}
                {typeof totalQuestions === 'number' ? ` / ${totalQuestions}` : ''}
              </strong>
            </div>
          )}
        </div>

        {result.message && <p className="result-message">{result.message}</p>}

        <div className="result-actions">
          <button className="primary-btn" onClick={() => navigate('/quiz')}>
            Try Another Quiz
          </button>
          <button className="secondary-btn" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>
      </section>
    </main>
  );
}

export default ResultsPage;
