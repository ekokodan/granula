#!/usr/bin/env python3
"""
Test script to verify the task management system is working correctly.
"""
import requests
import json

BASE_URL = "http://localhost:5002"

def register_user(email, password):
    """Register a new user."""
    response = requests.post(f"{BASE_URL}/api/auth/register", json={
        "email": email,
        "password": password
    })
    return response

def login_user(email, password):
    """Login and get access token."""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    if response.status_code == 200:
        return response.json().get('access_token')
    return None

def create_team(token, name, description=""):
    """Create a team."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/teams/", 
                           json={"name": name, "description": description},
                           headers=headers)
    return response

def create_project(token, name, team_id, description=""):
    """Create a project."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/projects/", 
                           json={"name": name, "team_id": team_id, "description": description},
                           headers=headers)
    return response

def create_task(token, title, project_id, priority="medium", description=""):
    """Create a task."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(f"{BASE_URL}/api/tasks/", 
                           json={
                               "title": title, 
                               "project_id": project_id, 
                               "priority": priority,
                               "description": description
                           },
                           headers=headers)
    return response

def get_dashboard_metrics(token):
    """Get dashboard metrics."""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/insights/dashboard", headers=headers)
    return response

def main():
    print("Testing Task Management System...")
    
    # Test user registration and login
    email = "test@example.com"
    password = "testpassword123"
    
    print("1. Registering test user...")
    register_resp = register_user(email, password)
    if register_resp.status_code == 201:
        print("✓ User registered successfully")
    elif register_resp.status_code == 409:
        print("✓ User already exists")
    else:
        print(f"✗ Registration failed: {register_resp.text}")
        return
    
    # We need to manually verify email for testing, let's update the user to verified
    print("\n2. Note: In a real scenario, email verification would be required.")
    print("   For this test, you would need to manually set is_verified=True in the database.")
    
    print("\n3. Attempting login...")
    token = login_user(email, password)
    if token:
        print("✓ Login successful")
    else:
        print("✗ Login failed - user might not be verified")
        return
    
    print(f"\n4. Creating team...")
    team_resp = create_team(token, "Test Team", "A test team for development")
    if team_resp.status_code == 201:
        team_data = team_resp.json()
        team_id = team_data['id']
        print(f"✓ Team created: {team_data['name']} (ID: {team_id})")
    else:
        print(f"✗ Team creation failed: {team_resp.text}")
        return
    
    print(f"\n5. Creating project...")
    project_resp = create_project(token, "Test Project", team_id, "A test project")
    if project_resp.status_code == 201:
        project_data = project_resp.json()
        project_id = project_data['id']
        print(f"✓ Project created: {project_data['name']} (ID: {project_id})")
    else:
        print(f"✗ Project creation failed: {project_resp.text}")
        return
    
    print(f"\n6. Creating test tasks...")
    tasks = [
        ("High priority task", "high"),
        ("Medium priority task", "medium"),
        ("Low priority task", "low"),
        ("Another high priority task", "high"),
        ("Another medium priority task", "medium"),
    ]
    
    for title, priority in tasks:
        task_resp = create_task(token, title, project_id, priority)
        if task_resp.status_code == 201:
            print(f"✓ Task created: {title} ({priority})")
        else:
            print(f"✗ Task creation failed: {task_resp.text}")
    
    print(f"\n7. Getting dashboard metrics...")
    dashboard_resp = get_dashboard_metrics(token)
    if dashboard_resp.status_code == 200:
        metrics = dashboard_resp.json()
        print("✓ Dashboard metrics retrieved:")
        print(f"  - Tasks completed: {metrics['tasks_completed']}")
        print(f"  - Tasks pending: {metrics['tasks_pending']}")
        print(f"  - Completion rate: {metrics['completion_rate']}%")
        print(f"  - High priority count: {metrics['high_priority_count']}")
        print(f"  - Medium priority count: {metrics['medium_priority_count']}")
        print(f"  - Low priority count: {metrics['low_priority_count']}")
    else:
        print(f"✗ Dashboard metrics failed: {dashboard_resp.text}")
    
    print("\n✓ Task Management System test completed!")

if __name__ == "__main__":
    main()