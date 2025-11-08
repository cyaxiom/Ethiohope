import React from "react";
import { ArrowRight } from "lucide-react";
import learningMaterial from "../assets/images/learning-material.png";

export default function LearningMaterials() {
  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-white">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold leading-snug text-gray-900">
            The learning materials provided are{" "}
            <span className="relative inline-block">
              <span className="text-[#7b5cff] italic font-semibold relative z-10">
                enjoyable
              </span>
              <span className="absolute left-0 bottom-1 w-full h-3 bg-[#ffb22c] rounded-full -z-0 transform -rotate-2"></span>
            </span>{" "}
            <br /> for children
          </h2>

          <p className="text-gray-600 max-w-md mx-auto md:mx-0">
            Don’t worry! Your children will be having a fun time while learning
            with our materials that are easy to understand.
          </p>

          <a
            href="#learn-more"
            className="inline-flex items-center gap-3 border border-[#7b5cff] text-[#7b5cff] hover:bg-[#f4f0ff] px-6 py-3 rounded-full font-medium transition shadow-sm"
          >
            <span>Learn more</span>
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#7b5cff]">
              <ArrowRight className="w-4 h-4 text-white transform rotate-[330deg]" strokeWidth={2.5} />
            </span>
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
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
