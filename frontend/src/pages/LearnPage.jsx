import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { LEARN_TOPICS } from '../data/lessons';
import '../styles/gamified.css';

function LearnPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopBar title="Learn" subtitle="Pick a topic" />
      <main className="shell-main shell-scroll">
        <div className="topic-grid">
          {LEARN_TOPICS.map((topic, i) => (
            <button
              key={topic.id}
              type="button"
              className="topic-card topic-card--enter"
              style={{ animationDelay: `${i * 0.06}s` }}
              onClick={() => navigate(`/quiz?topic=${encodeURIComponent(topic.id)}&from=learn`)}
            >
              <span className="topic-card-icon" aria-hidden="true">
                {topic.icon}
              </span>
              <h3 className="topic-card-title">{topic.title}</h3>
              <p className="topic-card-desc">{topic.description}</p>
              <span className="topic-card-cta">Start</span>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export default LearnPage;
