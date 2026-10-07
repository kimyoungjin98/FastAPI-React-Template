import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, test } from "node:test";
import { fetchHealth } from "../src/lib/health.ts";

const server = createServer((request, response) => {
  response.setHeader("content-type", "application/json");
  switch (request.url) {
    case "/ok":
      response.end('{"status":"ok"}');
      break;
    case "/unavailable":
      response.statusCode = 503;
      response.end('{"detail":"unavailable"}');
      break;
    case "/malformed":
      response.end('{"status":"unexpected"}');
      break;
    case "/null":
      response.end("null");
      break;
    default:
      response.end("not json");
  }
});

let origin: string;

before(async () => {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
    server.closeAllConnections();
  });
});

test("returns a valid health response", async () => {
  assert.deepEqual(await fetchHealth(`${origin}/ok`), { status: "ok" });
});

test("reports unsuccessful HTTP responses", async () => {
  await assert.rejects(fetchHealth(`${origin}/unavailable`), /503/);
});

test("rejects an unexpected status", async () => {
  await assert.rejects(fetchHealth(`${origin}/malformed`), /응답 형식/);
});

test("rejects null JSON", async () => {
  await assert.rejects(fetchHealth(`${origin}/null`), /응답 형식/);
});

test("rejects invalid JSON", async () => {
  await assert.rejects(fetchHealth(`${origin}/invalid`), /응답 형식/);
});
