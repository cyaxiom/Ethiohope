import React from 'react';

// Lazy load components
const Home = React.lazy(() => import('@pages/Home/Home'));
const NotFound = React.lazy(() => import('@pages/NotFound/NotFound'));

// About routes
const About = React.lazy(() => import('@pages/About/About'));
const Contact = React.lazy(() => import('@pages/About/Contact'));
const Teams = React.lazy(() => import('@pages/About/Teams'));

// Auth routes
const Login = React.lazy(() => import('@pages/Auth/Login'));
const Register = React.lazy(() => import('@pages/Auth/Register'));

// Community routes
const Events = React.lazy(() => import('@pages/Community/Events'));
const Forum = React.lazy(() => import('@pages/Community/Forum'));
const Mentors = React.lazy(() => import('@pages/Community/Mentors'));

// Academy routes
const KidsProgramming = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/KidsProgramming')
);
 const AllKidsCourses = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/components/AllCourses')
);
// Services routes
const EthiohopeServices = React.lazy(() =>
  import('@pages/Services/EthiohopeService/EthiohopeService')
);
const KidsTutoring = React.lazy(() =>
  import('@pages/Services/KidsTutoring/KidsTutoring')
);
const ProjectServices = React.lazy(() =>
  import('@pages/Services/ProjectServices/ProjectServices')
);

const CourseDetail = React.lazy(() =>
  import('@pages/Aademy/KidsProgramming/components/CourseDetail')
);

export const routes = [
  { path: '/', exact: true, name: 'Home', element: <Home /> },
  // About routes
  { path: '/about', name: 'About', element: <About /> },
  { path: '/about/contact', name: 'Contact', element: <Contact /> },
  { path: '/about/teams', name: 'Teams', element: <Teams /> },
  // Auth routes
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/register', name: 'Register', element: <Register /> },
  // Community routes
  { path: '/community/events', name: 'Events', element: <Events /> },
  { path: '/community/forum', name: 'Forum', element: <Forum /> },
  { path: '/community/mentors', name: 'Mentors', element: <Mentors /> },
  // Academy routes
  {
    path: '/academy/kids-programming',
    name: 'KidsProgramming',
    element: <KidsProgramming />,
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
    path: '/services/project-services',
    name: 'ProjectServices',
    element: <ProjectServices />,
  },
  // 404 route - must be last
  { path: '*', name: 'NotFound', element: <NotFound /> },
];
