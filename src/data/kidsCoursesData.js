// Kids Programming Courses Data with modules
export const kidsCoursesData = [
  {
    id: 1,
    name: "Scratch Animation Studio",
    icon: "🎨",
    modules: [
      {
        level: "Beginner",
        description: "Welcome to the magical world of animation! Students will learn to bring their imagination to life using Scratch's visual programming language. They'll create animated stories, interactive games, and moving characters.",
        ageGroup: "Ages 6-10",
        image: "/LittleCoder.png",
        duration: "8 weeks",
        language: "English",
        skills: "Animation, Storytelling, Game Design, Scratch Programming, Creativity"
      }
    ]
  },
  {
    id: 2,
    name: "Python Game Adventures",
    icon: "🐍",
    modules: [
      {
        level: "Intermediate",
        description: "Embark on an exciting journey into Python programming through game development! Students will learn variables, loops, conditionals, functions while building games like Snake and Tic-Tac-Toe.",
        ageGroup: "Ages 10-14",
        image: "/LittleCoder1.png",
        duration: "12 weeks",
        language: "English",
        skills: "Python, Game Development, Logic, Problem Solving, Loops, Conditionals"
      }
    ]
  },
  {
    id: 3,
    name: "Web Design for Young Creators",
    icon: "🌐",
    modules: [
      {
        level: "Beginner",
        description: "Learn to create stunning websites from scratch using HTML and CSS. Students will structure web pages, add images, navigation menus, and style sites with colors, fonts, and layouts.",
        ageGroup: "Ages 9-13",
        image: "/LittleCoder2.png",
        duration: "10 weeks",
        language: "Amharic",
        skills: "HTML, CSS, Web Design, Responsive Design, Portfolio Building"
      }
    ]
  },
  {
    id: 4,
    name: "Minecraft Modding Mastery",
    icon: "⛏️",
    modules: [
      {
        level: "Intermediate",
        description: "Transform Minecraft experience by creating custom mods! Students learn Java programming, mod development, creative problem-solving, and design interactive structures.",
        ageGroup: "Ages 11-15",
        image: "/LittleCoder1.png",
        duration: "14 weeks",
        language: "English",
        skills: "Java, Minecraft Modding, Game Mechanics, Creative Problem Solving, Programming Fundamentals"
      }
    ]
  },
  {
    id: 5,
    name: "Mobile App Building Basics",
    icon: "📱",
    modules: [
      {
        level: "Intermediate",
        description: "Create your first mobile apps using beginner-friendly tools and visual programming concepts. Learn app design, UI creation, and basic app functionality.",
        ageGroup: "Ages 12-16",
        image: "/LittleCoder.png",
        duration: "12 weeks",
        language: "English",
        skills: "Mobile Apps, UX/UI Design, Visual Programming, App Development, Creativity"
      }
    ]
  }
];

// Filtering helpers updated for modules
export const getCoursesByLevel = (level) =>
  kidsCoursesData.filter(course => 
    course.modules.some(module => module.level.toLowerCase() === level.toLowerCase())
  );

export const getCoursesByAgeGroup = (minAge, maxAge) =>
  kidsCoursesData.filter(course => 
    course.modules.some(module => {
      const ageRange = module.ageGroup.match(/\d+/g);
      const courseMinAge = parseInt(ageRange[0]);
      const courseMaxAge = parseInt(ageRange[1]);
      return courseMinAge <= maxAge && courseMaxAge >= minAge;
    })
  );

export const getCoursesByLanguage = (language) =>
  kidsCoursesData.filter(course =>
    course.modules.some(module =>
      module.language.toLowerCase().includes(language.toLowerCase())
    )
  );

export default kidsCoursesData;
