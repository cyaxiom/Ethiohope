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
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border border-border bg-muted text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div
      className={`p-6 border-b border-border ${className}`}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Avatar({ name }) {
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold"
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
    <div className="grid w-full grid-cols-2 mb-8 border border-border rounded-xl overflow-hidden bg-muted/30 p-1">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { active, setActive })
      )}
    </div>
  );
}

function TabsTrigger({ value, children, active, setActive }) {
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-all rounded-lg ${isActive
          ? 'bg-card text-primary shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
    <Card className="hover:shadow-md transition-all border border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {actionType === 'vote' && (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  <ArrowUp className="w-4 h-4 inline-block mr-0.5" /> Upvoted
                </Badge>
              )}
              {actionType === 'like' && (
                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                  <Heart className="w-4 h-4 inline-block mr-0.5" /> Liked
                </Badge>
              )}
            </div>
            <h3
              onClick={() => navigate(`/community/forum/questions/${post.id}`)}
              className="text-lg font-bold text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {post.title}
            </h3>
            <div
              className={`flex items-center gap-2 mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'
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
    <div className="min-h-screen relative">
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
