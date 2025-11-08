import React from "react";
import joinCommunity from "../assets/images/join-community.png";

export default function JoinCommunitySection() {
  return (
    <section className="py-24 bg-[#7b5cff] text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 flex justify-center">
          <img
            src={joinCommunity}
            alt="Join WonderKids community"
            className="w-full max-w-sm md:max-w-md object-contain"
          />
        </div>

        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-snug">
            Join our <span className="text-[#ffb22c] italic font-semibold">WonderKids</span>{" "}
            community now
          </h2>

          <form className="space-y-4 mt-6">
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-5 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-5 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 rounded-full bg-[#ffb22c] hover:bg-[#e8a022] text-gray-900 font-semibold transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
