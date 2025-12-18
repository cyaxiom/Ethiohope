import React from 'react';
import {
  CircleCheckBig,
  Clock,
  Flame,
  LucideArrowUp,
  LucideEye,
  LucideMessageSquare,
  LucideMoreVertical,
  MoveUpRight,
} from 'lucide-react';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchQuestions, upvoteQuestion } from '../../api/forum';

const Questions = () => {
  const [activeTag, setActiveTag] = React.useState('New');
  const [questions, setQuestions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const getQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetchQuestions(activeTag);
        setQuestions(response || []);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    getQuestions();
  }, [activeTag]);

  const tags = [
    { title: 'New', icon: Clock },
    { title: 'Top', icon: MoveUpRight },
    { title: 'Hot', icon: Flame },
    { title: 'Trending', icon: CircleCheckBig },
  ];

  return (
    <div className="w-full">
      <h1 className="text-2xl md:hidden font-bold mb-4 text-foreground">Questions</h1>
      
      {/* Filter Tags */}
      <div className="flex items-center gap-4 my-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-background">
        {tags.map((tag, idx) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={idx}
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTag === tag.title
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setActiveTag(tag.title)}
          >
            <tag.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tag.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-lg">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <p className="text-lg text-foreground font-medium">No questions available.</p>
            <p className="text-sm text-muted-foreground mb-6">Be the first to ask a question!</p>
            <Link
              to="/community/forum/my-questions"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Ask a Question
            </Link>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>
    </div>
  );
};

export const QuestionCard = ({ question, type = 'questions' }) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [voteCount, setVoteCount] = React.useState(question.upvotes || question.votes || 0);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'some time ago';
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(secondsAgo / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  const handleUpvote = async (e) => {
    e.stopPropagation();
    try {
      const response = await upvoteQuestion(question.id);
      if (response && (response.upvotes !== undefined || response.votes !== undefined)) {
        setVoteCount(response.upvotes || response.votes);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/community/forum/my-questions?type=edit&id=${question.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      console.log('Deleting question:', question.id);
      // TODO: Implement delete logic
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/community/forum/questions/${question.id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={question.author?.avatar || question.profile_pic || 'https://via.placeholder.com/40'}
              alt={question.author?.name || question.author}
              className="w-8 h-8 rounded-full border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {question.author?.name || question.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(question.createdAt || question.created_at)}
              </p>
            </div>
          </div>

          {/* Title & Content */}
          <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2">
            {question.title || question.question}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {question.content || question.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {(question.tags || []).slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full border border-border/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-col items-center gap-4 pt-1">
          {type === 'my-questions' ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Edit"
              >
                <LucideMoreVertical className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                title="Delete"
              >
                <LucideMoreVertical className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleUpvote}
                className="flex flex-col items-center gap-1 group"
              >
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <LucideArrowUp className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground">{voteCount}</span>
              </button>
              
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-muted/50">
                  <LucideMessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  {Array.isArray(question.answers) ? question.answers.length : (question.answers || 0)}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-muted/50">
                  <LucideEye className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold text-foreground">{question.views || 0}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Questions;

