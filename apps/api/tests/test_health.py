import asyncio

import httpx
from fastapi import FastAPI

from app.main import create_app


async def get(application: FastAPI, path: str) -> httpx.Response:
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=application), base_url="http://test"
    ) as client:
        return await client.get(path)


def test_health_contract():
    response = asyncio.run(get(create_app(), "/api/health"))
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_app_name_from_environment(monkeypatch):
    monkeypatch.setenv("APP_NAME", "Custom API")
    response = asyncio.run(get(create_app(), "/openapi.json"))
    assert response.json()["info"]["title"] == "Custom API"
