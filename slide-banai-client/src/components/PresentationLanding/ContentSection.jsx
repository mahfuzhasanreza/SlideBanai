"use client";
import React from "react";

function ContentSection() {
  return (
    <section className="mt-7 max-md:mr-1.5 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex z-10 flex-col items-start self-stretch my-auto mr-0 text-base font-medium tracking-wider max-md:mt-10 max-md:max-w-full">
            <h2 className="self-stretch text-4xl font-bold border border-solid border-violet-500 border-opacity-80 tracking-[2.43px] max-md:max-w-full">
              Create stunning presentations faster with AI
            </h2>
            <p className="mt-16 text-3xl font-semibold text-neutral-800 tracking-[1.97px] max-md:mt-10 max-md:max-w-full">
              Go from idea to slides in seconds with AI and free templates for
              your academics work.
            </p>
            <ActionButtons />
          </div>
        </div>
        <div className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/23fb3a881b4d030a39e0ff6bcb2af01f5ad41249?placeholderIfAbsent=true"
            alt="Presentation example"
            className="object-contain grow w-full aspect-square max-md:max-w-full"
          />
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
