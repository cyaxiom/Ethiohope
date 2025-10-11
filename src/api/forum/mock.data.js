import avatar from '@images/avatar.png';

export const sampleQuestions = [
  {
    id: 1,
    question: 'How to patch KDE on FreeBSD?',
    title: 'KDE on FreeBSD?',
    author: 'Golangingya',
    profile_pic: avatar,
    created_at: '2023-10-01T10:00:00Z',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat aliquet maecenas ut sit nulla',
    tags: ['golang', 'linux', 'overflow'],
    views: 125,
    answers: 15,
    votes: 155,
    status: 'Top',
    category: 'Web Development',
  },
  {
    id: 2,
    title: 'Best way to learn React?',
    question: 'What is the best way to learn React?',
    author: 'ReactLover',
    profile_pic: avatar,
    created_at: '2023-10-02T12:00:00Z',
    description: "I'm looking for resources to learn React effectively.",
    tags: ['react', 'javascript', 'frontend'],
    views: 200,
    answers: 30,
    votes: 250,
    status: 'Trending',
    category: 'Artificial Intelligence',
  },
  {
    id: 3,
    title: 'Optimize SQL queries',
    question: 'How to optimize SQL queries?',
    author: 'SQLMaster',
    profile_pic: avatar,
    created_at: '2025-10-03T14:00:00Z',
    description: 'Looking for tips to improve SQL query performance.',
    tags: ['sql', 'database', 'performance'],
    views: 300,
    answers: 45,
    votes: 400,
    status: 'Hot',
    category: 'Data Science',
  },
  {
    id: 4,
    title: 'New features in Python 3.10',
    question: 'What are the new features in Python 3.10?',
    author: 'PythonGuru',
    profile_pic: avatar,
    created_at: '2023-10-03T16:00:00Z',
    description: "I'm excited about the new features in Python 3.10!",
    tags: ['python', 'programming', 'features'],
    views: 400,
    answers: 60,
    votes: 500,
    category: 'Programming',
    status: 'Hot',
  },
  {
    id: 5,
    title: 'Setting up a Node.js server',
    question: 'How to set up a Node.js server?',
    author: 'NodeMaster',
    profile_pic: avatar,
    created_at: '2020-10-04T18:00:00Z',
    description: 'Looking for a guide to set up a Node.js server.',
    tags: ['nodejs', 'backend', 'server'],
    views: 500,
    answers: 75,
    votes: 600,
    status: 'New',
    category: 'Web Development',
  },
];

export const sampleTags = [
  {
    name: 'react',
    description: 'A JavaScript library for building user interfaces.',
    questions: 1245,
    followers: 356,
  },
  {
    name: 'linux',
    description: 'Open-source operating system widely used for servers.',
    questions: 980,
    followers: 220,
  },
  {
    name: 'golang',
    description: 'An open-source programming language designed for speed.',
    questions: 543,
    followers: 180,
  },
  {
    name: 'database',
    description: 'Organized data storage systems like SQL and NoSQL.',
    questions: 432,
    followers: 95,
  },
];

export const answers = [
  {
    id: 1,
    author: 'Jane Doe',
    profile_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
    question:
      'You can optimize SQL queries by adding proper indexes, avoiding SELECT *, and analyzing query execution plans.',
    answer:
      'To optimize SQL queries, focus on proper indexing, avoid SELECT *, use WHERE clauses effectively, and consider query execution plans. Here are the key strategies...',
    created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    votes: 12,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 234,
    createdAt: '2 hours ago',
    comments: 3,
    questionId: 1,
  },
  {
    id: 2,
    author: 'John Smith',
    profile_pic: 'https://randomuser.me/api/portraits/men/32.jpg',
    question:
      'Make sure to normalize your database properly, but denormalize selectively for performance-critical queries.',
    answer:
      'Python 3.10 introduced several exciting features including structural pattern matching, better error messages, and union types. The match-case statement is particularly powerful...',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    votes: 8,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 156,
    createdAt: '1 day ago',
    comments: 2,
    questionId: 1,
  },
  {
    id: 3,
    author: 'Alice Johnson',
    profile_pic: 'https://randomuser.me/api/portraits/women/45.jpg',
    question:
      'Consider using caching strategies to improve performance for frequently accessed data.',
    answer:
      'When designing React components, follow the single responsibility principle, use proper prop types, implement error boundaries, and optimize with React.memo when needed...',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    votes: 5,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 445,
    createdAt: '3 days ago',
    comments: 7,
    questionId: 1,
  },
  {
    id: 4,
    author: 'Bob Brown',
    profile_pic: 'https://randomuser.me/api/portraits/men/43.jpg',
    question:
      'Utilize database connection pooling to enhance performance and resource management.',
    answer:
      'To set up a Node.js server, start by installing Node.js and npm. Then, create a new project directory, initialize it with npm init, and install Express.js. Create an app.js file to define your server routes and middleware. Finally, run your server using node app.js.',

    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    votes: 3,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 300,
    createdAt: '2 days ago',
    comments: 1,
    questionId: 1,
  },
  {
    id: 5,
    author: 'Jane Doe',
    profile_pic: 'https://randomuser.me/api/portraits/women/44.jpg',
    answer:
      'To optimize SQL queries, focus on proper indexing, avoid SELECT *, use WHERE clauses effectively, and consider query execution plans. Here are the key strategies...',
    question:
      'You can optimize SQL queries by adding proper indexes, avoiding SELECT *, and analyzing query execution plans.',
    created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    votes: 12,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 234,
    createdAt: '2 hours ago',
    comments: 3,
    questionId: 1,
  },
  {
    id: 6,
    author: 'John Smith',
    profile_pic: 'https://randomuser.me/api/portraits/men/32.jpg',
    question:
      'Make sure to normalize your database properly, but denormalize selectively for performance-critical queries.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    votes: 8,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 156,
    createdAt: '1 day ago',
    comments: 2,
    questionId: 1,
    answer:
      'Python 3.10 introduced several exciting features including structural pattern matching, better error messages, and union types. The match-case statement is particularly powerful...',
  },
  {
    id: 7,
    author: 'Alice Johnson',
    profile_pic: 'https://randomuser.me/api/portraits/women/45.jpg',
    question:
      'Consider using caching strategies to improve performance for frequently accessed data.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    votes: 5,
    question_id: 1,
    tags: ['sql', 'database', 'performance'],
    views: 445,
    createdAt: '3 days ago',
    comments: 7,
    questionId: 1,
    answer:
      'When designing React components, follow the single responsibility principle, use proper prop types, implement error boundaries, and optimize with React.memo when needed...',
  },
  {
    id: 8,
    author: 'Bob Brown',
    profile_pic: 'https://randomuser.me/api/portraits/men/43.jpg',
    question:
      'Utilize database connection pooling to enhance performance and resource management.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    votes: 3,
    question_id: 2,
    tags: ['sql', 'database', 'performance'],
    views: 300,
    createdAt: '2 days ago',
    comments: 1,
    questionId: 1,
    answer:
      'To set up a Node.js server, start by installing Node.js and npm. Then, create a new project directory, initialize it with npm init, and install Express.js. Create an app.js file to define your server routes and middleware. Finally, run your server using node app.js.',
  },
];

