import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import LessonPath from '../components/LessonPath';
import { useGamification } from '../context/GamificationContext';
import { JAVA_BASICS_LESSONS } from '../data/lessons';
import '../styles/gamified.css';

function DashboardPage() {
  const navigate = useNavigate();
  const { lessonsCompleted } = useGamification();

  const handleSelectCurrent = (lesson, index) => {
    navigate('/quiz', {
      state: {
        from: '/dashboard',
        lessonId: lesson.id,
        lessonIndex: index,
        topic: 'java-basics',
        title: lesson.title,
      },
    });
  };

  return (
    <>
      <TopBar title="Dashboard" subtitle="Keep your streak alive" />
      <main className="shell-main shell-scroll">
        <section className="section-card section-card--enter">
          <div className="section-card-header">
            <span className="section-card-badge">Unit 1</span>
            <h2 className="section-card-title">Java Basics</h2>
            <p className="section-card-desc">
              Follow the path — complete each lesson to unlock the next.
            </p>
          </div>
          <LessonPath
            lessons={JAVA_BASICS_LESSONS}
            lessonsCompleted={lessonsCompleted}
            onSelectCurrent={handleSelectCurrent}
          />
        </section>
      </main>
    </>
  );
}

export default DashboardPage;
