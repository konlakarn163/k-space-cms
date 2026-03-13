"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const html = document.documentElement;

    const applyTheme = () => {
      setTheme(html.classList.contains("dark") ? "dark" : "light");
    };

    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <ToastContainer
      position="top-right"
      theme={theme}
      autoClose={2500}
      newestOnTop
      pauseOnFocusLoss={false}
      pauseOnHover
      closeOnClick
      draggable
    />
  );
}
