import React from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchAnswersByQuestionId,
  fetchQuestionById,
  postAnswer,
  upvoteQuestion,
} from '../../api/forum';
import {
  ArrowUp,
  CornerDownRight,
  LucideArrowUp,
  LucideEye,
  LucideMessageSquare,
  LucideMoreVertical,
  MessageSquare,
} from 'lucide-react';
const QuestionDetails = () => {
  const { id } = useParams();
  const [question, setQuestion] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);
  const [metaData, setMetaData] = React.useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
  });
  const [activeStat, setActiveStat] = React.useState('answers');
  const [suggestion, setSuggestion] = React.useState('');
  const [errors, setErrors] = React.useState({});
  React.useEffect(() => {
    // Fetch question details based on the id
    const fetch = async () => {
      const response = await fetchQuestionById(id);
      if (response) {
        setQuestion(response);
      }
      // fetch answers for the question
      const responseAnswers = await fetchAnswersByQuestionId(id, 3, 1);
      console.log('Fetched answers:', responseAnswers);
      setAnswers(responseAnswers.data);
      setMetaData(responseAnswers.metadata);
    };
    fetch();
  }, [id]);
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

  const handleLoadMoreAnswers = async () => {
    // console.log('Load more answers clicked');
    const nextPage = metaData.page + 1;
    const response = await fetchAnswersByQuestionId(id, 3, nextPage);
    setAnswers((prev) => [...prev, ...response.data]);
    setMetaData(response.metadata);
  };
  const stats = [
    {
      icon: LucideMessageSquare,
      count: question ? question.answers : 0,
      name: 'answers',
      onClick: () => setActiveStat('answers'),
    },
    {
      icon: LucideEye,
      count: question ? question.views : 0,
      name: 'views',
      onClick: () => setActiveStat('views'),
    },

    {
      icon: LucideArrowUp,
      count: question ? question.votes : 0,
      name: 'votes',
      onClick: () => setActiveStat('votes'),
    },
  ];

  //upvote handler
  const handleUpVote = async () => {
    // Optimistically update UI
    setQuestion((prev) => ({
      ...prev,
      votes: prev.votes + 1,
    }));
    try {
      const response = await upvoteQuestion(id);
      if (!response.success) {
        throw new Error('Failed to upvote');
      }
      const data = response.data;
      // Update with server response (in case of any adjustments)
      setQuestion(data);
    } catch (error) {
      console.error('Error upvoting:', error);
      // Revert UI on error
      setQuestion((prev) => ({
        ...prev,
        votes: prev.votes - 1,
      }));
    }
  };
  // Suggestion handler
  const handleSuggestion = async () => {
    if (suggestion.trim() === '')
      return setErrors((prev) => ({
        ...prev,
        ['suggestion']: 'the field is empty',
      }));
    const res = await postAnswer(id, {
      content: suggestion,
    });
    if (!res.success) {
      setErrors((prev) => ({ ...prev, ['suggestion']: res.message }));
    }
    setAnswers((prev) => [...prev, res.data]);
  };
  console.log('errors:', errors);
  if (!question) {
    return (
      <div className="bg-card p-8 rounded-lg shadow border border-border text-center text-muted-foreground">
        <p>Question not found.</p>
      </div>
    );
  }

  console.log('answers:', answers);

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-card p-8 rounded-lg shadow border border-border">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <img
            src={question.profile_pic}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-card-foreground font-semibold text-lg">
              {question.author}
            </p>
            <p className="text-muted-foreground text-sm">
              {formatTimeAgo(question.created_at)}
            </p>
          </div>
        </div>
        <div className="text-muted-foreground">
          <LucideMoreVertical className="w-6 h-6" />
        </div>
      </div>
      <h2 className="text-card-foreground text-2xl font-bold mb-2">
        {question.question}
      </h2>
      <p className="text-muted-foreground mb-4">{question.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {question.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10 text-muted-foreground text-base">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.name}
                onClick={stat.onClick}
                className={`flex items-center focus:outline-none ${
                  activeStat === stat.name ? 'text-primary font-semibold' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-1" />
                {stat.count}{' '}
                {stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}
              </button>
            );
          })}
        </div>
        {/* <div> */}
        <button
          onClick={handleUpVote}
          className="bg-blue-500 py-2 px-3 rounded-xl text-white flex gap-2 hover:scale-105 active:scale-100 transition-all"
        >
          <ArrowUp />
          upvote
        </button>
        {/* </div> */}
      </div>

      {/* suggestions */}
      <div className="mt-8 p-4 border border-border rounded-lg bg-background">
        <h3 className="text-xl font-semibold opacity-85 text-center">
          Suggestions
        </h3>
        <input
          value={suggestion}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, ['suggestion']: '' }));
            setSuggestion(e.target.value);
          }}
          type="text"
          placeholder="Add a suggestion..."
          className="border border-border mt-10 rounded-lg p-4 w-full"
        />
        {errors.suggestion && (
          <p className="text-red-500">{errors.suggestion}</p>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setSuggestion('')}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:scale-105 active:scale-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSuggestion}
            className="bg-amber-500 text-white py-2 px-4 rounded-lg ml-2 flex items-center gap-2 hover:scale-105 active:scale-100 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            Suggest
          </button>
        </div>
      </div>

      {/* Answers section  */}
      <div className="mt-8">
        {activeStat === 'answers' && (
          <div className="mt-10">
            <h3 className="text-card-foreground text-xl font-semibold mb-6">
              {metaData.total} Answers
            </h3>

            {answers.map((answer) => (
              <div
                key={answer.id}
                className="border-t border-border py-6 flex gap-4"
              >
                {/* Profile Pic */}
                <img
                  src={answer.profile_pic}
                  alt={answer.author}
                  className="w-12 h-12 rounded-full"
                />

                {/* Answer Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-card-foreground">
                        {answer.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(answer.created_at)}
                      </p>
                    </div>
                    <LucideMoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" />
                  </div>

                  <p className="text-card-foreground mb-3">{answer.answer}</p>

                  {/*  Reply Button */}
                  <div className="flex justify-end">
                    <button className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-2xl">
                      <CornerDownRight className="w-4 h-4 mr-1" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {metaData.total > answers.length && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMoreAnswers}
                  className="text-primary cursor-pointer font-semibold hover:underline"
                >
                  Load more answers
                </button>
              </div>
            )}

            {/* If no answers */}
            {answers.length === 0 && (
              <p className="text-muted-foreground">
                No answers yet. Be the first!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
