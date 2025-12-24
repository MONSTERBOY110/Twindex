#!/usr/bin/env python3
import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

print("=" * 60)
print("Testing Twindex Backend")
print("=" * 60)

# Test 1: Check /docs endpoint
print("\n1. Testing /docs endpoint...")
try:
    response = requests.get(f"{BASE_URL}/docs", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Result: {'✓ OK' if response.status_code == 200 else '✗ FAILED'}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Check /openapi.json endpoint
print("\n2. Testing /openapi.json endpoint...")
try:
    response = requests.get(f"{BASE_URL}/openapi.json", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Result: {'✓ OK' if response.status_code == 200 else '✗ FAILED'}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Paths available: {list(data.get('paths', {}).keys())}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Check request schema
print("\n3. Testing /simulate endpoint with valid schema...")
test_payload = {
    "prompt": "What lifestyle changes can reduce cardiovascular risk in 10 years?"
}
try:
    response = requests.post(f"{BASE_URL}/simulate", json=test_payload, timeout=60)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   Result: ✓ OK")
        data = response.json()
        print(f"   Response keys: {list(data.keys())}")
        print(f"   Result length: {len(data.get('result', ''))}")
    else:
        print(f"   Result: ✗ FAILED")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"   Error: {e}")

# Test 4: Check request schema validation (invalid schema)
print("\n4. Testing /simulate endpoint with invalid schema...")
invalid_payload = {
    "invalid_field": "test"
}
try:
    response = requests.post(f"{BASE_URL}/simulate", json=invalid_payload, timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 422:
        print(f"   Result: ✓ OK (Validation error caught as expected)")
    else:
        print(f"   Result: ✗ FAILED (Should return 422, got {response.status_code})")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "=" * 60)
print("Backend Testing Complete")
print("=" * 60)
