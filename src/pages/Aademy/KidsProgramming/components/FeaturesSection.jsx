import React from 'react';
React;
const FeaturesSection = () => {
  const features = [
    {
      icon: '🎮',
      title: 'Game-Based Learning',
      description: 'Learn coding by playing and creating your own games.'
    },
    {
      icon: '🎨',
      title: 'Creative Projects',
      description: 'Build stories, animations, and digital art while coding.'
    },
    {
      icon: '👨‍🏫',
      title: 'Guided Lessons',
      description: 'Expert instructors to guide and support young learners.'
    },
    {
      icon: '🧩',
      title: 'Problem Solving',
      description: 'Develop logical thinking through fun coding puzzles.'
    },
    {
      icon: '🏆',
      title: 'Achievement System',
      description: 'Earn badges and certificates as you progress.'
    },
    {
      icon: '👥',
      title: 'Collaborative Learning',
      description: 'Work with other young coders on exciting projects.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Why Kids Love Our Program
          </h2>
          <p className="text-lg text-muted-foreground">
            We make coding fun, engaging, and accessible for every child
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-md border border-border transition-transform hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;