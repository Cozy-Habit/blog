"use client";

import Link from "next/link";
import { useRef } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const drawerRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrawerToggle = () => {
    if (drawerRef && drawerRef.current) {
      drawerRef.current.checked = !drawerRef.current.checked;
    }
    if (inputRef && inputRef.current) {
      inputRef.current.checked = !inputRef.current.checked;
    }
  };

  return (
    <div>
      <div
        className="navbar bg-base-100 shadow-sm justify-between pl-4 pr-4 sticky top-0 z-2"
      >
        <div className="justify-between w-full">
          <div className="flex gap-4 items-center">
            <div className="avatar">
              <div className="w-12 rounded-xl">
                <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp" />
              </div>
            </div>
            <div className="avatar">
              <div className="w-12 rounded-xl">
                <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="btn btn-ghost text-xl">
                <Link href="/">Blog</Link>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="btn btn-ghost text-xl">
                <Link href="/timeline">Timeline</Link>
              </div>
            </div>
            {/* <div className="hidden sm:block">
              <NavbarItem className="btn btn-ghost text-xl">
                <Link href="https://cozy-habit.github.io/">Portfolio</Link>
              </NavbarItem>
            </div> */}
          </div>
          <div className="sm:hidden">
            <label
              htmlFor="my-drawer"
              className="btn btn-circle swap swap-rotate"
            >
              <input
                ref={inputRef}
                id="my-drawer"
                type="checkbox"
                onChange={() => {
                  if (drawerRef && drawerRef.current) {
                    drawerRef.current.checked = !drawerRef.current.checked;
                  }
                }}
              />
              <svg
                className="swap-off fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
              </svg>
              <svg
                className="swap-on fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
              >
                <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
              </svg>
            </label>
          </div>
        </div>
      </div>

      <div className="drawer z-2">
        <input type="checkbox" className="drawer-toggle" ref={drawerRef} />
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <nav className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <Link
              href="/"
              onClick={handleDrawerToggle}
              className="btn btn-ghost text-xl"
            >
              Blog
            </Link>
            <Link
              href="/timeline"
              onClick={handleDrawerToggle}
              className="btn btn-ghost text-xl"
            >
              Timeline
            </Link>
            {/* <Link
              href="https://cozy-habit.github.io/"
              onClick={handleDrawerToggle}
              className="btn btn-ghost text-xl"
            >
              Portfolio
            </Link> */}
          </nav>
        </div>
      </div>
      <main
        className="dark text-foreground bg-background flex justify-center"
        style={{ backgroundImage: 'url("./nnnoise.svg")' }}
      >
        {children}
      </main>
    </div>
  );
}
