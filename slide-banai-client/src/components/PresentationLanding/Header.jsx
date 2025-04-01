import React from "react";

function Header() {
  return (
    <header className="flex flex-wrap gap-5 justify-between ml-11 w-full max-w-[1207px] max-md:max-w-full">
      <h1 className="self-start text-3xl">Slide Banai</h1>
      <div className="flex gap-7">
        <div className="flex flex-auto gap-3 items-center">
          <div className="flex gap-8 self-stretch py-2 pr-2.5 pl-8 bg-white rounded-2xl max-md:pl-5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/1e8b4edfdafeaeacfb35a36422b8da3363ae38ef?placeholderIfAbsent=true"
              alt="Notification icon"
              className="object-contain shrink-0 w-6 aspect-square"
            />
            <img
              src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/bf04ada5bd03fe8d9112647d33a4636b24321cda?placeholderIfAbsent=true"
              alt="Settings icon"
              className="object-contain shrink-0 w-6 aspect-square"
            />
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/4ae148c3692bb0e9c7918ed5f3c56a45df9974a7?placeholderIfAbsent=true"
            alt="Divider"
            className="object-contain shrink-0 self-stretch my-auto aspect-[1.89] w-[17px]"
          />
          <span className="self-stretch my-auto text-xs font-semibold tracking-wider uppercase text-neutral-800">
            Esther Howard
          </span>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c31b94cef01f43a1b57944b9708534d9/3dbc83ae6e7f2ebf15154335ce4fd3edbf3bf42a?placeholderIfAbsent=true"
          alt="User profile"
          className="object-contain shrink-0 my-auto w-7 rounded-xl aspect-[1.12]"
        />
      </div>
    </header>
  );
}

export default Header;
