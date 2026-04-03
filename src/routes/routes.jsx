import React from 'react';

// Lazy load components
const Home = React.lazy(() => import('@pages/Home/Home'));
const NotFound = React.lazy(() => import('@pages/NotFound/NotFound'));

// About routes
const About = React.lazy(() => import('@pages/About/About'));
const Contact = React.lazy(() => import('@pages/About/Contact'));
const Teams = React.lazy(() => import('@pages/About/Teams'));
const HowItWorks = React.lazy(() => import('@pages/HowItWorks/HowItWorks'));

// Auth routes
const Login = React.lazy(() => import('@pages/Auth/Login'));
const Register = React.lazy(() => import('@pages/Auth/Register'));
const ForgotPassword = React.lazy(() => import('@pages/Auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@pages/Auth/ResetPassword'));
const VerifyEmail = React.lazy(() => import('@pages/Auth/VerifyEmail'));

// Status pages
const PendingApproval = React.lazy(() => import('@pages/PendingApproval'));

// Community routes removed
//Forum routes
const ForumRegister = React.lazy(() => import('@components/Forum/Register'));
const ForumLogin = React.lazy(() => import('@components/Forum/Login'));
const Tags = React.lazy(() => import('@components/Forum/Tags'));
const Ranking = React.lazy(() => import('@components/Forum/Ranking'));
const Questions = React.lazy(() => import('@components/Forum/Questions'));
const QuestionDetails = React.lazy(
  () => import('@components/Forum/QuestionDetails'),
);
const MyQuestions = React.lazy(() => import('@components/Forum/MyQuestions'));
const MyAnswers = React.lazy(() => import('@components/Forum/MyAnswers'));
const Likes = React.lazy(() => import('@components/Forum/Likes'));
const ForumProfile = React.lazy(() => import('@components/Forum/ForumProfile'));

//dashboard routes
const Chats = React.lazy(() => import('@pages/Dashboard/Chats'));
const VideoCall = React.lazy(() => import('@pages/Dashboard/VideoCall'));
const VoiceCall = React.lazy(() => import('@pages/Dashboard/VoiceCall'));
const Achievements = React.lazy(() => import('@pages/Dashboard/Achievements'));
const Profile = React.lazy(() => import('@pages/Dashboard/Profile'));
const Settings = React.lazy(() => import('@pages/Dashboard/settings/Settings'));
// Academy routes removed
// Services routes
const EthiohopeServices = React.lazy(
  () => import('@pages/Services/EthiohopeService/EthiohopeService'),
);
const ProgrammingService = React.lazy(
  () => import('@pages/Services/ProgrammingService/ProgrammingService'),
);

const KidsTutoring = React.lazy(
  () => import('@pages/Services/KidsTutoring/KidsTutoring'),
);
// const ProjectServices = React.lazy(() =>
//   import('@pages/Services/ProjectServices/ProjectServices')
// );

// CourseDetail removed

// Admin routes
const AdminDashboardLayout = React.lazy(() => import('@components/Layout/DashboardLayout'));
const AdminDashboardPage = React.lazy(() => import('@pages/admin/AdminDashboard'));
const AdminRoles = React.lazy(() => import('@pages/admin/RoleManagement'));
const AdminUsers = React.lazy(() => import('@pages/admin/Users'));

// Role-based dashboards
const TeacherDashboard = React.lazy(() => import('@pages/teacher/TeacherDashboard'));
const ParentDashboard = React.lazy(() => import('@pages/parent/ParentDashboard'));
const StudentDashboard = React.lazy(() => import('@pages/student/StudentDashboard'));

export const routes = [
  { path: '/', exact: true, name: 'Home', element: <Home /> },
  //dashboard routes
  { path: '/dashboard/chats', name: 'Chats', element: <Chats /> },
  {
    path: '/dashboard/chats/video-call',
    name: 'VideoCall',
    element: <VideoCall />,
  },
  {
    path: '/dashboard/achievements',
    name: 'Achievements',
    element: <Achievements />,
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    element: <Profile />,
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    element: <Settings />,
  },
  {
    path: '/dashboard/chats/voice-call',
    name: 'VoiceCall',
    element: <VoiceCall />,
  },
  // About routes
  { path: '/about', name: 'About', element: <About /> },
  { path: '/how-it-works', name: 'HowItWorks', element: <HowItWorks /> },
  { path: '/about/contact', name: 'Contact', element: <Contact /> },
  { path: '/about/teams', name: 'Teams', element: <Teams /> },
  // Academy routes removed
  // Auth routes
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/register', name: 'Register', element: <Register /> },
  { path: '/forgot-password', name: 'ForgotPassword', element: <ForgotPassword /> },
  { path: '/reset-password', name: 'ResetPassword', element: <ResetPassword /> },
  { path: '/auth/verify-email', name: 'VerifyEmail', element: <VerifyEmail /> },
  { path: '/pending-approval', name: 'PendingApproval', element: <PendingApproval /> },
  // Community and Forum routes removed
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
    path: '/services/programming-service',
    name: 'ProgrammingService',
    element: <ProgrammingService />,
  },
  
  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboardLayout',
    element: <AdminDashboardLayout />,
    routes: [
      {
        path: '/admin/dashboard',
        name: 'AdminDashboardPage',
        element: <AdminDashboardPage />,
      },
      {
        path: '/admin/roles',
        name: 'AdminRoles',
        element: <AdminRoles />,
      },
      {
        path: '/admin/users',
        name: 'AdminUsers',
        element: <AdminUsers />,
      },
    ],
  },

  // Role-based Dashboard Routes
  {
    path: '/teacher',
    name: 'TeacherPortal',
    element: <AdminDashboardLayout />,
    routes: [
      {
        path: '/teacher/dashboard',
        name: 'Teacher Dashboard',
        element: <TeacherDashboard />,
      },
    ],
  },
  {
    path: '/parent',
    name: 'ParentPortal',
    element: <AdminDashboardLayout />,
    routes: [
      {
        path: '/parent/dashboard',
        name: 'Parent Dashboard',
        element: <ParentDashboard />,
      },
    ],
  },
  {
    path: '/student',
    name: 'StudentPortal',
    element: <AdminDashboardLayout />,
    routes: [
      {
        path: '/student/dashboard',
        name: 'Student Dashboard',
        element: <StudentDashboard />,
      },
    ],
  },

  // 404 route - must be last
  { path: '*', name: 'NotFound', element: <NotFound /> },
];
