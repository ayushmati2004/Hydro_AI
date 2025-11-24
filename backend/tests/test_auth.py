import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_and_login():
    email = "testuser@example.com"
    resp = client.post('/api/auth/signup', json={"email": email, "password": "testpass123", "display_name": "Tester"})
    assert resp.status_code == 200
    data = resp.json()
    assert data['email'] == email

    resp2 = client.post('/api/auth/login', data={"email": email, "password": "testpass123"})
    assert resp2.status_code == 200
    token = resp2.json().get('access_token')
    assert token
