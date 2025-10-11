import {
  Eye,
  MessageSquare,
  ThumbsUp,
  Heart,
  Clock,
  TrendingUp,
  ArrowUp,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { likedPosts, votedPosts } from '../../api/forum/mock.data';
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';

/* ---------------- Small UI Components ---------------- */

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
      } shadow-sm ${className}`}
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
        isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-300'
      }  text-xs font-bold`}
    >
      {name[0]}
    </div>
  );
}

/* Simple Tabs */
function Tabs({ defaultValue, children }) {
  const [active, setActive] = React.useState(defaultValue);
  const triggers = [];
  const contents = [];
  React.Children.forEach(children, (child) => {
    if (child.type === TabsList) {
      triggers.push(
        React.cloneElement(child, { active, setActive, key: 'tabs-list' })
      );
    }
    if (child.type === TabsContent) {
      contents.push(
        React.cloneElement(child, { active, key: child.props.value })
      );
    }
  });

  return (
    <div>
      {triggers}
      {contents}
    </div>
  );
}

function TabsList({ children, active, setActive }) {
  return (
    <div className="grid w-full grid-cols-2 mb-6 border rounded-lg overflow-hidden">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

function TabsTrigger({ value, children, active, setActive }) {
  const isActive = active === value;
  const { isDark } = useTheme();
  return (
    <button
      onClick={() => setActive(value)}
      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
        isActive
          ? `${isDark ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'}`
          : `${
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children, active }) {
  if (active !== value) return null;
  return <div>{children}</div>;
}

//post card
function PostCard({ post, actionType, actionTime }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {actionType === 'vote' && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
                  <ArrowUp className="w-4 h-4 inline-block mr-0.5" /> Upvoted
                </Badge>
              )}
              {actionType === 'like' && (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-0">
                  <Heart className="w-4 h-4 inline-block mr-0.5" /> Liked
                </Badge>
              )}
            </div>
            <h3
              onClick={() => navigate(`/community/forum/questions/${post.id}`)}
              className="text-lg font-semibold hover:text-blue-600 cursor-pointer"
            >
              {post.title}
            </h3>
            <div
              className={`flex items-center gap-2 mt-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <span>by</span>
              <Avatar name={post.author} />
              <span className="font-medium">{post.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {post.comments}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {post.votes}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} className="border text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {actionType === 'like'
              ? `Liked ${actionTime}`
              : `Voted ${actionTime}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Page ---------------- */

export default function Likes() {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        <main className="flex-1 p-8">
          <div className="">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 md:hidden">
                Your Likes & Votes
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Keep track of the content you’ve appreciated. Your likes and
                votes help surface the best content in the community.
              </p>
            </div>

            <Tabs defaultValue="likes">
              <TabsList>
                <TabsTrigger value="likes">
                  <Heart className="h-4 w-4" />
                  Liked Posts ({likedPosts.length})
                </TabsTrigger>
                <TabsTrigger value="votes">
                  <TrendingUp className="h-4 w-4" />
                  Voted Posts ({votedPosts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="likes">
                <div className="space-y-6">
                  {likedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      actionType="like"
                      actionTime={post.likedAt}
                    />
                  ))}
                  {likedPosts.length === 0 && (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No liked posts yet
                      </h3>
                      <p className="text-gray-500">
                        Start exploring and like posts that you find helpful or
                        interesting!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="votes">
                <div className="space-y-6">
                  {votedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      actionType="vote"
                      actionTime={post.votedAt}
                    />
                  ))}
                  {votedPosts.length === 0 && (
                    <div className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No voted posts yet
                      </h3>
                      <p className="text-gray-500">
                        Start voting on posts to help the community identify
                        quality content!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