export const likedPosts = [
  {
    id: 1,
    type: 'question',
    title: 'How to implement authentication in Next.js?',
    author: 'NextJSDev',
    excerpt:
      "I'm building a Next.js application and need to implement user authentication. What are the best practices and libraries to use?",
    tags: ['nextjs', 'authentication', 'react'],
    votes: 45,
    views: 1200,
    comments: 12,
    likedAt: '1 hour ago',
  },
  {
    id: 2,
    type: 'answer',
    title: 'Best way to handle state management in large React apps?',
    author: 'StateExpert',
    excerpt:
      "For large React applications, I recommend using Redux Toolkit with RTK Query for server state management. Here's why...",
    tags: ['react', 'redux', 'state-management'],
    votes: 32,
    views: 890,
    comments: 8,
    likedAt: '3 hours ago',
  },
  {
    id: 3,
    type: 'question',
    title: 'Database design patterns for microservices',
    author: 'ArchitectPro',
    excerpt:
      'What are the recommended database design patterns when working with microservices architecture?',
    tags: ['microservices', 'database', 'architecture'],
    votes: 28,
    views: 567,
    comments: 15,
    likedAt: '1 day ago',
  },
];

export const votedPosts = [
  {
    id: 4,
    type: 'answer',
    title: 'How to optimize Docker images for production?',
    author: 'DockerGuru',
    excerpt:
      'To optimize Docker images for production, use multi-stage builds, minimize layers, and choose appropriate base images...',
    tags: ['docker', 'optimization', 'devops'],
    votes: 67,
    views: 2100,
    comments: 23,
    voteType: 'up',
    votedAt: '2 hours ago',
  },
  {
    id: 5,
    type: 'question',
    title: 'GraphQL vs REST API - Which to choose?',
    author: 'APIDesigner',
    excerpt:
      "I'm designing a new API for my application. Should I go with GraphQL or stick with REST? What are the trade-offs?",
    tags: ['graphql', 'rest', 'api-design'],
    votes: 89,
    views: 3400,
    comments: 34,
    voteType: 'up',
    votedAt: '5 hours ago',
  },
  {
    id: 6,
    type: 'answer',
    title: 'TypeScript generics explained with examples',
    author: 'TSMaster',
    excerpt:
      "TypeScript generics allow you to create reusable components. Here's a comprehensive guide with practical examples...",
    tags: ['typescript', 'generics', 'programming'],
    votes: 156,
    views: 5600,
    comments: 45,
    voteType: 'up',
    votedAt: '2 days ago',
  },
];

export const profileDetails = [
  {
    id: 1,
    name: 'John Developer',
    bio: 'Full Stack Developer & Community Member',
    location: 'San Francisco, CA',
    joinDate: 'March 2023',
    answers: 47,
    likes: 234,
    reputation: 1200,
    about:
      'Passionate full-stack developer with 5+ years of experience building scalable web applications. I love sharing knowledge and helping fellow developers solve complex problems.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    recentActivity: [
      {
        type: 'Answered',
        content: 'How to optimize SQL queries?',
        time: '2 hours ago',
      },
      {
        type: 'Liked',
        content: 'What are the new features in Python 3.10?',
        time: '1 day ago',
      },
      {
        type: 'Answered',
        content: 'What is the best way to learn React?',
        time: '3 days ago',
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Developer',
    bio: 'Backend Developer & Community Member',
    location: 'New York, NY',
    joinDate: 'January 2022',
    answers: 30,
    likes: 150,
    reputation: 900,
    about:
      'Experienced backend developer specializing in Node.js and database design. I enjoy contributing to open-source projects and mentoring junior developers.',
    skills: ['Node.js', 'Express', 'MongoDB', 'SQL', 'Docker'],
    recentActivity: [
      {
        type: 'Answered',
        content: 'How to set up a Node.js server?',
        time: '5 hours ago',
      },
      {
        type: 'Liked',
        content: 'Best practices for REST API design?',
        time: '2 days ago',
      },
      {
        type: 'Answered',
        content: 'What are the benefits of using Docker?',
        time: '4 days ago',
      },
    ],
  },
];
