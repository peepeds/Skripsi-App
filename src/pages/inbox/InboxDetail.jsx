/**
 * Inbox Detail Page (Legacy Wrapper)
 * 
 * Purpose: Backward compatibility wrapper that re-exports the actual InboxDetailPage
 *          component from the new feature module structure.
 * 
 * Why this file exists: Allows existing code and routes to import from
 *                       @/pages/inbox/InboxDetail without breaking changes.
 * 
 * The actual implementation lives in: @/features/inbox/pages/InboxDetailPage
 * 
 * Structure: src/features/inbox/
 *   - pages/InboxDetailPage.jsx (main container)
 *   - components/ (UI components)
 *   - hooks/ (business logic)
 *   - utils/ (helpers)
 */

import InboxDetailPage from "@/features/inbox/pages/InboxDetailPage";

export default InboxDetailPage;
