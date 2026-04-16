import { useCallback, useMemo } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Quiz from '../components/Quiz';
import { useGamification } from '../context/GamificationContext';
import { LEARN_TOPICS } from '../data/lessons';
import { getMockQuestions, isValidDifficulty, isValidTopic } from '../data/mockQuiz';
import { markDifficultyComplete, readPlayProgress } from '../data/playProgress';
import '../styles/gamified.css';
import '../styles/quiz.css';

const XP_BY_DIFFICULTY = { easy: 10, medium: 15, hard: 20 };
const TOPIC_XP = 10;

function titleCaseDifficulty(d) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addXp } = useGamification();

  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const from = searchParams.get('from') || (topic ? 'learn' : 'dashboard');

  const backTo = from === 'learn' ? '/learn' : '/dashboard';

  const config = useMemo(() => {
    const hasTopic = Boolean(topic) && isValidTopic(topic);
    const hasDiff = Boolean(difficulty) && isValidDifficulty(difficulty);
    if (hasTopic === hasDiff) return null;

    if (hasDiff) {
      const prog = readPlayProgress();
      if (difficulty === 'medium' && !prog.easy) return { error: 'locked' };
      if (difficulty === 'hard' && !prog.medium) return { error: 'locked' };
      const questions = getMockQuestions({ difficulty });
      return {
        mode: 'difficulty',
        difficulty,
        questions,
        xpPerCorrect: XP_BY_DIFFICULTY[difficulty],
        title: `${titleCaseDifficulty(difficulty)} challenge`,
      };
    }

    const questions = getMockQuestions({ topic });
    const label = LEARN_TOPICS.find((t) => t.id === topic)?.title ?? topic;
    return {
      mode: 'topic',
      topic,
      questions,
      xpPerCorrect: TOPIC_XP,
      title: `${label} practice`,
    };
  }, [topic, difficulty]);

  const handleComplete = useCallback(
    ({ sessionXp }) => {
      if (config?.mode === 'difficulty' && config.difficulty) {
        markDifficultyComplete(config.difficulty);
      }
      navigate(backTo, { replace: true, state: { quizDone: true, sessionXp } });
    },
    [navigate, backTo, config]
  );

  const handleEarnXp = useCallback(
    (amount) => {
      addXp(amount);
    },
    [addXp]
  );

  if (!config || config.error === 'locked') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!config.questions.length) {
    return <Navigate to={backTo} replace />;
  }

  return (
    <main className="quiz-page gamified-bg">
      <TopBar title={config.title} showBack backTo={backTo} subtitle="One question at a time" />
      <section className="quiz-body">
        <Quiz
          questions={config.questions}
          xpPerCorrectQuestion={config.xpPerCorrect}
          onComplete={handleComplete}
          onEarnXp={handleEarnXp}
        />
      </section>
    </main>
  );
}

export default QuizPage;
