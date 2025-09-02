import Image from "next/image";
import { LuCalendar } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { LuTrophy } from "react-icons/lu";

import { IoMailOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";



export default function Home() {

  const rules = [
    "Teams must consist of 2-4 members",
    "All code must be original and created during the event",
    "Use of external APIs and libraries is allowed",
    "Projects must be submitted before the deadline",
    "Teams must present their solutions to judges",
    "Respect fellow participants and maintain fair play",
    "No pre-built solutions or existing projects",
    "Follow the college's code of conduct at all times",
  ];

  return (
    <div className="">
      <div className="playfair-display text-[0.95rem] h-[12vh] flex flex-col justify-center items-center">
        <h1 className="text-[#5D829E]">Department of Information Technology</h1>
        <h1 className="text-[#5D829E]">St. Joseph's College (Autonomous), Tiruchirappalli</h1>
      </div>
      <div className="h-[80vh] flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0f0f2d] text-center">
        <div>
          {/* Title */}
          <h1 className="playfair-display text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg">
            Hackathon 2025
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-gray-400 text-lg md:text-xl">
            Code. Create. Conquer in the Dark.
          </p>

          {/* Button */}
          <div className="mt-[3rem]">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
              Register Now
            </button>
          </div>
        </div>
      </div>

      <div className="my-[9rem] space-y-10">
        <h1 className="playfair-display text-4xl text-center font-semibold">About The Event</h1>
        <div className="flex items-center justify-center bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto bg-[#111] text-center p-8 rounded-2xl border border-purple-900/40 shadow-lg">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              We, the <span className="font-semibold">Department of Information Technology</span> at
              <span className="font-semibold"> St. Joseph&apos;s College</span>, are thrilled
              to announce our upcoming Hackathon.{" "}
              <span className="text-purple-400 font-semibold">Date: Coming Soon.</span>1
              Get ready for a night of innovation, collaboration, and creativity where
              brilliant minds converge to push the boundaries of technology.
            </p>
          </div>
        </div>
      </div>

      {/* Event Details  */}

      <div className="space-y-20">
        <h1 className="playfair-display text-4xl text-center font-semibold">Event Details</h1>
        <div className="flex items-center justify-center bg-[#0a0a0a]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full p-6">

            {/* Date */}
            <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg">
              <LuCalendar className="mx-auto mb-4 text-purple-400" size={40} />
              <h3 className="playfair-display text-lg font-semibold text-gray-200 mb-2">Date</h3>
              <p className="text-2xl font-bold text-purple-400">Coming Soon</p>
              <p className="text-sm text-gray-400 mt-1">Stay tuned for updates</p>
            </div>

            {/* Duration */}
            <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg">
              <FaRegClock className="mx-auto mb-4 text-purple-400" size={40} />
              <h3 className="playfair-display text-lg font-semibold text-gray-200 mb-2">Duration</h3>
              <p className="text-2xl font-bold text-purple-400">24 Hours</p>
              <p className="text-sm text-gray-400 mt-1">Non-stop coding</p>
            </div>

            {/* Venue */}
            <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg">
              <MdOutlineLocationOn className="mx-auto mb-4 text-purple-400" size={40} />
              <h3 className="playfair-display text-lg font-semibold text-gray-200 mb-2">Venue</h3>
              <p className="text-2xl font-bold text-purple-400">College Campus</p>
              <p className="text-sm text-gray-400 mt-1">St. Joseph&apos;s College</p>
            </div>

            {/* Team Size */}
            <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg">
              <LuUsers className="mx-auto mb-4 text-purple-400" size={40} />
              <h3 className="playfair-display text-lg font-semibold text-gray-200 mb-2">Team Size</h3>
              <p className="text-2xl font-bold text-purple-400">2-4 Members</p>
              <p className="text-sm text-gray-400 mt-1">Collaborate &amp; create</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section  */}
      <div className="my-[6rem]">
        <h1 className="playfair-display text-4xl text-center font-semibold">Prizes & Recognition</h1>
        <div className="flex items-center justify-center bg-[#0a0a0a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full p-6">

            {/* 1st Place */}
            <div className="bg-[#111] border border-yellow-600/50 rounded-2xl p-6 text-center shadow-lg">
              <LuTrophy className="mx-auto mb-4 text-purple-400" size={50} />
              <h3 className="text-lg font-semibold text-gray-200 mb-2">1st Place</h3>
              <p className="text-lg font-semibold text-purple-400">Grand Prize</p>
              <p className="text-2xl font-bold text-purple-200 mt-2">Coming Soon</p>
              <span className="mt-4 inline-block bg-[#1a1a1a] text-gray-200 text-sm px-4 py-1 rounded-full shadow-md border border-purple-900/30">
                Certificate Included
              </span>
            </div>

            {/* 2nd Place */}
            <div className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg">
              <LuTrophy className="mx-auto mb-4 text-purple-400" size={50} />
              <h3 className="text-lg font-semibold text-gray-200 mb-2">2nd Place</h3>
              <p className="text-lg font-semibold text-purple-400">Runner Up</p>
              <p className="text-2xl font-bold text-purple-200 mt-2">Coming Soon</p>
              <span className="mt-4 inline-block bg-[#1a1a1a] text-gray-200 text-sm px-4 py-1 rounded-full shadow-md border border-purple-900/30">
                Certificate Included
              </span>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#111] border border-orange-600/50 rounded-2xl p-6 text-center shadow-lg">
              <LuTrophy className="mx-auto mb-4 text-purple-400" size={50} />
              <h3 className="text-lg font-semibold text-gray-200 mb-2">3rd Place</h3>
              <p className="text-lg font-semibold text-purple-400">Third Place</p>
              <p className="text-2xl font-bold text-purple-200 mt-2">Coming Soon</p>
              <span className="mt-4 inline-block bg-[#1a1a1a] text-gray-200 text-sm px-4 py-1 rounded-full shadow-md border border-purple-900/30">
                Certificate Included
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Rules and reg  */}

      <div>
        <h1 className="playfair-display text-4xl text-center font-semibold">Rules & Guidelines</h1>

        <div className="bg-[#0a0a0a] flex flex-col sm:flex-row items-center justify-center px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-[#111] border border-purple-900/40 rounded-2xl p-4 shadow-md hover:shadow-purple-900/20 transition"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-purple-500 text-purple-400 font-semibold text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-200">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer  */}

      <div className="mt-[3rem]">
        <footer className="bg-[#0a0a0a] text-gray-300 py-10 border-t border-gray-700">
          <div className="max-w-6xl mx-auto px-6 gap-8 text-center md:text-left flex flex-col sm:flex-row justify-evenly">

            {/* Contact Info */}
            <div>
              <h3 className="playfair-display text-purple-400 font-semibold text-lg mb-4">
                Contact Information
              </h3>
              <p className="font-semibold flex items-center justify-center md:justify-start gap-2 mb-2">
                <IoMailOutline size={18} className="text-purple-400" />
                hackathon@jwstechnologies.com
              </p>
              <p className="font-semibold flex items-center justify-center md:justify-start gap-2">
                <BsTelephone size={18} className="text-purple-400" />
                +91 6385266784
              </p>
            </div>

            {/* Department Info */}
            <div>
              <h3 className="playfair-display text-purple-400 font-semibold text-lg mb-4">
                Department of IT
              </h3>
              <p>St. Joseph's College (Autonomous)</p>
              <p>Tiruchirappalli - 620 002</p>
              <p>Tamil Nadu, India</p>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
            © 2025 Department of Information Technology, St. Joseph&apos;s College. All rights reserved.
          </div>
        </footer>
      </div>

    </div>
  );
}
