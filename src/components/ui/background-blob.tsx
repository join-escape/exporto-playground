"use client";

import React from "react";

export function BackgroundBlob() {
  return (
    <div className="fixed right-0 top-0 bottom-0 pointer-events-none z-[-1] w-1/2 overflow-hidden">
      <div
        className="absolute right-[-15vw] top-[20vh] w-[50vw] h-[50vw] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.7) 0%, rgba(37,99,235,0.4) 50%, rgba(29,78,216,0) 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute right-[-5vw] bottom-[10vh] w-[30vw] h-[30vw] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(96,165,250,0.6) 0%, rgba(59,130,246,0.3) 50%, rgba(37,99,235,0) 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
