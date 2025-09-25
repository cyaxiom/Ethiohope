import React from 'react';
React;
const CoursePathsSection = () => {
  const paths = [
    {
      title: 'Beginner Path',
      duration: '3 months',
      ageGroup: '6-10 years',
      courses: ['Scratch Basics', 'Simple Animations', 'Interactive Stories'],
      color: 'green'
    },
    {
      title: 'Intermediate Path',
      duration: '6 months',
      ageGroup: '10-14 years',
      courses: ['Python Fundamentals', 'Web Design', 'Game Development'],
      color: 'blue'
    },
    {
      title: 'Advanced Path',
      duration: '9 months',
      ageGroup: '14-16 years',
      courses: ['Advanced Python', 'JavaScript Projects', 'App Development'],
      color: 'primary'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100',
      primary: 'bg-primary/10 border-primary/20 text-primary'
    };
    return colors[color];
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Learning Paths
          </h2>
          <p className="text-lg text-muted-foreground">
            Structured pathways designed for different ages and skill levels
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg border ${getColorClasses(path.color)}`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{path.title}</h3>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">
                    {path.duration}
                  </span>
                  <span className="px-2 py-1 rounded bg-black/10 dark:bg-white/10">
                    {path.ageGroup}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {path.courses.map((course, courseIndex) => (
                  <li key={courseIndex} className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-2 rounded font-semibold transition bg-primary hover:bg-primary/90 text-primary-foreground">
                Start This Path
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursePathsSection;