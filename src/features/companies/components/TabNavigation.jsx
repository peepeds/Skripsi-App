import React from "react";

/**
 * Reusable Tab Navigation Component
 * @param {Array} tabs - Array of tab objects { id, label }
 * @param {string} activeTab - Current active tab id
 * @param {Function} onTabChange - Callback when tab changes
 */
export const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
