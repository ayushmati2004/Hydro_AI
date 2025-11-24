import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_upload_and_metrics_flow():
    email = "uploader@example.com"
    # signup
    r = client.post('/api/auth/signup', json={"email": email, "password": "pass1234", "display_name": "Uploader"})
    assert r.status_code == 200
    # login
    r2 = client.post('/api/auth/login', data={"email": email, "password": "pass1234"})
    token = r2.json().get('access_token')
    assert token

    # upload a small CSV
    csv = 'date,crop,water_liters,nutrient_mg,light_hours,biomass,strategy\n2025-01-01,basil,1.0,50,10,0.12,static\n'
    files = {'file': ('test.csv', io.BytesIO(csv.encode()), 'text/csv')}
    headers = {"Authorization": f"Bearer {token}"}
    up = client.post('/api/datasets', files=files, headers=headers)
    assert up.status_code == 200

    # metrics overview
    mo = client.get('/api/metrics/overview', headers=headers)
    assert mo.status_code == 200
