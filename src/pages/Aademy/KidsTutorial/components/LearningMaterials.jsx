import React from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
import { ArrowRight } from "lucide-react";
import learningMaterial from "../assets/images/learning-material.png";

export default function LearningMaterials() {
  const { isDark } = useTheme();

  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-background">
      <div
        className={`absolute top-0 right-0 w-[200px] h-[200px] rounded-full blur-3xl opacity-50 -z-10 ${
          isDark ? "bg-purple-800" : "bg-purple-100"
        }`}
      />
      <div
        className={`absolute bottom-0 left-0 w-[180px] h-[180px] rounded-full blur-3xl opacity-50 -z-10 ${
          isDark ? "bg-yellow-800" : "bg-yellow-100"
        }`}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2
            className={`text-3xl md:text-5xl font-bold leading-snug ${
              isDark ? "text-foreground" : "text-gray-900"
            }`}
          >
            The learning materials provided are{" "}
            <span className="relative inline-block">
              <span className="text-[#7b5cff] italic font-semibold relative z-10">
                enjoyable
              </span>
              <span className="absolute left-0 bottom-1 w-full h-3 bg-[#ffb22c] rounded-full -z-0 transform -rotate-2"></span>
            </span>{" "}
            <br /> for children
          </h2>

          <p
            className={`max-w-md mx-auto md:mx-0 ${
              isDark ? "text-muted-foreground" : "text-gray-600"
            }`}
          >
            Don't worry! Your children will be having a fun time while learning
            with our materials that are easy to understand.
          </p>

          <a
            href="#learn-more"
            className={`inline-flex items-center gap-3 border border-[#7b5cff] text-[#7b5cff] px-6 py-3 rounded-full font-medium transition shadow-sm ${
              isDark ? "hover:bg-[#7b5cff]/20" : "hover:bg-[#f4f0ff]"
            }`}
          >
            <span>Learn more</span>
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight
                className="w-4 h-4 text-white transform rotate-[330deg]"
                strokeWidth={2.5}
              />
            </span>
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center relative transform transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02]">
          <img
            src={learningMaterial}
            alt="Children enjoying learning materials"
            className="w-full max-w-lg md:max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
