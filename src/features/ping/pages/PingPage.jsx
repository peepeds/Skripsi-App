/**
 * Ping Page
 * 
 * Purpose: Development/debugging page to test backend connectivity
 * 
 * Features:
 *   - Sends a ping request to the backend server
 *   - Displays loading state while waiting for response
 *   - Shows success/error messages using toast notifications
 *   - Displays the server response message
 * 
 * Usage: Navigate to /ping to test if the backend is running
 */
import { useContext, useState } from "react";
import { pingServer } from "@/api/pingApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/context/userContext";

export function PingPage() {
  // State: Track if ping is in progress
  const [loading, setLoading] = useState(false);
  
  // State: Store the server response
  const [result, setResult] = useState(null);
  
  // Context: Get current user info
  const { user } = useContext(UserContext);

  /**
   * Sends a ping request to the backend
   * Steps:
   * 1. Set loading to true (show "Pinging..." text)
   * 2. Call pingServer API
   * 3. Store the response data
   * 4. Show toast notification (success or error)
   * 5. Set loading to false (button becomes clickable again)
   */
  const handlePing = async () => {
    setLoading(true);
    try {
      const res = await pingServer();
      const data = res.data;
      setResult(data);

      // Show appropriate message
      if (data.success) {
        toast.success(data.message || "Pong!");
      } else {
        toast.error(data.message || "Failed to ping backend");
      }
    } finally {
      // Stop loading (happens whether request succeeded or failed)
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Ping Backend</h1>

      {/* Ping Button */}
      <Button
        onClick={handlePing}
        className="w-full max-w-xs"
        disabled={loading} // Disabled while pinging
      >
        {loading ? "Pinging..." : "Ping Server"}
      </Button>

      {/* Display response message if we got one */}
      {result && (
        <p className="mt-4 text-green-700 font-medium">
          {result.message}
        </p>
      )}
    </div>
  );
}