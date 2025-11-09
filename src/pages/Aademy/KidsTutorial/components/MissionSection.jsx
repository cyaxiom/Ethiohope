// import React from "react";
// import { useTheme } from "@provider/ThemeProvider/ThemeProvider";
// import missionOne from "../assets/images/mission-one.png";
// import missionTwo from "../assets/images/mission-two.png";
// import missionThree from "../assets/images/mission-three.png";
// import missionFour from "../assets/images/mission-four.png";

// export default function MissionSection() {
//   const { isDark } = useTheme();

//   const missions = [
//     { name: "Kristin Watson", title: "Science Teacher", image: missionOne },
//     { name: "Jenny Wilson", title: "Drawing Teacher", image: missionTwo },
//     { name: "Jacob Jones", title: "Math Teacher", image: missionThree },
//     { name: "Savannah Nguyen", title: "Reading Teacher", image: missionFour },
//   ];

//   return (
//     <section
//       className={`relative py-24 text-center overflow-hidden ${
//         isDark ? "bg-[#7b5cff]/10 text-foreground" : "bg-[#7b5cff]/5 text-gray-900"
//       }`}
//     >
//       <div className="max-w-5xl mx-auto px-6 md:px-12">
//         <h2
//           className={`text-3xl md:text-5xl font-bold leading-snug ${
//             isDark ? "text-foreground" : "text-gray-900"
//           }`}
//         >
//           We aim to help children <br />
//           <span className="text-[#ffb22c] italic font-semibold">
//             discover the joy of creative
//           </span>{" "}
//           <br />
//           learning and grow into well-rounded individuals.
//         </h2>

//         <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
//           {missions.map((person, idx) => (
//             <div
//               key={idx}
//               className={`flex flex-col items-center rounded-3xl shadow-md p-6 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] ${
//                 isDark ? "bg-card border border-border" : "bg-white"
//               }`}
//             >
//               <img
//                 src={person.image}
//                 alt={person.name}
//                 className="w-28 h-28 object-contain mb-4"
//               />
//               <h3
//                 className={`text-lg font-semibold ${
//                   isDark ? "text-foreground" : "text-gray-800"
//                 }`}
//               >
//                 {person.name}
//               </h3>
//               <p
//                 className={`text-sm ${
//                   isDark ? "text-muted-foreground" : "text-gray-500"
//                 }`}
//               >
//                 {person.title}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@provider/ThemeProvider/ThemeProvider";

import missionOne from "../assets/images/mission-one.png";
import missionTwo from "../assets/images/mission-two.png";
import missionThree from "../assets/images/mission-three.png";
import missionFour from "../assets/images/mission-four.png";

export default function MissionSection() {
  const { isDark } = useTheme();

  const missions = [
    { name: "Kristin Watson", title: "Science Teacher", image: missionOne },
    { name: "Jenny Wilson", title: "Drawing Teacher", image: missionTwo },
    { name: "Jacob Jones", title: "Math Teacher", image: missionThree },
    { name: "Savannah Nguyen", title: "Reading Teacher", image: missionFour },
  ];

  return (
    <section
      className={`relative py-24 text-center overflow-hidden ${
        isDark ? "bg-[#7b5cff]/10 text-foreground" : "bg-[#7b5cff]/5 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <h2
          className={`text-3xl md:text-5xl font-bold leading-snug ${
            isDark ? "text-foreground" : "text-gray-900"
          }`}
        >
          We aim to help children <br />
          <span className="text-[#ffb22c] italic font-semibold">
            discover the joy of creative
          </span>{" "}
          <br />
          learning and grow into well-rounded individuals.
        </h2>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
          {missions.map((person, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-3xl shadow-md p-6 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] ${
                isDark ? "bg-card border border-border" : "bg-white"
              }`}
            >
              <motion.img
                src={person.image}
                alt={person.name}
                className="w-28 h-28 object-contain mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              />

              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-foreground" : "text-gray-800"
                }`}
              >
                {person.name}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-muted-foreground" : "text-gray-500"
                }`}
              >
                {person.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
