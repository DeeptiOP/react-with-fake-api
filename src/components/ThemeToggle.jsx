// filepath: c:\Users\deept\Downloads\fakestore-react-cart\client\src\components\ThemeToggle.jsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const stored = localStorage.getItem("theme");
      if (stored === null) {
        setIsDark(e.matches);
      }
    };
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  return (
    <button
      aria-label="Toggle dark mode"
      className="relative inline-flex h-9 w-16 items-center justify-between rounded-full bg-gray-200 dark:bg-gray-700 px-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
      onClick={() => setIsDark((prev) => !prev)}
    >
      <span className="text-yellow-500">☀️</span>
      <span className="text-blue-200">🌙</span>
      <span
        className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white dark:bg-gray-900 shadow transform transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}