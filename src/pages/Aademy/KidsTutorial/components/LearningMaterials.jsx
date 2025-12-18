import React from "react";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
import { DS } from "@/constants/designSystem";
import { SectionContainer } from "@/components/ui/Container";
import { Heading, Text } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import learningMaterial from "../assets/images/learning-material.png";

export default function LearningMaterials() {
  const { isDark } = useTheme();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative Blobs */}
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

      <SectionContainer sectionSpacing="xl" containerSize="lg">
        <div className={`${DS.grids.twoColumn} ${DS.spacing.gap.xl} items-center`}>
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
            <Heading variant="h2" className="leading-tight">
              The learning materials provided are{" "}
              <span className="relative inline-block">
                <span className="text-[#7b5cff] italic font-semibold relative z-10">
                  enjoyable
                </span>
                <span className="absolute left-0 bottom-1 w-full h-3 bg-[#ffb22c] rounded-full -z-0 transform -rotate-2"></span>
              </span>{" "}
              <br className="hidden sm:block" /> 
              for children
            </Heading>

            <Text size="lg" className="max-w-md mx-auto lg:mx-0 line-clamp-3">
              Don't worry! Your children will be having a fun time while learning
              with our materials that are easy to understand.
            </Text>

            <div className="flex justify-center lg:justify-start">
              <Button 
                variant="primary" 
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={() => window.location.href = '#learn-more'}
              >
                Learn more
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center relative order-1 lg:order-2 group">
            <img
              src={learningMaterial}
              alt="Children enjoying learning materials"
              className="w-full max-w-lg md:max-w-xl object-contain transition-transform duration-300 group-hover:-translate-y-3 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
