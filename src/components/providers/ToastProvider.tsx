"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      theme="dark"
      autoClose={2500}
      newestOnTop
      pauseOnFocusLoss={false}
      pauseOnHover
      closeOnClick
      draggable
    />
  );
}
