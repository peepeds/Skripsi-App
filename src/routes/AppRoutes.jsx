import React from "react";
import { suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./routesConfig";

export function AppRoutes() {
  return (
    <suspense fallback={<div>Loading...</div>}>
      <Routes>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </suspense>
  );
}
