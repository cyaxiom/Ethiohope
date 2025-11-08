import React from "react";

const features = [
  {
    title: "Fun Quiz",
    description: "Test your understanding with a short but fun quizzes!",
    icon: "📘",
    bg: "from-purple-100 to-purple-200",
    shape: "bg-purple-300/60",
  },
  {
    title: "Creative Activities",
    description: "Discover enjoyable activities such as coloring, crafting, and science.",
    icon: "💡",
    bg: "from-purple-400 to-purple-500 text-white",
    shape: "bg-yellow-200/70",
  },
  {
    title: "Learn with Games",
    description: "Learn something new while your kids playing games!",
    icon: "🎮",
    bg: "from-yellow-200 to-yellow-300",
    shape: "bg-pink-300/60",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-[#FFF8F3] to-white overflow-hidden">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-200 rounded-full opacity-30 blur-2xl"></div>

      <div className="container mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our <span className="text-purple-500">interactive</span> features
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We bring joy and creativity into learning. Each tutorial is designed
            to inspire curiosity and confidence in every child.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.bg} rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 text-center relative`}
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div
                  className={`absolute inset-0 rounded-full ${feature.shape} animate-pulse`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 65% 10%, 80% 0%, 100% 15%, 90% 35%, 100% 50%, 90% 65%, 100% 85%, 80% 100%, 65% 90%, 50% 100%, 35% 90%, 20% 100%, 0% 85%, 10% 65%, 0% 50%, 10% 35%, 0% 15%, 20% 0%, 35% 10%)",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
