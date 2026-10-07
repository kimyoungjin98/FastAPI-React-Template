"use client";

import { useState } from "react";
import { fetchHealth } from "@/lib/health";

type ConnectionState = "idle" | "loading" | "success" | "error";

export default function Home() {
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
      const reason = error instanceof Error ? error.message : "API에 연결할 수 없어요.";
      setMessage(`${reason} API 서버를 확인한 뒤 다시 시도해 주세요.`);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1">STARTER TEMPLATE</span>
        <span>FastAPI / Next.js / Turborepo</span>
      </div>

      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl sm:leading-tight">
        하나의 워크스페이스에서,<br />
        웹과 API를 함께.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        기본 설정은 준비되어 있어요. 연결을 확인하고 새로운 프로젝트를 시작하세요.
      </p>

      <section aria-labelledby="connection-title" className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h2 id="connection-title" className="text-xl font-semibold text-slate-900">API 연결 확인</h2>
            <p className="mt-2 text-sm text-slate-500">Next.js 프록시를 통해 FastAPI 상태를 조회해요.</p>
          </div>
          <button
            type="button"
            onClick={checkConnection}
            disabled={state === "loading"}
            className="min-h-11 rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 disabled:cursor-wait disabled:opacity-50"
          >
            {state === "loading" ? "확인 중…" : state === "idle" ? "연결 확인" : "다시 확인"}
          </button>
        </div>
        <div
          role="status"
          aria-live="polite"
          className={`mt-6 rounded-xl px-4 py-4 text-sm leading-6 ${
            state === "success" ? "bg-emerald-50 text-emerald-800" :
            state === "error" ? "bg-rose-50 text-rose-800" : "bg-slate-50 text-slate-600"
          }`}
        >
          {message}
        </div>
      </section>

      <footer className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
        <a className="underline underline-offset-4 hover:text-slate-950" href="https://nextjs.org/docs">Next.js 문서</a>
        <a className="underline underline-offset-4 hover:text-slate-950" href="https://fastapi.tiangolo.com/">FastAPI 문서</a>
        <a className="underline underline-offset-4 hover:text-slate-950" href="https://turborepo.dev/docs">Turborepo 문서</a>
      </footer>
    </main>
  );
}
