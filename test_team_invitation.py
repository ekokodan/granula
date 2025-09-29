#!/usr/bin/env python3
"""
Test script to debug team member invitation issue
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:5002/api"
EMAIL = "demo@example.com"  # Change this to your logged-in user
PASSWORD = "demo123456"

def login():
    """Login and get access token"""
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print(f"Login failed: {response.text}")
        return None

def test_team_invitation():
    """Test team member invitation"""
    token = login()
    if not token:
        print("❌ Could not login")
        return
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    print("🧪 Testing Team Member Invitation...")
    
    # Step 1: Get teams
    print("\n1. Getting teams...")
    teams_response = requests.get(f"{BASE_URL}/teams/", headers=headers)
    
    if teams_response.status_code != 200:
        print(f"❌ Failed to get teams: {teams_response.text}")
        return
    
    teams = teams_response.json().get('teams', [])
    if not teams:
        print("❌ No teams found. Create a team first.")
        return
    
    team_id = teams[0]['id']
    print(f"✅ Using team: {teams[0]['name']} (ID: {team_id})")
    
    # Step 2: Try to invite a user (use the same email for testing)
    print(f"\n2. Inviting user to team {team_id}...")
    
    invitation_data = {
        "email": EMAIL,  # Try inviting the same user (should fail with "already a member")
        "role": "member"
    }
    
    response = requests.post(
        f"{BASE_URL}/teams/{team_id}/members", 
        json=invitation_data, 
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    
    try:
        response_data = response.json()
        print(f"Response Body: {json.dumps(response_data, indent=2)}")
    except:
        print(f"Response Text: {response.text}")
    
    if response.status_code == 200:
        print("✅ Team invitation successful")
    elif response.status_code == 400:
        print("✅ Expected validation error (user already member or similar)")
    else:
        print(f"❌ Unexpected response: {response.status_code}")
    
    # Step 3: Test with a non-existent user
    print(f"\n3. Testing with non-existent user...")
    
    invitation_data = {
        "email": "nonexistent@example.com",
        "role": "member"
    }
    
    response = requests.post(
        f"{BASE_URL}/teams/{team_id}/members", 
        json=invitation_data, 
        headers=headers
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        response_data = response.json()
        print(f"Response Body: {json.dumps(response_data, indent=2)}")
    except:
        print(f"Response Text: {response.text}")
    
    if response.status_code == 404:
        print("✅ Expected 404 for non-existent user")
    else:
        print(f"❌ Unexpected response for non-existent user: {response.status_code}")

if __name__ == "__main__":
    test_team_invitation()