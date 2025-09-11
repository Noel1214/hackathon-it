"use client";

import { useState, useEffect } from "react";
import { LuCalendar, LuUsers } from "react-icons/lu";
import { FaRegClock } from "react-icons/fa6";
import { MdOutlineLocationOn } from "react-icons/md";
import { IoMailOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [expired, setExpired] = useState(false);

  // Format numbers with zero padding (09 instead of 9)
  const formatTime = (num: number) => String(num).padStart(2, "0");

  useEffect(() => {
    const eventDate = new Date("2025-09-16T09:30:00");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(timer);
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rules = [
    "Teams must consist of 1-3 members",
    "Students must bring their laptop",
    "All code must be original and created during the event",
    "Use of external APIs and libraries is allowed",
    "Projects must be submitted before the deadline",
    "Teams must present their solutions to judges",
    "Respect fellow participants and maintain fair play",
    "No pre-built solutions or existing projects",
  ];

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="playfair-display text-[0.95rem] h-[12vh] flex flex-col justify-center items-center bg-black">
        <h1 className="text-[#5D829E]">Department of Information Technology</h1>
        <h1 className="text-[#5D829E]">
          St. Joseph&apos;s College (Autonomous), Tiruchirappalli
        </h1>
      </header>

      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0f0f2d] text-center px-4">
        {/* Countdown Timer */}
        {!expired ? (
          <>
            <div className="mt-10 flex justify-center gap-4 text-white">
              {["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => {
                const value =
                  idx === 0
                    ? timeLeft.days
                    : idx === 1
                      ? timeLeft.hours
                      : idx === 2
                        ? timeLeft.minutes
                        : timeLeft.seconds;

                return (
                  <div
                    key={label}
                    className="bg-[#111] mt-8 pl-2 pr-2 px-4 py-3 rounded-lg border border-purple-900/40 shadow-lg min-w-[80px]"
                  >
                    <motion.p
                      key={value}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-3xl font-bold text-purple-400"
                      aria-label={`${value} ${label}`}
                    >
                      {formatTime(value)}
                    </motion.p>
                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                  </div>
                );
              })}
            </div>
            <h2 className="mt-8 text-lg text-gray-300">
              Countdown to
            </h2>
          </>
        ) : (
          <p className="mt-10 text-2xl font-bold text-green-400">
            🎉 The Hackathon is Live!
          </p>
        )}

        {/* Hero Title */}
        <div>
          <h1 className="playfair-display text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg">
            Hackathon 2025
          </h1>
          <p className="mt-4 text-gray-400 text-lg md:text-xl">
            Code. Create. Conquer.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/registration">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                Register Now
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-[#222] hover:bg-purple-800/40 border border-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300">
                Team Leader Login
              </button>
            </Link>
          </div>

          <p className="playfair-display mt-3 mb-16 text-sm md:text-base text-center text-red-300 bg-red-900/20 px-4 py-2 rounded-lg border border-red-500/30 inline-block">
            Registration closes on <span className="font-semibold">13th September 2025</span>
          </p>

        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-[#0a0a0a]">
        <h1 className="playfair-display text-4xl text-center font-semibold mb-12">
          About The Event
        </h1>
        <div className="flex items-center justify-center">
          <div className="max-w-3xl mx-auto bg-[#111] text-center p-8 rounded-2xl border border-purple-900/40 shadow-lg">
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              We, the{" "}
              <span className="font-semibold">
                Department of Information Technology
              </span>{" "}
              at
              <span className="font-semibold"> St. Joseph&apos;s College</span>,
              are thrilled to announce our upcoming Hackathon.{" "}
              <span className="text-purple-400 font-semibold">
                Date: 16th September
              </span>{" "}
              Get ready for innovation, collaboration, and creativity where
              brilliant minds converge to push the boundaries of technology.
            </p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 bg-[#0f0f0f]">
        <h1 className="playfair-display text-4xl text-center font-semibold mb-12">
          Event Details
        </h1>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full p-6">
            {[
              {
                icon: (
                  <LuCalendar
                    size={40}
                    className="mx-auto mb-4 text-purple-400"
                  />
                ),
                title: "Date",
                main: "16th September",
                sub: "Starts 9:30 AM",
              },
              {
                icon: (
                  <FaRegClock
                    size={40}
                    className="mx-auto mb-4 text-purple-400"
                  />
                ),
                title: "Duration",
                main: "6 Hours",
                sub: "Non-stop coding",
              },
              {
                icon: (
                  <MdOutlineLocationOn
                    size={40}
                    className="mx-auto mb-4 text-purple-400"
                  />
                ),
                title: "Venue",
                main: "College Campus",
                sub: "St. Joseph's College",
              },
              {
                icon: (
                  <LuUsers size={40} className="mx-auto mb-4 text-purple-400" />
                ),
                title: "Team Size",
                main: "1-4 Members",
                sub: "Collaborate & create",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-purple-900/40 rounded-2xl p-6 text-center shadow-lg"
              >
                {item.icon}
                <h3 className="playfair-display text-lg font-semibold text-gray-200 mb-2">
                  {item.title}
                </h3>
                <p className="text-2xl font-bold text-purple-400">
                  {item.main}
                </p>
                <p className="text-sm text-gray-400 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-20 bg-[#0f0f0f]">
        <h1 className="playfair-display text-4xl text-center font-semibold mb-12">
          Rules & Guidelines
        </h1>
        <div className="flex items-center justify-center px-6">
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
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-300 py-12 border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center sm:text-left">
          <div>
            <h3 className="playfair-display text-purple-400 font-semibold text-lg mb-4">
              Contact Information
            </h3>
            <a
              className="font-semibold flex items-center justify-center sm:justify-start gap-2 mb-2"
              href="mailto:hackathon@jwstechnologies.com"
            >
              <IoMailOutline size={18} className="text-purple-400" />
              hackathon@jwstechnologies.com
            </a>
            <a
              className="font-semibold flex items-center justify-center sm:justify-start gap-2"
              href="tel:+916385266784"
            >
              <BsTelephone size={18} className="text-purple-400" />
              +91 63852 66784
            </a>
          </div>

          <div>
            <h3 className="playfair-display text-purple-400 font-semibold text-lg mb-4">
              Department of IT
            </h3>
            <p>St. Joseph&apos;s College (Autonomous)</p>
            <p>Tiruchirappalli - 620 002</p>
            <p>Tamil Nadu, India</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © 2025 Department of Information Technology, St. Joseph&apos;s
          College. All rights reserved.
          <br />
          <a href="https://jwstechnologies.com" target="_blank">
            JWS Technologies - Tech Support
          </a>
        </div>
      </footer>
    </div>
  );
}
