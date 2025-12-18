import React from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
import { DS } from "@/constants/designSystem";
import { SectionContainer } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import blogOne from "../assets/images/blog-one.png";
import blogTwo from "../assets/images/blog-two.png";
import blogThree from "../assets/images/blog-three.png";

export default function BlogSection() {
  const { isDark } = useTheme();

  const blogs = [
    {
      title: "Learning with Games? Why not!",
      description: "Embrace the joy of games to enhance your learning experience!",
      image: blogOne,
    },
    {
      title: "10 Learning Game Ideas",
      description: "10 ideas for learning with for your kids to have fun.",
      image: blogTwo,
    },
    {
      title: "Fun Activities for Kids",
      description: "Want to do something outside from your laptop? Here are our recommendations.",
      image: blogThree,
    },
  ];

  return (
    <section className="bg-background">
      <SectionContainer sectionSpacing="xl" containerSize="lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <Heading variant="h2">
            Read our <span className="text-[#7b5cff] italic font-semibold">blog</span>
          </Heading>
          <a
            href="#all-blogs"
            className="flex items-center gap-2 text-[#7b5cff] hover:underline font-medium mt-4 md:mt-0 transition-all hover:gap-3"
          >
            See all
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight
                className="w-4 h-4 text-white transform rotate-[330deg]"
                strokeWidth={2.5}
              />
            </span>
          </a>
        </div>

        {/* Blog Cards */}
        <div className={`${DS.grids.cards3} ${DS.spacing.gap.lg}`}>
          {blogs.map((blog, idx) => (
            <Card 
              key={idx}
              variant="default"
              hoverable
              interactive
              padding="none"
              className="overflow-hidden h-full flex flex-col"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover flex-shrink-0"
              />
              <div className="p-6 flex flex-col flex-grow space-y-4">
                <Heading 
                  variant="h4" 
                  className="line-clamp-2 min-h-[3.5rem]"
                >
                  {blog.title}
                </Heading>
                <Text 
                  size="sm" 
                  className="flex-grow line-clamp-3 min-h-[4.5rem]"
                >
                  {blog.description}
                </Text>
                <div className="mt-auto pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => window.location.href = `#blog-${idx + 1}`}
                    className="text-[#7b5cff] hover:text-[#6a4ce6] p-0"
                  >
                    Learn more
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
