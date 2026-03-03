/**
 * Register Page (Legacy Wrapper)
 * 
 * Purpose: Backward compatibility wrapper that re-exports the actual RegisterPage
 *          component from the new feature module structure.
 * 
 * Why this file exists: Allows existing code and routes to import from
 *                       @/pages/auth/register/Register without breaking changes.
 * 
 * The actual implementation lives in: @/features/auth/register/pages/RegisterPage
 * 
 * Structure: src/features/auth/register/
 *   - pages/RegisterPage.jsx (main container)
 *   - hooks/useRegisterWizard.js (wizard logic & validation)
 *   - Step components (StepAccount, StepPersonal, StepAcademic)
 */

import RegisterPage from "@/features/auth/register/pages/RegisterPage";

export default RegisterPage;