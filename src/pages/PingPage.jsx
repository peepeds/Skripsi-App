import React, { useState } from "react";
import { pingServer } from "@/api/pingApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

export default function PingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
      console.log("[Navbar] user from context:", user);
  }, [user]);

  const handlePing = async () => {
    setLoading(false);

    const res = await pingServer();
    const datas = res.data;
    setResult(datas);
    if (datas.success) {
      toast.success(datas.message || "Pong!");
    } else {
      toast.error(datas.message || "Failed to ping backend");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Ping Backend</h1>

      <Button
        onClick={handlePing}
        className="w-full max-w-xs"
        disabled={loading}
      >
        {loading ? "Pinging..." : "Ping Server"}
      </Button>

      {result && (
        <p className="mt-4 text-green-700 font-medium">
          {result.message}
        </p>
      )}
    </div>
  );
}
