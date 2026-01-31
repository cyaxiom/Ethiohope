import React from 'react';

// Lazy load components
const Home = React.lazy(() => import('@pages/Home/Home'));
const NotFound = React.lazy(() => import('@pages/NotFound/NotFound'));

// About routes
const About = React.lazy(() => import('@pages/About/About'));
const Company = React.lazy(() => import('@pages/Company/Company'));
const Contact = React.lazy(() => import('@pages/About/Contact'));
const Teams = React.lazy(() => import('@pages/About/Teams'));

// Auth routes
const Login = React.lazy(() => import('@pages/Auth/Login'));
const Register = React.lazy(() => import('@pages/Auth/Register'));

// Community routes
const Events = React.lazy(() => import('@pages/Community/Events'));
const Forum = React.lazy(() => import('@pages/Community/Forum'));
const Mentors = React.lazy(() => import('@pages/Community/Mentors'));
//Forum routes
const ForumRegister = React.lazy(() => import('@components/Forum/Register'));
const ForumLogin = React.lazy(() => import('@components/Forum/Login'));
const Tags = React.lazy(() => import('@components/Forum/Tags'));
const Ranking = React.lazy(() => import('@components/Forum/Ranking'));
const Questions = React.lazy(() => import('@components/Forum/Questions'));
const QuestionDetails = React.lazy(() =>
  import('@components/Forum/QuestionDetails')
);
const MyQuestions = React.lazy(() => import('@components/Forum/MyQuestions'));
const MyAnswers = React.lazy(() => import('@components/Forum/MyAnswers'));
const Likes = React.lazy(() => import('@components/Forum/Likes'));
const ForumProfile = React.lazy(() => import('@components/Forum/ForumProfile'));

// Academy routes
const KidsProgramming = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/KidsProgramming')
);

const KidsTutorial = React.lazy(() =>
  import('@pages/Aademy/KidsTutorial/KidsTutorial')
)
const AllKidsCourses = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/components/AllCourses')
);
const Web3Development = React.lazy(() =>
  import('@pages/Aademy/Web3Development/Web3Development')
)
const FullStackDev = React.lazy(() =>
  import('@pages/Aademy/FullStackDev/FullStackDev')
)
// Services routes
const EthiohopeServices = React.lazy(() =>
  import('@pages/Services/EthiohopeService/EthiohopeService')
);
const ProgrammingService = React.lazy(() =>
  import('@pages/Services/ProgrammingService/ProgrammingService')
);

const KidsTutoring = React.lazy(() =>
  import('@pages/Services/KidsTutoring/KidsTutoring')
);
// const ProjectServices = React.lazy(() =>
//   import('@pages/Services/ProjectServices/ProjectServices')
// );

const CourseDetail = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/components/CourseDetail')
);

export const routes = [
  { path: '/', exact: true, name: 'Home', element: <Home /> },
  // About routes
  { path: '/about', name: 'About', element: <About /> },
  { path: '/company', name: 'Company', element: <Company /> },
  { path: '/about/contact', name: 'Contact', element: <Contact /> },
  { path: '/about/teams', name: 'Teams', element: <Teams /> },
  // Academy routes
  {
    path: '/academy/kids-programming',
    name: 'KidsProgramming',
    element: <KidsProgramming />,
  },
  {
    path: '/academy/kids-tutorial',
    name: 'KidsTutorial',
    element: <KidsTutorial />,
  },
  {
    path: '/academy/web3-development',
    name: 'Web3Development',
    element: <Web3Development />,
  },
  {
    path: '/academy/full-stack-dev',
    name: 'FullStackDev',
    element: <FullStackDev />,
  },
  // Auth routes
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/register', name: 'Register', element: <Register /> },
  // Academy routes
  { path: '/academy/web3-development', name: 'Web3Development', element: <Web3Development /> },
  // Community routes
  { path: '/community/events', name: 'Events', element: <Events /> },
  { path: '/community/forum', name: 'Forum', element: <Forum /> },
  { path: '/community/mentors', name: 'Mentors', element: <Mentors /> },
  // Forum sub-routes
  {
    path: '/community/forum/register',
    name: 'ForumRegister',
    element: <ForumRegister />,
  },
  {
    path: '/community/forum/login',
    name: 'ForumLogin',
    element: <ForumLogin />,
  },
  // Forum nested routes
  {
    path: '/community/forum',
    name: 'ForumMain',
    element: <Forum />,
    routes: [
      {
        path: '/community/forum/tags',
        name: 'ForumTags',
        element: <Tags />,
      },
      {
        path: '/community/forum/ranking',
        name: 'ForumRanking',
        element: <Ranking />,
      },
      {
        path: '/community/forum',
        name: 'ForumQuestions',
        element: <Questions />,
      },
      //question details route with id param
      {
        path: '/community/forum/questions/:id',
        name: 'ForumQuestionDetails',
        element: <QuestionDetails />,
      },
      {
        path: '/community/forum/my-questions',
        name: 'ForumMyQuestions',
        element: <MyQuestions />,
      },
      {
        path: '/community/forum/my-answers',
        name: 'ForumMyAnswers',
        element: <MyAnswers />,
      },
      {
        path: '/community/forum/likes',
        name: 'ForumLikes',
        element: <Likes />,
      },
      {
        path: '/community/forum/profile',
        name: 'ForumProfile',
        element: <ForumProfile />,
      },
    ],
  },
  // Services routes
  {
    path: '/services/ethiohope-service',
    name: 'EthiohopeServices',
    element: <EthiohopeServices />,
  },
  {
    path: '/services/kids-tutoring',
    name: 'KidsTutoring',
    element: <KidsTutoring />,
  },
  {
    path: '/academy/kids-programming/all_kids_course',
    name: 'AllKidsCourses',
    element: <AllKidsCourses />,
  },
  {
    path: '/academy/kids-programming/course/:id',
    name: 'CourseDetail',
    element: <CourseDetail />,
  },
  {
    path: '/services/programming-service',
    name: 'ProgrammingService',
    element: <ProgrammingService />,
  },


  // 404 route - must be last
  { path: '*', name: 'NotFound', element: <NotFound /> },
];
