import { useState } from "react";
import { fetchHealth } from "@/lib/health";

type ConnectionState = "idle" | "loading" | "success" | "error";

export default function App() {
  const [state, setState] = useState<ConnectionState>("idle");
  const [message, setMessage] = useState("API 연결을 확인해 보세요.");

  async function checkConnection() {
    setState("loading");
    setMessage("API 응답을 기다리고 있어요.");
    try {
      await fetchHealth();
      setState("success");
      setMessage("FastAPI가 정상적으로 응답했어요.");
    } catch (error) {
      setState("error");
      const reason =
        error instanceof Error ? error.message : "API에 연결할 수 없어요.";
      setMessage(`${reason} API 서버를 확인한 뒤 다시 시도해 주세요.`);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10"></main>
  );
}
