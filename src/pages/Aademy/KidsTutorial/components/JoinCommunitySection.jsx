import React from "react";
import { motion } from "framer-motion";
import { DS } from "@/constants/designSystem";
import { SectionContainer } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import joinCommunity from "../assets/images/join-community.png";

export default function JoinCommunitySection() {
  return (
    <section className="bg-[#7b5cff] text-white relative overflow-hidden">
      <SectionContainer sectionSpacing="xl" containerSize="lg">
        <div className={`${DS.grids.twoColumn} ${DS.spacing.gap.xl} items-center`}>
          <div className="flex justify-center order-2 lg:order-1">
            <motion.img
              src={joinCommunity}
              alt="Join WonderKids community"
              className="w-full max-w-sm md:max-w-md object-contain"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          <div className="text-center lg:text-left space-y-6 order-1 lg:order-2">
            <Heading variant="h2" className="text-white leading-snug">
              Join our <span className="text-[#ffb22c] italic font-semibold">WonderKids</span>{" "}
              community now
            </Heading>

            <form className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-5 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb22c]"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-5 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb22c]"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full md:w-auto bg-[#ffb22c] hover:bg-[#e8a022] text-gray-900 border-none"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}
