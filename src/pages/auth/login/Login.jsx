/**
 * Login Page (Legacy Wrapper)
 * 
 * Purpose: Backward compatibility wrapper that re-exports the actual LoginPage
 *          component from the new feature module structure.
 * 
 * Why this file exists: Allows existing code and routes to import from
 *                       @/pages/auth/login/Login without breaking changes.
 * 
 * The actual implementation lives in: @/features/auth/login/pages/LoginPage
 * 
 * Structure: src/features/auth/login/
 *   - pages/LoginPage.jsx (main container)
 *   - components/LoginForm.jsx (form UI)
 *   - hooks/useLoginForm.js (form logic)
 */

import LoginPage from "@/features/auth/login/pages/LoginPage";

export default LoginPage;
