"use client";
import React from "react";
import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/slide-make-lottie.json';

const ContentSection=()=> {

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };


  return (
    <section className="">
      <div className="flex gap-5">
        <div className="">
          <div className="">
            <h2 className="subtitle text-4xl font-bold">
              Create stunning presentations faster with AI
            </h2>
            <p className="">
              Go from idea to slides in seconds with AI and free templates for
              your academics work.
            </p>
            <ActionButtons />
          </div>
        </div>
        <div>
          <Lottie options={defaultOptions}/>
        </div>
      </div>
    </section>
  );
}

function ActionButtons() {
  return (
    <>
      <button className="px-16 py-6 mt-32 max-w-full text-white bg-violet-500 rounded-xl shadow-[-6px_-6px_12px_rgba(255,255,255,0.7)] w-[540px] max-md:px-5 max-md:mt-10">
        Make a presentaion
      </button>
      <button className="px-16 py-6 mt-4 max-w-full text-black bg-gray-200 rounded-xl border-violet-500 border-solid border-[3px] shadow-[-6px_-6px_12px_rgba(255,255,255,0.7)] w-[540px] max-md:px-5">
        Upgrade to Pro{" "}
      </button>
    </>
  );
}

export default ContentSection;
