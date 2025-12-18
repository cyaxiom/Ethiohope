import React from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
import { DS } from "@/constants/designSystem";
import { SectionContainer } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";

export default function FeaturesSection() {
  const { isDark } = useTheme();

  const features = [
    {
      title: "Fun Quiz",
      description: "Test your understanding with a short but fun quizzes!",
      icon: "📘",
      bgLight: "from-purple-100 to-purple-200",
      bgDark: "from-purple-900/40 to-purple-800/40",
      shapeLight: "bg-purple-300/60",
      shapeDark: "bg-purple-500/40",
    },
    {
      title: "Creative Activities",
      description: "Discover enjoyable activities such as coloring, crafting, and science.",
      icon: "💡",
      bgLight: "from-purple-400 to-purple-500 text-white",
      bgDark: "from-purple-600 to-purple-700 text-white",
      shapeLight: "bg-yellow-200/70",
      shapeDark: "bg-yellow-400/40",
    },
    {
      title: "Learn with Games",
      description: "Learn something new while your kids playing games!",
      icon: "🎮",
      bgLight: "from-yellow-200 to-yellow-300",
      bgDark: "from-yellow-800/40 to-yellow-700/40",
      shapeLight: "bg-pink-300/60",
      shapeDark: "bg-pink-500/40",
    },
  ];

  return (
    <section
      className={`relative bg-gradient-to-b overflow-hidden ${
        isDark ? "from-[#1a1625] to-background" : "from-[#FFF8F3] to-white"
      }`}
    >
      {/* Decorative Blobs */}
      <div
        className={`absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-40 blur-3xl ${
          isDark ? "bg-yellow-600" : "bg-yellow-200"
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-30 blur-2xl ${
          isDark ? "bg-pink-600" : "bg-pink-200"
        }`}
      />

      <SectionContainer sectionSpacing="xl" containerSize="lg">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Heading variant="h2">
            Our <span className="text-purple-500">interactive</span> features
          </Heading>
          <Text size="lg" className="max-w-2xl mx-auto line-clamp-3">
            We bring joy and creativity into learning. Each tutorial is designed
            to inspire curiosity and confidence in every child.
          </Text>
        </div>

        {/* Feature Cards */}
        <div className={`${DS.grids.cards3} ${DS.spacing.gap.lg}`}>
          {features.map((feature, index) => (
            <Card
              key={index}
              padding="lg"
              hoverable
              interactive
              className={`bg-gradient-to-br ${
                isDark ? feature.bgDark : feature.bgLight
              } text-center relative h-full flex flex-col`}
            >
              {/* Icon */}
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div
                  className={`absolute inset-0 rounded-full ${
                    isDark ? feature.shapeDark : feature.shapeLight
                  } animate-pulse`}
                  style={{
                    clipPath:
                      "polygon(50% 0%, 65% 10%, 80% 0%, 100% 15%, 90% 35%, 100% 50%, 90% 65%, 100% 85%, 80% 100%, 65% 90%, 50% 100%, 35% 90%, 20% 100%, 0% 85%, 10% 65%, 0% 50%, 10% 35%, 0% 15%, 20% 0%, 35% 10%)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 flex-grow flex flex-col">
                <h3
                  className={`text-xl font-semibold line-clamp-2 min-h-[3.5rem] ${
                    isDark
                      ? feature.bgDark.includes("text-white")
                        ? "text-white"
                        : "text-foreground"
                      : "text-gray-800"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`line-clamp-3 min-h-[4.5rem] ${
                    isDark
                      ? feature.bgDark.includes("text-white")
                        ? "text-white/90"
                        : "text-muted-foreground"
                      : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
