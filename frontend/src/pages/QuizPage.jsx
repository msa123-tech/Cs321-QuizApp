import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, submitQuiz } from '../api/quizApi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import QuestionCard from '../components/QuestionCard';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/quiz.css';

function getQuestionId(question, index) {
  return question.id ?? question.questionId ?? index;
}

function getOptions(question) {
  if (Array.isArray(question.options) && question.options.length > 0) {
    return question.options;
  }
  return [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean);
}

function getErrorMessage(error) {
  if (!error?.response) {
    return 'Cannot reach backend API. Verify backend is running and accessible from http://localhost:5173.';
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Unable to complete request.'
  );
}

function QuizPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetchQuestions(token);
        const data = response.data;
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.questions)
          ? data.questions
          : [];

        setQuestions(normalized);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [token]);

  const totalAnswered = useMemo(
    () => Object.keys(selectedAnswers).length,
    [selectedAnswers]
  );

  const handleSelectAnswer = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const answers = questions.map((question, index) => {
        const questionId = getQuestionId(question, index);
        const selectedOptionIndex = selectedAnswers[questionId];
        const options = getOptions(question);
        const selectedOption =
          selectedOptionIndex !== undefined ? options[selectedOptionIndex] : null;

        return {
          questionId,
          selectedOptionIndex,
          selectedOptionText:
            typeof selectedOption === 'string'
              ? selectedOption
              : selectedOption?.text ?? null,
        };
      });

      const response = await submitQuiz({ answers }, token);
      const result = response.data || {};

      localStorage.setItem('quizResult', JSON.stringify(result));
      navigate('/results', { state: { result } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="quiz-page">
      <Navbar title="Quiz Session" />

      <section className="quiz-body">
        <div className="quiz-top-row">
          <h2>Answer all questions</h2>
          <p>
            Answered: {totalAnswered}/{questions.length}
          </p>
        </div>

        <ErrorMessage message={error} />

        {loading ? (
          <LoadingSpinner label="Fetching questions..." />
        ) : questions.length === 0 ? (
          <div className="empty-state">No questions available right now.</div>
        ) : (
          <>
            {questions.map((question, index) => {
              const questionId = getQuestionId(question, index);
              return (
                <QuestionCard
                  key={questionId}
                  question={question}
                  index={index}
                  selectedValue={selectedAnswers[questionId]}
                  onSelect={handleSelectAnswer}
                />
              );
            })}

            <button className="primary-btn submit-btn" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default QuizPage;
