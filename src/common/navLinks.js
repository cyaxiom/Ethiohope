// @common/navLinks.js
export const navLinks = [
  {
    name: 'Home',
    path: '/',
    description: 'Welcome to our innovative platform',
    featured: true,
    image: '/images/nav/home-hero.jpg',
    badge: 'NEW',
  },
  {
    name: 'Academy',
    description: 'Premium educational programs and cutting-edge courses',
    dropdown: [
      {
        name: 'Kids Programming',
        path: '/academy/kids-programming',
        description: 'Fun and interactive coding programs for young innovators',
        icon: '👦',
        level: 'Beginner',
        price: '$99/mo',
        rating: 4.9,
      },
      {
        name: 'Web3 Development',
        path: '/academy/web3-development',
        description:
          'Master blockchain technology and decentralized applications',
        icon: '🔗',
        level: 'Advanced',
        price: '$199/mo',
        featured: true,
        rating: 4.8,
      },
      {
        name: 'Full-Stack Development',
        path: '/academy/full-stack-dev',
        description:
          'Comprehensive web development skills from frontend to backend',
        icon: '💻',
        level: 'Intermediate',
        price: '$149/mo',
        rating: 4.7,
      },
      {
        name: 'Kids Tutorial',
        path: '/academy/kids-tutorial',
        description: 'Interactive learning experiences designed for children',
        icon: '📚',
        level: 'Beginner',
        price: '$79/mo',
        rating: 4.9,
      },
    ],
    image: '/images/nav/academy-preview.jpg',
    featured: true,
    badge: 'POPULAR',
  },
  {
    name: 'Solutions',
    description: 'Professional services and expert solutions',
    dropdown: [
      {
        name: 'Kids Tutor',
        path: '/services/kids-tutor',
        description: 'Personalized tutoring sessions for young learners',
        icon: '👨‍🏫',
        delivery: '1-on-1 Sessions',
        price: '$49/hr',
        rating: 4.9,
      },
      {
        name: 'Programming Service',
        path: '/services/programming-service',
        description: 'Custom software development and technical solutions',
        icon: '⚡',
        delivery: 'Project-based',
        price: 'From $999',
        featured: true,
        rating: 4.8,
      },
      {
        name: 'Ethiohope Service',
        path: '/services/ethiohope-service',
        description: 'Community support initiatives and social impact programs',
        icon: '🤝',
        delivery: 'Community',
        price: 'Free',
        rating: 5.0,
      },
    ],
    image: '/images/nav/services-preview.jpg',
  },
  {
    name: 'Community',
    description: 'Join our vibrant and growing community network',
    dropdown: [
      {
        name: 'Forum',
        path: '/community/forum',
        description: 'Engage in discussions and share innovative ideas',
        icon: '💬',
        stats: '10K+ Discussions',
      },
      {
        name: 'Mentors',
        path: '/community/mentor',
        description: 'Connect with experienced mentors and industry experts',
        icon: '🎓',
        image: '/images/nav/mentors-preview.jpg',
        stats: '100+ Mentors',
      },
      {
        name: 'Events',
        path: '/community/event',
        description: 'Participate in exciting upcoming community events',
        icon: '📅',
        featured: true,
        stats: 'Monthly Events',
      },
    ],
    image: '/images/nav/community-preview.jpg',
  },
  {
    name: 'Company',
    description: 'Discover our mission, vision, and amazing team',
    dropdown: [
      {
        name: 'About Us',
        path: '/about',
        description:
          'Our inspiring story and core values that drive us forward',
        icon: '🏢',
        stats: '10+ Years Experience',
      },
      {
        name: 'Team',
        path: '/about/team',
        description: 'Meet our talented professionals and experts',
        icon: '👥',
        image: '/images/nav/team-preview.jpg',
        stats: '50+ Members',
      },
      {
        name: 'Contact',
        path: '/about/contact',
        description: 'Get in touch with us for collaborations and inquiries',
        icon: '📞',
        featured: true,
        stats: '24/7 Support',
      },
    ],
    image: '/images/nav/about-preview.jpg',
    featured: true,
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
