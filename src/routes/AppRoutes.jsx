import React from "react";
import { Routes, Route } from "react-router-dom";
import { appRoutes } from "./routesConfig";

export function AppRoutes() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
