/**
 * Home Page (Legacy Wrapper)
 * 
 * Purpose: Backward compatibility wrapper that re-exports the actual HomePage
 *          component from the new feature module structure.
 * 
 * Why this file exists: Allows existing code and routes to import from
 *                       @/pages/home/Home without breaking changes.
 * 
 * The actual implementation lives in: @/features/home/pages/HomePage
 * 
 * Structure: src/features/home/
 *   - pages/HomePage.jsx (main page component)
 *   - sections/ (reusable page sections)
 *     - HeroSection.jsx
 *     - TopCompanies.jsx
 *     - HighlightReview.jsx
 *     - CallToAction.jsx
 */

import HomePage from "@/features/home/pages/HomePage";

export default HomePage;
