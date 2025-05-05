"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

const menuItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      for (const item of menuItems) {
        const section = document.querySelector(item.href);
        if (section) {
          const offsetTop =
            section.getBoundingClientRect().top + window.scrollY - 120;
          if (scrollY >= offsetTop) {
            setActive(item.href);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (href: string) => {
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActive(href);
      setMobileOpen(false);
    }
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-colors duration-300",
        isScrolled ? "bg-white dark:bg-gray-900 shadow" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <div className="text-xl font-bold text-black dark:text-white">Logo</div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-black dark:text-white text-2xl"
          >
            ☰
          </button>
        </div>

        <ul className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => handleClick(item.href)}
                className={clsx(
                  "text-base font-medium transition",
                  active === item.href
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 py-4 bg-white dark:bg-gray-900 shadow">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleClick(item.href)}
                  className={clsx(
                    "block w-full text-left text-base font-medium",
                    active === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
