export type HealthResponse = { status: "ok" };

export async function fetchHealth(endpoint = "/api/health"): Promise<HealthResponse> {
  const response = await fetch(endpoint, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`API 요청에 실패했어요. (HTTP ${response.status})`);
  }

  const payload: unknown = await response.json().catch(() => {
    throw new Error("API 응답 형식을 확인해 주세요.");
  });

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("status" in payload) ||
    payload.status !== "ok"
  ) {
    throw new Error("API 응답 형식을 확인해 주세요.");
  }

  return { status: "ok" };
}
