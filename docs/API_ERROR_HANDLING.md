# API Error Handling Guidelines

**Version:** 1.0  
**Last Updated:** March 2026  
**Author:** Development Team

## Table of Contents

1. [Overview](#overview)
2. [API Response Contract](#api-response-contract)
3. [Error Handling Patterns](#error-handling-patterns)
4. [Utilities & Helpers](#utilities--helpers)
5. [Implementation Examples](#implementation-examples)
6. [Common Pitfalls](#common-pitfalls)
7. [Testing Error Scenarios](#testing-error-scenarios)

---

## Overview

This guide describes standardized error handling patterns for all API calls in the Skripsi App. Error handling is **consistent**, **predictable**, and **user-friendly** following the BASELINE.md API Response Contract.

**Key Principles:**
- ✅ All API responses follow standard format: `{ success, message, result }`
- ✅ Error messages are clear and actionable (from backend via API contract)
- ✅ Error handling happens in **hooks/components**, NOT in API functions
- ✅ Use provided utilities from `@/helpers/apiUtils` for consistency
- ✅ Never suppress errors silently - always log and communicate to user

---

## API Response Contract

All successful and failed API responses follow this contract:

```json
{
  "success": boolean,      // Always present. true = success, false = error
  "message": string,       // Always present. Clear, human-readable message
  "result": any            // Optional. Data payload only on success (200/201)
}
```

### HTTP Status Codes

| Status | Use | success | Example |
|--------|-----|---------|---------|
| 200 | GET, PATCH, PUT success | `true` | Fetch data, update profile |
| 201 | POST success (created) | `true` | Register user |
| 204 | No content (DELETE) | `true` | Delete resource |
| 400 | Validation error | `false` | Invalid email |
| 401 | Unauthorized | `false` | Token expired |
| 403 | Forbidden | `false` | Insufficient permissions |
| 404 | Not found | `false` | Resource ID doesn't exist |
| 409 | Conflict | `false` | Email already registered |
| 500 | Server error | `false` | Database error |

### Success Response Example

```json
{
  "success": true,
  "message": "Companies retrieved successfully",
  "result": {
    "data": [
      { "id": 1, "name": "Tech Corp", "rating": 4.5 }
    ],
    "pagination": { "page": 0, "size": 15, "total": 42 }
  }
}
```

### Error Response Example

```json
{
  "success": false,
  "message": "Email already registered. Please login or use a different email."
}
```

---

## Error Handling Patterns

### Pattern 1: In Custom Hooks (Most Common)

Use this pattern in hooks that call API functions:

```jsx
import { useState, useEffect } from "react";
import { getCompanies } from "@/api/companyApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

export const useCompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCompanies();

        // IMPORTANT: Use handleApiResponse to validate and extract data
        const { success, message, data } = handleApiResponse(response);

        if (!success) {
          // API returned false success - use API message
          setError(message);
          return;
        }

        // Safe extraction of data
        setCompanies(data || []);
      } catch (err) {
        // Network/axios error - normalize message
        const errorMessage = normalizeErrorMessage(err, "Failed to load companies");
        console.error("Error fetching companies:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { companies, loading, error };
};
```

**Key Points:**
- ✅ Call `handleApiResponse()` to validate response structure
- ✅ Check `success` field to determine if request succeeded
- ✅ Use API's `message` directly in error state
- ✅ Use `normalizeErrorMessage()` for network errors (in catch block)
- ✅ Always initialize `error` state to `null` before request
- ✅ Always extract `data` safely with `data || fallback`

### Pattern 2: In Components (With UI Feedback)

Use this pattern in components/forms that need user feedback:

```jsx
import { toast } from "sonner";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await login(credentials);

      const { success, message, data } = handleApiResponse(response);

      if (!success) {
        // API error - show to user
        toast.error(message);
        return;
      }

      // Success - store token and proceed
      localStorage.setItem("token", data?.accessToken);
      toast.success(message || "Login successful");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = normalizeErrorMessage(err, "Login failed");
      toast.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleLogin}>...</form>;
}
```

### Pattern 3: For Actions (Approve/Reject/Delete)

Use this pattern for action handlers:

```jsx
const handleApprove = async (requestId, reviewNote) => {
  setIsProcessing(true);

  try {
    const response = await approveCompanyRequest(requestId, reviewNote);

    const { success, message } = handleApiResponse(response);

    if (!success) {
      toast.error(message);
      return; // Early exit, don't proceed
    }

    // Action succeeded
    toast.success(message || "Request approved successfully");
    await refreshData(); // Refresh after successful action
  } catch (err) {
    const errorMessage = normalizeErrorMessage(err, "Failed to approve request");
    toast.error(errorMessage);
    console.error("Approve error:", err);
  } finally {
    setIsProcessing(false);
  }
};
```

---

## Utilities & Helpers

### Available Utilities

All utilities are in `/src/helpers/apiUtils.js`. Import with:

```javascript
import {
  handleApiResponse,
  normalizeErrorMessage,
  validateApiResponse,
  getErrorStatusCode,
  isAuthError,
  isValidationError,
  isServerError,
} from "@/helpers/apiUtils";
```

### `handleApiResponse(response)`

Validates API response and extracts data safely.

**Returns:** `{ success, message, data }`

```javascript
const response = await getCompanies();
const { success, message, data } = handleApiResponse(response);

if (!success) {
  console.error(message); // Use API message
}
```

### `normalizeErrorMessage(error, fallback)`

Extracts error message from various error types.

**Returns:** `string` (error message)

```javascript
try {
  await apiCall();
} catch (err) {
  const msg = normalizeErrorMessage(err, "Something went wrong");
  toast.error(msg);
}
```

### `getErrorStatusCode(error)`

Extracts HTTP status code from error.

**Returns:** `number | null`

```javascript
if (getErrorStatusCode(error) === 401) {
  // Handle unauthorized
}
```

### `isAuthError(error)`

Check if error is 401 Unauthorized.

```javascript
if (isAuthError(error)) {
  // Redirect to login
}
```

### `isValidationError(error)`

Check if error is 400 Bad Request (validation).

```javascript
if (isValidationError(error)) {
  // Show field-specific errors
}
```

### `isServerError(error)`

Check if error is 5xx Server Error.

```javascript
if (isServerError(error)) {
  toast.error("Server error. Please try again later.");
}
```

### `validateApiResponse(response)`

Low-level validation of response structure.

**Returns:** `{ isValid, message, data }`

```javascript
const validation = validateApiResponse(response);
if (!validation.isValid) {
  console.error("Invalid response format:", validation.message);
}
```

---

## Implementation Examples

### Example 1: Fetching List with Pagination

**File:** `/src/features/companies/hooks/useCompanies.js`

```javascript
import { useState, useEffect, useCallback } from "react";
import { getCompanies } from "@/api/companyApi";
import { handleApiResponse, normalizeErrorMessage } from "@/helpers/apiUtils";

export const useCompanies = (page = 0) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async (pageNum) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCompanies(pageNum, 15);

      const { success, message, data } = handleApiResponse(response);

      if (!success) {
        setError(message);
        setCompanies([]);
        return;
      }

      // data has shape: { data: [...], pagination: {...} }
      setCompanies(data?.data || []);
    } catch (err) {
      const errorMessage = normalizeErrorMessage(err, "Failed to fetch companies");
      console.error("Error:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies(page);
  }, [page, fetchCompanies]);

  return { companies, loading, error };
};
```

### Example 2: Form Submission with Validation

**File:** `/src/features/auth/login/hooks/useLoginForm.js`

```javascript
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { login } from "@/api/authApi";
import { handleApiResponse, normalizeErrorMessage, isValidationError } from "@/helpers/apiUtils";

export const useLoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (payload) => {
    try {
      const response = await login(payload);

      const { success, message, data } = handleApiResponse(response);

      if (!success) {
        if (isValidationError(response)) {
          toast.error(`Validation: ${message}`);
        } else {
          toast.error(message);
        }
        return;
      }

      // Store token
      localStorage.setItem("accessToken", data?.accessToken);
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      const errorMessage = normalizeErrorMessage(err, "Login failed");
      toast.error(errorMessage);
    }
  };

  return { form, onSubmit };
};
```

### Example 3: Action Handler (Approve/Reject)

**File:** `/src/features/inbox/components/RequestActions.jsx`

```javascript
import { approveCompanyRequest } from "@/api/companyApi";
import { handleApiResponse, normalizeErrorMessage, isAuthError } from "@/helpers/apiUtils";
import { toast } from "sonner";

export function RequestActions({ requestId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (reviewNote) => {
    setIsProcessing(true);

    try {
      const response = await approveCompanyRequest(requestId, reviewNote);

      const { success, message } = handleApiResponse(response);

      if (!success) {
        if (isAuthError(response)) {
          toast.error("Your session has expired. Please login again.");
          // Hook into global auth state to logout
          return;
        }
        toast.error(message);
        return;
      }

      toast.success(message || "Request approved successfully");
      // Refresh request list or details
      await onRefresh();
    } catch (err) {
      const errorMessage = normalizeErrorMessage(err, "Failed to approve request");
      toast.error(errorMessage);
      console.error("Approve error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button onClick={() => handleApprove("Looks good")} disabled={isProcessing}>
      Approve
    </button>
  );
}
```

---

## Common Pitfalls

### ❌ Pitfall 1: Accessing `response.data` twice

```javascript
// WRONG - response is already the data!
const response = await getCompanies();
const companies = response.data.result; // Double .data!
```

✅ **Correct:**
```javascript
const response = await getCompanies();
const { success, message, data } = handleApiResponse(response);
// data is already extracted
```

### ❌ Pitfall 2: Not checking `success` field

```javascript
// WRONG - ignoring success field
const response = await getCompanies();
const companies = response.result; // Might be undefined if success=false!
```

✅ **Correct:**
```javascript
const { success, message, data } = handleApiResponse(response);
if (!success) {
  setError(message);
  return;
}
// Now safe to use data
```

### ❌ Pitfall 3: Using message from catch block without context

```javascript
// WRONG - generic error message
catch (err) {
  toast.error("Error"); // Not helpful
}
```

✅ **Correct:**
```javascript
catch (err) {
  const errorMessage = normalizeErrorMessage(err, "Failed to load companies");
  toast.error(errorMessage); // Clear context
}
```

### ❌ Pitfall 4: Not using early exit on error

```javascript
// WRONG - continues execution even on error
const response = await updateProfile(data);
if (!response.success) {
  toast.error(response.message);
}
localStorage.setItem("profile", JSON.stringify(response.result)); // Might crash!
```

✅ **Correct:**
```javascript
const { success, message, data } = handleApiResponse(response);
if (!success) {
  toast.error(message);
  return; // Exit early
}
localStorage.setItem("profile", JSON.stringify(data)); // Safe
```

### ❌ Pitfall 5: Silencing errors in catch

```javascript
// WRONG - silent failure
catch (err) {
  console.log("ignored"); // Not useful for debugging
}
```

✅ **Correct:**
```javascript
catch (err) {
  const errorMessage = normalizeErrorMessage(err, "Unknown error");
  console.error("API call failed:", err); // Log for debugging
  toast.error(errorMessage); // Inform user
}
```

---

## Testing Error Scenarios

### Test Setup

When testing error handling, ensure you test these scenarios:

```javascript
describe("useCompanies", () => {
  // Test: API returns success=true
  it("should set companies on success", async () => {
    mockGetCompanies.mockResolvedValue({
      success: true,
      message: "Success",
      result: [{ id: 1, name: "Company" }]
    });
    // Assert companies are set
  });

  // Test: API returns success=false
  it("should set error when API returns failure", async () => {
    mockGetCompanies.mockResolvedValue({
      success: false,
      message: "Validation failed: Invalid page number"
    });
    // Assert error message is set
  });

  // Test: Network error
  it("should handle network errors", async () => {
    mockGetCompanies.mockRejectedValue(
      new Error("Network timeout")
    );
    // Assert error is captured
  });

  // Test: 401 Unauthorized
  it("should handle 401 errors", async () => {
    const error = new Error("Unauthorized");
    error.response = { status: 401, data: { message: "Token expired" } };
    mockGetCompanies.mockRejectedValue(error);
    // Assert isAuthError(error) is true
  });

  // Test: 400 Validation Error
  it("should handle validation errors", async () => {
    const error = new Error("Bad Request");
    error.response = { status: 400, data: { message: "Invalid email" } };
    mockGetCompanies.mockRejectedValue(error);
    // Assert isValidationError(error) is true
  });
});
```

---

## Checklist for New API Calls

When implementing a new API call, ensure:

- [ ] API file exports function with proper JSDoc
- [ ] Function returns `response.data` (follows contract)
- [ ] Hook/component calls with `handleApiResponse()`
- [ ] Error handling uses `normalizeErrorMessage()`
- [ ] Success/failure paths use early exit pattern
- [ ] Error messages shown to user via toast
- [ ] Sensitive errors logged to console (not shown to user)
- [ ] Tests cover success, `success=false`, and error scenarios
- [ ] TypeScript types added (if using TypeScript)
- [ ] Documentation updated in FEATURES.md

---

## Related Documentation

- [BASELINE.md](./BASELINE.md) - Overall architecture and patterns
- [API Response Contract](./BASELINE.md#10-api-response-contract) - Response format specification
- [src/helpers/apiUtils.js](../src/helpers/apiUtils.js) - Utilities source code
- [FEATURES.md](./FEATURES.md) - Feature-specific documentation
