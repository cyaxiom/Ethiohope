import React from 'react';
import {
  ArrowBigRight,
  CircleCheckBig,
  Clock,
  Flame,
  LucideArrowUp,
  LucideEye,
  LucideMessageSquare,
  LucideMoreVertical,
  MoveUpRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchQuestions, upvoteQuestion } from '../../api/forum';

const Questions = () => {
  const [activeTag, setActiveTag] = React.useState('New');
  const [questions, setQuestions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    const getQuestions = async () => {
      const response = await fetchQuestions(activeTag);
      setQuestions(response);
      setIsLoading(false);
    };
    getQuestions();
  }, [activeTag]);

  const tags = [
    {
      title: 'New',
      icon: Clock,
    },
    {
      title: 'Top',
      icon: MoveUpRight,
    },
    {
      title: 'Hot',
      icon: Flame,
    },
    {
      title: 'Trending',
      icon: CircleCheckBig,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-4 my-6">
        {tags.map((tag, idx) => (
          <motion.button
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            key={idx}
            className={`px-4 py-2 rounded-4xl flex items-center gap-2 ${
              activeTag === tag.title
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-[#808080]'
            }`}
            onClick={() => setActiveTag(tag.title)}
          >
            <tag.icon className="w-4 h-4" />
            <p className="text-sm">{tag.title}</p>
          </motion.button>
        ))}
      </div>
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground mt-20">
            <p className="text-lg">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20">
            <p className="text-lg">No questions available.</p>
            <p className="text-sm">Be the first to ask a question!</p>
            <Link
              to="/community/forum/my-questions"
              className="text-blue-500 mt-10 inline-block"
            >
              Ask a Question
            </Link>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={index} className="mb-6">
              <QuestionCard question={question} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const QuestionCard = ({ question, type = 'questions' }) => {
  const navigate = useNavigate();
  // const [answers, setAnswers] = React.useState([]);
  const [isAnswerVisible, setIsAnswerVisible] = React.useState(false);
  // const [showViewsTooltip, setShowViewsTooltip] = React.useState(false);
  const [voteCount, setVoteCount] = React.useState(question.votes || 0);

  function formatTimeAgo(dateString) {
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
  }

  // Handlers for CRUD actions
  const handleEdit = (e) => {
    e.stopPropagation(); // prevent navigating to detail page
    navigate(`/community/forum/my-questions?type=edit&id=${question.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this question?')) {
      console.log('Deleting question:', question.id);
      // TODO: call delete API here
    }
  };



  const handleManage = (e) => {
    e.stopPropagation();
    navigate(`/community/forum/questions/manage/${question.id}`);
  };

  const stats = [
    { icon: LucideEye, count: question.views, name: 'views' },
    { icon: LucideMessageSquare, count: question.answers, name: 'answers' },
    {
      icon: LucideArrowUp,
      count: voteCount,
      name: 'votes',
      className: 'bg-blue-500 text-white px-2 py-1 rounded-full',
    },
  ];

  const handleClickStat = async (stat) => {
    console.log('Clicked stat:', stat);
    if (stat.name === 'views') {
      // Show views tooltip
      // setShowViewsTooltip(!showViewsTooltip);
    } else if (stat.name === 'answers') {
      // Show answers tooltip
      setIsAnswerVisible(!isAnswerVisible);
    } else if (stat.name === 'votes') {
      // call api to upvote
      console.log('Upvoting question:', question.id);
      const response = await upvoteQuestion(question.id);
      console.log('Upvoted question:', response);
      if (response) {
        console.log('Upvoted question:', response);
        // Update local state to reflect new vote count
        setVoteCount(response.votes);
      }
    }
  };

  return (
    <motion.div
      // onClick={() => navigate(`/community/forum/questions/${question.id}`)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.99 }}
      whileHover={{ scale: 1.01 }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="bg-card p-[30px] cursor-pointer rounded-lg shadow-md border border-border"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <img
              src={question.profile_pic}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-card-foreground font-medium">
                {question.author}
              </p>
              <p className="text-muted-foreground text-sm">
                {formatTimeAgo(question.created_at)}
              </p>
            </div>
          </div>

          {/* More menu OR CRUD buttons */}
          {type === 'my-questions' ? (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleManage}
                className="px-3 py-1 text-sm rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Manage
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground">
              <LucideMoreVertical className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <h3 className="text-card-foreground font-semibold mt-2">
            {question.question}
          </h3>
          <p className="text-muted-foreground mt-1">{question.description}</p>

          {/* Tags + Stats */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex space-x-2 mt-2">
              {question.tags.slice(0, 3).map((tag, idx) => (
                <button
                  key={idx}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
            {/* see details */}
            <button
              onClick={() =>
                navigate(`/community/forum/questions/${question.id}`)
              }
              className="flex items-center text-sm text-blue-500 hover:underline"
            >
              <span>See Details</span>
            </button>
          </div>
          {/* stats */}
          <div className="flex items-center justify-end space-x-6 mt-2 text-muted-foreground text-sm">
            {stats.map((stat, idx) => (
              <span
                onClick={() => handleClickStat(stat)}
                key={idx}
                className={`flex items-center cursor-pointer ${
                  stat.className ? stat.className : ''
                }`}
              >
                <stat.icon className="w-4 h-4 mr-1" /> {stat.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Questions;
