import React from 'react';

// Lazy load components
const Home = React.lazy(() => import('@pages/Home/Home'));
const NotFound = React.lazy(() => import('@pages/NotFound/NotFound'));
const Forbidden = React.lazy(() => import('@pages/NotFound/Forbidden'));

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
const DashboardLayout = React.lazy(() => import('@components/Layout/DashboardLayout'));
const PublicLayout = React.lazy(() => import('@components/Layout/PublicLayout'));
const AdminDashboardPage = React.lazy(() => import('@pages/admin/AdminDashboard'));
const AdminRoles = React.lazy(() => import('@pages/admin/RoleManagement'));
const AdminUsers = React.lazy(() => import('@pages/admin/Users'));
const AdminPrograms = React.lazy(() => import('@pages/admin/Programs'));
const AdminBatches = React.lazy(() => import('@pages/admin/Batches'));

// Role-based dashboards
const TeacherDashboard = React.lazy(() => import('@pages/teacher/TeacherDashboard'));
const ParentDashboard = React.lazy(() => import('@pages/parent/ParentDashboard'));
const StudentDashboard = React.lazy(() => import('@pages/student/StudentDashboard'));

import { ProtectedRoute, PermissionRoute } from './Guard';

// Helper for protecting sub-routes
const wrapInAuth = (element) => <ProtectedRoute>{element}</ProtectedRoute>;
const wrapInPermission = (element, allowedRoles = [], requiredPermissions = []) => (
  <PermissionRoute allowedRoles={allowedRoles} requiredPermissions={requiredPermissions}>
    {element}
  </PermissionRoute>
);

export const routes = [
  // Public Routes (with Navbar and Footer)
  {
    path: '/',
    element: <PublicLayout />,
    routes: [
      { path: '/', exact: true, name: 'Home', element: <Home /> },
      // About routes
      { path: '/about', name: 'About', element: <About /> },
      { path: '/how-it-works', name: 'HowItWorks', element: <HowItWorks /> },
      { path: '/about/contact', name: 'Contact', element: <Contact /> },
      { path: '/about/teams', name: 'Teams', element: <Teams /> },
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
      { path: '/forbidden', name: 'Forbidden', element: <Forbidden /> },
      // 404 route inside PublicLayout so it has header/footer
      { path: '*', name: 'NotFound', element: <NotFound /> },
    ],
  },

  // Auth routes (No Navbar/Footer)
  { path: '/login', name: 'Login', element: <Login /> },
  { path: '/register', name: 'Register', element: <Register /> },
  { path: '/forgot-password', name: 'ForgotPassword', element: <ForgotPassword /> },
  { path: '/reset-password', name: 'ResetPassword', element: <ResetPassword /> },
  { path: '/auth/verify-email', name: 'VerifyEmail', element: <VerifyEmail /> },
  { path: '/pending-approval', name: 'PendingApproval', element: <PendingApproval /> },

  // dashboard routes (No Footer) - ALL PROTECTED
  { path: '/dashboard/chats', name: 'Chats', element: wrapInAuth(<Chats />) },
  {
    path: '/dashboard/chats/video-call',
    name: 'VideoCall',
    element: wrapInAuth(<VideoCall />),
  },
  {
    path: '/dashboard/achievements',
    name: 'Achievements',
    element: wrapInAuth(<Achievements />),
  },
  {
    path: '/dashboard/profile',
    name: 'Profile',
    element: wrapInAuth(<Profile />),
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    element: wrapInAuth(<Settings />),
  },
  {
    path: '/dashboard/chats/voice-call',
    name: 'VoiceCall',
    element: wrapInAuth(<VoiceCall />),
  },
  
  // Admin Routes - PROTECTED BY AUTH & PERMISSION
  {
    path: '/admin',
    name: 'AdminDashboardLayout',
    element: wrapInPermission(<DashboardLayout />, ['admin', 'super_admin'], ['dashboard.admin']),
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
      {
        path: '/admin/programs',
        name: 'AdminPrograms',
        element: <AdminPrograms />,
      },
      {
        path: '/admin/batches',
        name: 'AdminBatches',
        element: <AdminBatches />,
      },
      {
        path: '*',
        name: 'NotFound',
        element: <NotFound />,
      },
    ],
  },

  // Role-based Dashboard Routes - ALL PROTECTED
  {
    path: '/teacher',
    name: 'TeacherPortal',
    element: wrapInPermission(<DashboardLayout />, ['instructor', 'admin', 'super_admin'], ['dashboard.instructor']),
    routes: [
      {
        path: '/teacher/dashboard',
        name: 'Teacher Dashboard',
        element: <TeacherDashboard />,
      },
      {
        path: '*',
        name: 'NotFound',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/parent',
    name: 'ParentPortal',
    element: wrapInPermission(<DashboardLayout />, ['parent', 'admin', 'super_admin'], ['dashboard.parent']),
    routes: [
      {
        path: '/parent/dashboard',
        name: 'Parent Dashboard',
        element: <ParentDashboard />,
      },
      {
        path: '*',
        name: 'NotFound',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/student',
    name: 'StudentPortal',
    element: wrapInPermission(<DashboardLayout />, ['student', 'admin', 'super_admin'], ['dashboard.student']),
    routes: [
      {
        path: '/student/dashboard',
        name: 'Student Dashboard',
        element: <StudentDashboard />,
      },
      {
        path: '*',
        name: 'NotFound',
        element: <NotFound />,
      },
    ],
  },
  // Global 404 Route
  { path: '*', name: 'NotFound', element: <NotFound /> },
];
