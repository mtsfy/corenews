import Link from "next/link";
import Logo from "../logo";

import * as React from "react";

import { IoDocumentTextSharp } from "react-icons/io5";
import { GrDocumentStore } from "react-icons/gr";
import { BiFileFind } from "react-icons/bi";
import { IoMdPerson } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-[80vh] flex flex-col items-center justify-center w-full gap-6">
        <Logo className="text-6xl font-semibold text-sky-600" />
        <h1 className="font-bold text-3xl">Your News, Your Perspective, Simplified.</h1>
        <p className="font-medium text-neutral-500 text-2xl text-wrap w-2/5 text-center">
          Get contextual summaries, aggregated insights, and unbiased analysis—all tailored to your interests.
        </p>
        <div>
          <Link href="/login">
            <button className="text-lg rounded-2xl px-6 py-2 bg-sky-600 hover:opacity-80 transition text-white font-medium">Start Exploring</button>
          </Link>
        </div>
      </div>
      <div className="h-[85vh] flex w-full pt-44 pb-12">
        <div className="mx-60 p-10 py-12 bg-white border-[1px] rounded-xl w-full flex flex-col gap-12">
          <div>
            <h1 className="text-3xl font-semibold">
              Explore Our <br />
              Awesome <span className="underline decoration-sky-500">Features</span>
            </h1>
          </div>
          <div className="flex gap-8 mt-12">
            <div className="w-[300px] h-[300px] border-[1px] border-sky-500 rounded-xl p-8 flex flex-col justify-evenly">
              <IoDocumentTextSharp size={30} className="text-sky-600" />
              <h1 className="mt-4 text-lg font-semibold text-neutral-700">Contextual Summaries</h1>
              <p className="text-neutral-500 font-light">
                No time to read? We summarize complex articles into easy-to-digest insights, giving you the full picture without the overload.
              </p>
              <div className="">
                <Link href={"/login"}>
                  <FaArrowAltCircleRight size={30} className="text-sky-600" />
                </Link>
              </div>
            </div>
            <div className="w-[300px] h-[300px] border-[1px] border-sky-500 rounded-xl p-8 flex flex-col justify-evenly">
              <GrDocumentStore size={30} className="text-sky-600" />
              <h1 className="mt-4 text-lg font-semibold text-neutral-700">News Aggregation</h1>
              <p className="text-neutral-500 font-light">
                Access the latest stories from trusted sources, all in one place. No need to jump between tabs.
              </p>
              <div className="">
                <Link href={"/login"}>
                  <FaArrowAltCircleRight size={30} className="text-sky-600" />
                </Link>
              </div>
            </div>
            <div className="w-[300px] h-[300px] border-[1px] border-sky-500  rounded-xl p-8 flex flex-col justify-evenly">
              <IoMdPerson size={30} className="text-sky-600" />
              <h1 className="mt-4 text-lg font-semibold text-neutral-700">Personalized Feed</h1>
              <p className="text-neutral-500 font-light">Your news, your way. Tailored to your interests, preferences, and regions.</p>
              <div className="">
                <Link href={"/login"}>
                  <FaArrowAltCircleRight size={30} className="text-sky-600" />
                </Link>
              </div>
            </div>
            <div className="w-[300px] h-[300px] border-[1px] border-sky-500  rounded-xl p-8 flex flex-col justify-evenly">
              <BiFileFind size={30} className="text-sky-600" />
              <h1 className="mt-4 text-lg font-semibold text-neutral-700">Bias Detection</h1>
              <p className="text-neutral-500 font-light">
                Stay informed from every angle. Know if a story leans conservative, liberal, or stays neutral.
              </p>
              <div className="">
                <Link href={"/login"}>
                  <FaArrowAltCircleRight size={30} className="text-sky-600" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Landing;
