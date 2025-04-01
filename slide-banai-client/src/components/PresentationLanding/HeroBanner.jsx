
function HeroBanner() {
  return (
    <section className="overflow-hidden mt-5 text-6xl text-white rounded-md bg-zinc-300 shadow-[-6px_-6px_12px_rgba(188,166,253,0.25)] tracking-[4.16px] max-md:mr-1.5 max-md:max-w-full max-md:text-4xl">
      <div className="flex relative flex-col w-full min-h-[197px] max-md:max-w-full max-md:text-4xl">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/29ff5409458a87a26935ab42c74452dc2699da9c?placeholderIfAbsent=true"
          alt="Presentation background"
          className="object-cover absolute inset-0 size-full"
        />
        <h2 className="text-center text-7xl secondary-font font-extrabold relative px-12 py-20 rounded-md bg-violet-500 bg-opacity-80 max-md:px-5 max-md:max-w-full max-md:text-4xl">
          Start Your Presentation
        </h2>
      </div>
    </section>
  );
}

export default HeroBanner;
