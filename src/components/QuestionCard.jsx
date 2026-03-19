function getQuestionId(question, index) {
  return question.id ?? question.questionId ?? index;
}

function getOptions(question) {
  if (Array.isArray(question.options) && question.options.length > 0) {
    return question.options;
  }

  return [question.optionA, question.optionB, question.optionC, question.optionD].filter(Boolean);
}

function QuestionCard({ question, index, selectedValue, onSelect }) {
  const questionId = getQuestionId(question, index);
  const options = getOptions(question);

  return (
    <div className="question-card">
      <h3 className="question-title">
        Q{index + 1}. {question.questionText ?? question.text ?? 'Untitled question'}
      </h3>

      <div className="options-list">
        {options.map((option, optionIndex) => (
          <label className="option-item" key={`${questionId}-${optionIndex}`}>
            <input
              type="radio"
              name={`question-${questionId}`}
              checked={selectedValue === optionIndex}
              onChange={() => onSelect(questionId, optionIndex)}
            />
            <span>{typeof option === 'string' ? option : option?.text ?? `Option ${optionIndex + 1}`}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
