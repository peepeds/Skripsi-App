import React from "react";

// Simple, reusable skeleton primitives using Tailwind classes
export function Skeleton({ className = "", style = {} }) {
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded ${className} animate-pulse`} style={style} />;
}

export function SkeletonLine({ className = "", width = "full", height = "h-4" }) {
  const widthClass = width === "full" ? "w-full" : width;
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded ${height} ${widthClass} ${className} animate-pulse`} />;
}

export function SkeletonCircle({ className = "", size = 10 }) {
  const px = `${size}px`;
  return <div className={`bg-gray-200 dark:bg-gray-700 rounded-full ${className} animate-pulse`} style={{ width: px, height: px }} />;
}

export default Skeleton;
