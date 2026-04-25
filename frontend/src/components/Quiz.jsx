import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * @param {object} props
 * @param {Array<{ id: number|string, type: 'single'|'multi', prompt: string, options: string[] }>} props.questions
 * @param {number} props.xpPerCorrectQuestion
 * @param {(questionId: number|string, selectedAnswers: number[], type: 'single'|'multi') => Promise<{result: string, selectedAnswers: number[], correctAnswers: number[], missedAnswers: number[], wrongAnswers: number[]}>} props.onCheckAnswer
 * @param {(info: { sessionXp: number, answers: Array<{questionId: number|string, selectedOptionIndex?: number, selectedOptionIndices?: number[]}> }) => Promise<void> | void} props.onComplete
 */
function Quiz({ questions, xpPerCorrectQuestion, onCheckAnswer, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [status, setStatus] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sessionXp, setSessionXp] = useState(0);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const sessionXpRef = useRef(0);
  const awardedRef = useRef(new Set());
  const finalAnswersRef = useRef(new Map());

  const total = questions.length;
  const current = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex >= total - 1;

  const correctSet = useMemo(
    () => new Set(feedback?.correctAnswers ?? []),
    [feedback]
  );

  const toggleMulti = useCallback(
    (index) => {
      if (status !== null) return;
      setSelectedAnswers((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index].sort((a, b) => a - b)
      );
    },
    [status]
  );

  const selectSingle = useCallback(
    (index) => {
      if (status !== null) return;
      setSelectedAnswers([index]);
    },
    [status]
  );

  const handleSubmit = useCallback(() => {
    if (!current || status !== null || checking) return;
    const sel = [...selectedAnswers].sort((a, b) => a - b);
    setChecking(true);
    setError('');

    onCheckAnswer(current.id, sel, current.type)
      .then((nextFeedback) => {
        const nextStatus = (nextFeedback?.result || 'INCORRECT').toLowerCase();
        setFeedback(nextFeedback);
        setStatus(nextStatus === 'incorrect' ? 'wrong' : nextStatus);

        if (nextStatus === 'correct' && !awardedRef.current.has(currentQuestionIndex)) {
          awardedRef.current.add(currentQuestionIndex);
          sessionXpRef.current += xpPerCorrectQuestion;
          setSessionXp(sessionXpRef.current);
          finalAnswersRef.current.set(current.id, {
            questionId: current.id,
            selectedOptionIndex: current.type === 'single' ? sel[0] : undefined,
            selectedOptionIndices: current.type === 'multi' ? sel : undefined,
          });
        }
      })
      .catch(() => {
        setError('Unable to check this answer right now.');
      })
      .finally(() => {
        setChecking(false);
      });
  }, [current, currentQuestionIndex, selectedAnswers, status, checking, xpPerCorrectQuestion, onCheckAnswer]);

  const handleRetry = useCallback(() => {
    setStatus(null);
    setFeedback(null);
    setSelectedAnswers([]);
    setError('');
  }, []);

  const goNextOrFinish = useCallback(() => {
    if (finishing) return;

    if (!isLast) {
      setCurrentQuestionIndex((i) => i + 1);
      setStatus(null);
      setFeedback(null);
      setSelectedAnswers([]);
      setError('');
      return;
    }

    const answers = questions
      .map((question) => finalAnswersRef.current.get(question.id))
      .filter(Boolean);

    setFinishing(true);
    Promise.resolve(onComplete({ sessionXp: sessionXpRef.current, answers }))
      .catch(() => {
        setError('Unable to finish quiz right now.');
      })
      .finally(() => {
        setFinishing(false);
      });
  }, [isLast, onComplete, questions, finishing]);

  const optionClass = useCallback(
    (index) => {
      let cls = 'quiz-option';
      if (status === null) {
        if (selectedAnswers.includes(index)) cls += ' quiz-option--selected';
        return cls;
      }
      const isCorrect = correctSet.has(index);
      const isSelected = selectedAnswers.includes(index);
      if (isCorrect) cls += ' quiz-option--correct';
      if (isSelected && !isCorrect) cls += ' quiz-option--wrong';
      return cls;
    },
    [status, selectedAnswers, correctSet]
  );

  if (!current || total === 0) {
    return <div className="empty-state">No questions.</div>;
  }

  const canSubmit =
    status === null &&
    !checking &&
    (current.type === 'single' ? selectedAnswers.length === 1 : selectedAnswers.length > 0);

  return (
    <div className="quiz-core">
      <div className="quiz-xp-strip" aria-live="polite">
        <span className="quiz-xp-strip-label">XP this run</span>
        <span className="quiz-xp-strip-value">{sessionXp}</span>
      </div>

      <p className="quiz-progress">
        Question {currentQuestionIndex + 1} of {total}
      </p>

      <section className="quiz-question-card">
        <pre className="quiz-prompt">{current.prompt}</pre>
        {current.type === 'multi' && <p className="quiz-hint">Select all that apply.</p>}

        <div className="quiz-options" role={current.type === 'single' ? 'radiogroup' : 'group'}>
          {current.options.map((label, index) => (
            <button
              key={index}
              type="button"
              className={optionClass(index)}
              onClick={() =>
                current.type === 'single' ? selectSingle(index) : toggleMulti(index)
              }
              disabled={status !== null}
              aria-pressed={selectedAnswers.includes(index)}
            >
              <span className="quiz-option-label">{label}</span>
            </button>
          ))}
        </div>

        {error && <p className="quiz-feedback quiz-feedback--bad">{error}</p>}

        {status === null && (
          <button type="button" className="primary-btn submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
            {checking ? 'Checking...' : 'Check'}
          </button>
        )}

        {status === 'correct' && (
          <div className="quiz-actions">
            <p className="quiz-feedback quiz-feedback--ok">Nice! +{xpPerCorrectQuestion} XP</p>
            <button type="button" className="primary-btn submit-btn" onClick={goNextOrFinish} disabled={finishing}>
              {finishing ? 'Finishing...' : isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        )}

        {(status === 'wrong' || status === 'partial') && (
          <div className="quiz-actions">
            <p className="quiz-feedback quiz-feedback--bad">
              {status === 'partial'
                ? 'Partially correct. Wrong picks are red and missed answers are green.'
                : 'Wrong selections are marked in red; correct answers in green.'}
            </p>
            <button type="button" className="secondary-btn quiz-retry-btn" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Quiz;
