import { useCallback, useMemo, useRef, useState } from 'react';

function setsEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

/**
 * @param {'single' | 'multi'} type
 * @param {number[]} selected
 * @param {number[]} correct
 * @returns {'correct' | 'partial' | 'wrong'}
 */
export function evaluateAnswer(type, selected, correct) {
  if (setsEqual(selected, correct)) return 'correct';
  if (type === 'single') return 'wrong';
  const cset = new Set(correct);
  const sset = new Set(selected);
  const anyCorrectSelected = [...sset].some((i) => cset.has(i));
  if (!anyCorrectSelected) return 'wrong';
  return 'partial';
}

/**
 * @param {object} props
 * @param {Array<{ id: string, type: 'single'|'multi', prompt: string, options: string[], correctIndices: number[] }>} props.questions
 * @param {number} props.xpPerCorrectQuestion
 * @param {(info: { sessionXp: number }) => void} props.onComplete
 * @param {(amount: number) => void} [props.onEarnXp]
 */
function Quiz({ questions, xpPerCorrectQuestion, onComplete, onEarnXp }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [status, setStatus] = useState(null);
  const [sessionXp, setSessionXp] = useState(0);
  const sessionXpRef = useRef(0);
  const awardedRef = useRef(new Set());

  const total = questions.length;
  const current = questions[currentQuestionIndex];
  const isLast = currentQuestionIndex >= total - 1;

  const correctSet = useMemo(
    () => new Set(current?.correctIndices ?? []),
    [current]
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
    if (!current || status !== null) return;
    const sel = [...selectedAnswers].sort((a, b) => a - b);
    const cor = [...current.correctIndices].sort((a, b) => a - b);
    const nextStatus = evaluateAnswer(current.type, sel, cor);
    setStatus(nextStatus);

    if (nextStatus === 'correct' && !awardedRef.current.has(currentQuestionIndex)) {
      awardedRef.current.add(currentQuestionIndex);
      sessionXpRef.current += xpPerCorrectQuestion;
      setSessionXp(sessionXpRef.current);
      onEarnXp?.(xpPerCorrectQuestion);
    }
  }, [current, currentQuestionIndex, selectedAnswers, status, xpPerCorrectQuestion, onEarnXp]);

  const handleRetry = useCallback(() => {
    setStatus(null);
    setSelectedAnswers([]);
  }, []);

  const goNextOrFinish = useCallback(() => {
    if (!isLast) {
      setCurrentQuestionIndex((i) => i + 1);
      setStatus(null);
      setSelectedAnswers([]);
      return;
    }
    onComplete({ sessionXp: sessionXpRef.current });
  }, [isLast, onComplete]);

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

        {status === null && (
          <button type="button" className="primary-btn submit-btn" onClick={handleSubmit} disabled={!canSubmit}>
            Check
          </button>
        )}

        {status === 'correct' && (
          <div className="quiz-actions">
            <p className="quiz-feedback quiz-feedback--ok">Nice! +{xpPerCorrectQuestion} XP</p>
            <button type="button" className="primary-btn submit-btn" onClick={goNextOrFinish}>
              {isLast ? 'Finish' : 'Next'}
            </button>
          </div>
        )}

        {(status === 'wrong' || status === 'partial') && (
          <div className="quiz-actions">
            <p className="quiz-feedback quiz-feedback--bad">
              {status === 'partial'
                ? 'Some picks are right; wrong picks are marked in red.'
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
