import React from 'react';

const ToolsSection = () => {
  const tools = [
    {
      icon: '🐍',
      name: 'Python',
      description: 'Perfect for beginners with simple syntax',
      ageGroup: 'Ages 8-16'
    },
    {
      icon: '🧩',
      name: 'Scratch',
      description: 'Visual programming with drag-and-drop blocks',
      ageGroup: 'Ages 6-12'
    },
    {
      icon: '🌐',
      name: 'HTML/CSS',
      description: 'Build and style amazing websites',
      ageGroup: 'Ages 10-16'
    },
    {
      icon: '⚡',
      name: 'JavaScript',
      description: 'Create interactive web experiences',
      ageGroup: 'Ages 12-16'
    }
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Programming Tools We Teach
          </h2>
          <p className="text-lg text-muted-foreground">
            Age-appropriate technologies to build real programming skills
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-lg border border-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{tool.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {tool.name}
                  </h3>
                  <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
                    {tool.ageGroup}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;