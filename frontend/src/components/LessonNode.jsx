function LessonNode({ status, label, title, onClick, disabled }) {
  const isLocked = status === 'locked';

  return (
    <button
      type="button"
      className={`lesson-node lesson-node--${status}`}
      onClick={onClick}
      disabled={disabled ?? isLocked}
      aria-label={
        isLocked
          ? `${title}, locked`
          : status === 'completed'
            ? `${title}, completed`
            : `${title}, current lesson`
      }
      title={title}
    >
      <span className="lesson-node-inner">
        {status === 'completed' ? (
          <span className="lesson-node-check" aria-hidden="true">
            ✓
          </span>
        ) : isLocked ? (
          <span className="lesson-node-lock" aria-hidden="true">
            🔒
          </span>
        ) : (
          <span className="lesson-node-label">{label}</span>
        )}
      </span>
    </button>
  );
}

export default LessonNode;
