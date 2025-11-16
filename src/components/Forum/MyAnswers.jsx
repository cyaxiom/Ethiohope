import { Eye, MessageSquare, ThumbsUp, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { answers } from '../../api/forum/mock.data';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border ${className}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = '' }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-lg border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } shadow-sm  ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`p-4 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

function Avatar({ name }) {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full ${
        isDark ? 'bg-gray-700' : 'bg-gray-300'
      }  text-xs font-bold`}
    >
      {name[0]}
    </div>
  );
}

export default function MyAnswers() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-0 ">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 md:hidden">My Answers</h1>
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-0 md:p-8">
          <div className="">
            {/* Header */}
            <div className="mb-8">
              <p
                className={`${
                  isDark ? 'text-gray-300' : 'text-gray-800'
                }  mb-2 `}
              >
                Track your contributions to the community. Here are all the
                answers you’ve provided to help community members.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm">{answers.length} answers</span>
              </div>
            </div>

            {/* Answers */}
            <div className="space-y-6">
              {answers.map((answer) => (
                <Card
                  key={answer.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">Answer to:</span>
                        </div>
                        <h3
                          onClick={() =>
                            navigate(
                              `/community/forum/questions/${answer.questionId}`
                            )
                          }
                          className="text-lg font-semibold line-clamp-2 hover:text-blue-600 cursor-pointer"
                        >
                          {answer.question}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <span>Asked by</span>
                          <Avatar name={answer.author} />
                          <span className="font-medium">{answer.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {answer.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {answer.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {answer.votes}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <p className="leading-relaxed">{answer.answer}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {answer.tags.map((tag) => (
                          <Badge key={tag} className="border text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm ">
                        <Clock className="h-4 w-4" />
                        {answer.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {answers.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12  mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No answers yet</h3>
                <p className="">
                  Start contributing to the community by answering questions!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
//         </div>
