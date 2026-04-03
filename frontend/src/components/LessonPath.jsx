import { useMemo } from 'react';
import LessonNode from './LessonNode';

function getStatus(index, lessonsCompleted) {
  if (index < lessonsCompleted) return 'completed';
  if (index === lessonsCompleted) return 'current';
  return 'locked';
}

function LessonPath({ lessons, lessonsCompleted, onSelectCurrent }) {
  const rows = useMemo(() => {
    return lessons.map((lesson, index) => ({
      lesson,
      index,
      status: getStatus(index, lessonsCompleted),
      align: index % 2 === 0 ? 'left' : 'right',
    }));
  }, [lessons, lessonsCompleted]);

  return (
    <div className="lesson-path" role="list">
      {rows.map(({ lesson, index, status, align }, i) => (
        <div key={lesson.id} className={`lesson-path-row lesson-path-row--${align}`} role="listitem">
          {i > 0 && (
            <div
              className={`lesson-path-connector lesson-path-connector--${rows[i - 1].status === 'locked' && status === 'locked' ? 'muted' : 'active'}`}
              aria-hidden="true"
            />
          )}
          <LessonNode
            status={status}
            label={lesson.label}
            title={lesson.title}
            onClick={status === 'current' ? () => onSelectCurrent?.(lesson, index) : undefined}
            disabled={status !== 'current'}
          />
        </div>
      ))}
    </div>
  );
}

export default LessonPath;
