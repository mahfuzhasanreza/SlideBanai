import React from "react";

function Sidebar() {
  return (
    <nav className="flex flex-col my-auto max-md:hidden">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/c2488ab46642709aab8cb773f39f74a4a3c4ffb7?placeholderIfAbsent=true"
        alt="Navigation icon"
        className="object-contain self-center w-8 aspect-square"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/989d3ac3-74e2-445f-8aea-486a9e04708a?placeholderIfAbsent=true"
        alt="App icon"
        className="object-contain mt-7 w-14 h-14 bg-gray-200 rounded-xl aspect-[0.98] shadow-[-6px_-6px_12px_rgba(255,255,255,0.7)]"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/27a1db9ddd1c3e65bda741624b9256eb9be0ed67?placeholderIfAbsent=true"
        alt="Navigation icon"
        className="object-contain self-center mt-36 w-8 aspect-square max-md:mt-10"
      />
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/d1e186aa-06d0-4458-95d0-b5b58f78f66e?placeholderIfAbsent=true"
        alt="Navigation icon"
        className="object-contain bg-gray-200 rounded-xl aspect-[0.93] mt-[629px] shadow-[-6px_-6px_12px_rgba(255,255,255,0.7)] w-[42px] max-md:mt-10 max-md:ml-0.5"
      />
    </nav>
  );
}

export default Sidebar;
