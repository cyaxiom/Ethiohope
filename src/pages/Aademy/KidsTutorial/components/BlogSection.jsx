import React from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
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
    <section
      className={`py-24 bg-background ${
        isDark ? "text-foreground" : "text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold ${
              isDark ? "text-foreground" : "text-gray-900"
            }`}
          >
            Read our <span className="text-[#7b5cff] italic font-semibold">blog</span>
          </h2>
          <a
            href="#"
            className="flex items-center gap-2 text-[#7b5cff] hover:underline font-medium mt-4 md:mt-0"
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

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className={`rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden transform transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] ${
                isDark ? "bg-card border border-border" : "bg-[#faf7ff]"
              }`}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-foreground" : "text-gray-800"
                  }`}
                >
                  {blog.title}
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? "text-muted-foreground" : "text-gray-600"
                  }`}
                >
                  {blog.description}
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 text-[#7b5cff] font-medium hover:underline"
                >
                  Learn more
                  <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
                    <ArrowRight
                      className="w-4 h-4 text-white transform rotate-[330deg]"
                      strokeWidth={2.5}
                    />
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
