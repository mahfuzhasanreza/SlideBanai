"use client";
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HeroBanner from "./HeroBanner";
import ContentSection from "./ContentSection";
import './PresentationLanding.css';

function PresentationLanding() {
  return (
    <main className="flex overflow-hidden flex-wrap gap-3.5 px-4">
      <Sidebar />
      <div className="flex flex-wrap flex-auto gap-1.5">
        <div className="shrink-0 self-start w-0 border-2 border-solid border-purple-300 border-opacity-50 h-[1024px] shadow-[0px_4px_4px_rgba(209,193,255,0.25)]" />
        <section className="overflow-hidden grow shrink-0 px-9 pt-5 mt-4 bg-white rounded-3xl basis-0 shadow-[-6px_-6px_12px_rgba(188,166,253,0.25)] w-fit max-md:px-5 max-md:max-w-full">
          <Header />
          <HeroBanner />
          <ContentSection />
        </section>
      </div>
    </main>
  );
}

export default PresentationLanding;
