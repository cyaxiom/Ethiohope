// @common/navLinks.js
export const navLinks = [
  {
    name: 'Home',
    path: '/',
    description: 'Welcome to our platform',
  },
  {
    name: 'How it Works',
    path: '/how-it-works',
    description: 'See how our platform works',
  },
  {
    name: 'Team',
    path: '/about/teams',
    description: 'Meet our talented professionals',
  },
  {
    name: 'Contact',
    path: '/about/contact',
    description: 'Get in touch with us',
  },
  {
    name: 'About',
    path: '/about',
    description: 'Our inspiring story and core values',
  },
];


// Separate dashboard links
export const dashboardLinks = [
  {
    name: 'Dashboard Home',
    path: '/dashboard',
    icon: 'Home',
  },
  {
    name: 'Courses',
    path: '/dashboard/courses',
    icon: 'BookOpen',
  },
  {
    name: 'Profile',
    path: '/dashboard/profile',
    icon: 'User',
  },
  {
    name: 'Certificates',
    path: '/dashboard/certificates',
    icon: 'Award',
  },
  {
    name: 'Achievements',
    path: '/dashboard/achievements',
    icon: 'Star',
  },
  {
    name: 'Chats',
    path: '/dashboard/chats',
    icon: 'MessageCircle',
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: 'Settings',
    dropdown: [
      {
        name: 'General',
        path: '/dashboard/settings',
        icon: 'Settings',
      },
      {
        name: 'Account',
        path: '/dashboard/settings/account',
        icon: 'User',
      },
      {
        name: 'Theme',
        path: '/dashboard/settings/theme',
        icon: 'Palette',
      },
      {
        name: 'Notifications',
        path: '/dashboard/settings/notifications',
        icon: 'Bell',
      },
    ],
  },
];
