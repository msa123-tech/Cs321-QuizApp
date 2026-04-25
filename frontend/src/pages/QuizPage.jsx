import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Quiz from '../components/Quiz';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchUserProgress } from '../api/progressApi';
import { checkAnswer, fetchQuestions, submitQuiz } from '../api/quizApi';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { LEARN_TOPICS } from '../data/lessons';
import '../styles/gamified.css';
import '../styles/quiz.css';

const XP_BY_DIFFICULTY = { easy: 10, medium: 15, hard: 20 };
const TOPIC_XP = 10;
const LEARN_QUESTION_COUNT = 5;
const PLAY_QUESTION_COUNT = 10;
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

function titleCaseDifficulty(d) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function normalizeQuestion(question) {
  return {
    id: question.id,
    type: (question.questionType || 'SINGLE').toLowerCase(),
    prompt: question.questionText,
    options: [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean),
  };
}

function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { addXp, syncTotalXp } = useGamification();

  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const from = searchParams.get('from') || (topic ? 'learn' : 'dashboard');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locked, setLocked] = useState(false);

  const backTo = from === 'learn' ? '/learn' : '/dashboard';

  const config = useMemo(() => {
    const topicConfig = LEARN_TOPICS.find((entry) => entry.id === topic);
    const hasTopic = Boolean(topicConfig);
    const hasDiff = Boolean(difficulty) && VALID_DIFFICULTIES.includes(difficulty);
    if (hasTopic === hasDiff) return null;

    if (hasDiff) {
      return {
        mode: 'difficulty',
        difficulty,
        xpPerCorrect: XP_BY_DIFFICULTY[difficulty],
        title: `${titleCaseDifficulty(difficulty)} challenge`,
        questionLimit: PLAY_QUESTION_COUNT,
        params: { difficulty: titleCaseDifficulty(difficulty) },
      };
    }

    const label = topicConfig.title;
    return {
      mode: 'topic',
      topic,
      xpPerCorrect: TOPIC_XP,
      title: `${label} practice`,
      questionLimit: LEARN_QUESTION_COUNT,
      params: { topic: label, difficulty: 'Easy' },
    };
  }, [topic, difficulty]);

  useEffect(() => {
    if (!config || config.error === 'locked') {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');
    setLocked(false);

    const loadQuestions = () =>
      fetchQuestions(token, config.params)
        .then((response) => {
          if (!active) return;
          const data = Array.isArray(response.data) ? response.data : [];
          const normalized = data.map(normalizeQuestion);
          const limited = config.questionLimit ? normalized.slice(0, config.questionLimit) : normalized;
          setQuestions(limited);
        });

    const maybeCheckLocks = () => {
      if (config.mode !== 'difficulty' || !user?.id || config.difficulty === 'easy') {
        return Promise.resolve();
      }

      return fetchUserProgress(user.id, token).then((response) => {
        if (!active) return;
        const progress = response.data || {};
        const mediumNeedsEasy = config.difficulty === 'medium' && !progress.easyCleared;
        const hardNeedsMedium = config.difficulty === 'hard' && !progress.mediumCleared;

        if (mediumNeedsEasy || hardNeedsMedium) {
          setLocked(true);
          throw new Error('locked');
        }
      });
    };

    maybeCheckLocks()
      .then(loadQuestions)
      .catch((err) => {
        if (!active) return;
        if (err?.message === 'locked') {
          return;
        }
        setError('Unable to load quiz questions right now.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [config, token, user]);

  const handleCheckAnswer = useCallback(
    async (questionId, selectedAnswers, questionType) => {
      const payload = {
        questionId,
        selectedOptionIndex: questionType === 'single' ? selectedAnswers[0] : null,
        selectedOptionIndices: questionType === 'multi' ? selectedAnswers : null,
      };

      const response = await checkAnswer(payload, token);
      return response.data;
    },
    [token]
  );

  const handleComplete = useCallback(
    async ({ sessionXp, answers }) => {
      const payload = {
        answers,
        difficulty: config?.mode === 'difficulty' ? titleCaseDifficulty(config.difficulty) : null,
      };
      const response = await submitQuiz(payload, token, user?.id);
      const result = response.data || {};

      const totalXp = Number(result.totalXp);
      if (Number.isFinite(totalXp)) {
        syncTotalXp(totalXp);
      } else if (sessionXp > 0) {
        addXp(sessionXp);
      }

      navigate(backTo, {
        replace: true,
        state: {
          quizDone: true,
          sessionXp: Number(result.xpGained ?? sessionXp ?? 0),
        },
      });
    },
    [navigate, backTo, config, token, user, syncTotalXp, addXp]
  );

  if (!config || config.error === 'locked' || locked) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="quiz-page gamified-bg">
      <TopBar title={config.title} showBack backTo={backTo} subtitle="One question at a time" />
      <section className="quiz-body">
        <ErrorMessage message={error} />

        {loading ? (
          <LoadingSpinner label="Loading questions..." />
        ) : questions.length === 0 ? (
          <div className="empty-state">No questions available for this quiz yet.</div>
        ) : (
          <Quiz
            questions={questions}
            xpPerCorrectQuestion={config.xpPerCorrect}
            onCheckAnswer={handleCheckAnswer}
            onComplete={handleComplete}
          />
        )}
      </section>
    </main>
  );
}

export default QuizPage;
