import React from "react";

function HeroBanner() {
  return (
    <section className="">
      <div className="flex items-center justify-center relative flex-col w-full min-h-[197px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/29ff5409458a87a26935ab42c74452dc2699da9c?placeholderIfAbsent=true"
          alt="Presentation background"
          className="object-cover absolute size-full blur-xs"
        />
        <h2 className="secondary-font font-extrabold text-6xl text-white relative px-12 rounded-md">
          Start Your Presentation
        </h2>
      </div>
    </section>
  );
}

export default HeroBanner;
