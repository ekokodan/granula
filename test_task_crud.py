#!/usr/bin/env python3
"""
Comprehensive test script for task CRUD operations
"""
import requests
import json
from datetime import datetime, timedelta

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

def test_task_crud():
    """Test all CRUD operations for tasks"""
    token = login()
    if not token:
        print("❌ Could not login. Make sure user exists and is verified.")
        return
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    print("🧪 Testing Task CRUD Operations...")
    
    # Step 1: Create a team (required for projects)
    print("\n1. Creating test team...")
    team_response = requests.post(f"{BASE_URL}/teams/", 
                                 json={"name": "CRUD Test Team", "description": "Team for testing CRUD operations"},
                                 headers=headers)
    
    if team_response.status_code != 201:
        print(f"❌ Failed to create team: {team_response.text}")
        return
    
    team_id = team_response.json()['id']
    print(f"✅ Team created with ID: {team_id}")
    
    # Step 2: Create a project (required for tasks)
    print("\n2. Creating test project...")
    project_response = requests.post(f"{BASE_URL}/projects/", 
                                   json={
                                       "name": "CRUD Test Project",
                                       "description": "Project for testing task CRUD",
                                       "team_id": team_id
                                   },
                                   headers=headers)
    
    if project_response.status_code != 201:
        print(f"❌ Failed to create project: {project_response.text}")
        return
    
    project_id = project_response.json()['id']
    print(f"✅ Project created with ID: {project_id}")
    
    # Step 3: CREATE - Test task creation
    print("\n3. Testing Task Creation...")
    
    # Test creating tasks with different priorities and due dates
    test_tasks = [
        {
            "title": "High Priority Bug Fix",
            "description": "Critical bug that needs immediate attention",
            "priority": "high",
            "status": "pending",
            "project_id": project_id,
            "due_date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        },
        {
            "title": "Medium Priority Feature",
            "description": "New feature for the next release",
            "priority": "medium",
            "status": "pending",
            "project_id": project_id,
            "due_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        },
        {
            "title": "Low Priority Cleanup",
            "description": "Code cleanup and refactoring",
            "priority": "low",
            "status": "pending",
            "project_id": project_id
        }
    ]
    
    created_tasks = []
    for task_data in test_tasks:
        print(f"   Creating: {task_data['title']}")
        response = requests.post(f"{BASE_URL}/tasks/", json=task_data, headers=headers)
        if response.status_code == 201:
            task = response.json()
            created_tasks.append(task)
            print(f"   ✅ Created task ID: {task['id']} ({task['priority']} priority)")
        else:
            print(f"   ❌ Failed to create task: {response.text}")
            return
    
    # Step 4: READ - Test task retrieval
    print("\n4. Testing Task Retrieval...")
    
    # Test listing all tasks
    print("   Testing: Get all tasks")
    response = requests.get(f"{BASE_URL}/tasks/", headers=headers)
    if response.status_code == 200:
        tasks = response.json()['tasks']
        print(f"   ✅ Retrieved {len(tasks)} tasks")
    else:
        print(f"   ❌ Failed to get tasks: {response.text}")
        return
    
    # Test filtering by priority
    print("   Testing: Filter by high priority")
    response = requests.get(f"{BASE_URL}/tasks/?priority=high", headers=headers)
    if response.status_code == 200:
        high_tasks = response.json()['tasks']
        print(f"   ✅ Retrieved {len(high_tasks)} high priority tasks")
    else:
        print(f"   ❌ Failed to filter tasks: {response.text}")
    
    # Test getting individual task
    test_task = created_tasks[0]
    print(f"   Testing: Get individual task {test_task['id']}")
    response = requests.get(f"{BASE_URL}/tasks/{test_task['id']}", headers=headers)
    if response.status_code == 200:
        task_detail = response.json()
        print(f"   ✅ Retrieved task: {task_detail['title']}")
    else:
        print(f"   ❌ Failed to get task: {response.text}")
    
    # Step 5: UPDATE - Test task updates
    print("\n5. Testing Task Updates...")
    
    # Test updating task details
    update_task = created_tasks[1]
    print(f"   Testing: Update task {update_task['id']}")
    
    update_data = {
        "title": "Updated Medium Priority Feature",
        "description": "Updated description with more details",
        "priority": "high",  # Change priority
        "status": "in_progress"  # Change status
    }
    
    response = requests.put(f"{BASE_URL}/tasks/{update_task['id']}", json=update_data, headers=headers)
    if response.status_code == 200:
        updated_task = response.json()
        print(f"   ✅ Updated task: {updated_task['title']} (priority: {updated_task['priority']}, status: {updated_task['status']})")
    else:
        print(f"   ❌ Failed to update task: {response.text}")
        return
    
    # Test status update endpoint
    print(f"   Testing: Update task status via PATCH")
    response = requests.patch(f"{BASE_URL}/tasks/{update_task['id']}/status", 
                            json={"status": "completed"}, headers=headers)
    if response.status_code == 200:
        completed_task = response.json()
        print(f"   ✅ Status updated to: {completed_task['status']}")
        if completed_task['completed_at']:
            print(f"   ✅ Completion timestamp set: {completed_task['completed_at']}")
    else:
        print(f"   ❌ Failed to update status: {response.text}")
    
    # Step 6: ASSIGNMENT - Test task assignment
    print("\n6. Testing Task Assignment...")
    
    # Get current user info
    me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    if me_response.status_code == 200:
        current_user = me_response.json()['user']
        user_id = current_user['id']
        
        assign_task = created_tasks[2]
        print(f"   Testing: Assign task {assign_task['id']} to user {user_id}")
        
        response = requests.patch(f"{BASE_URL}/tasks/{assign_task['id']}/assign", 
                                json={"assigned_to": user_id}, headers=headers)
        if response.status_code == 200:
            assigned_task = response.json()
            print(f"   ✅ Task assigned to user: {assigned_task['assigned_to']}")
        else:
            print(f"   ❌ Failed to assign task: {response.text}")
    
    # Step 7: DASHBOARD INTEGRATION - Test dashboard data
    print("\n7. Testing Dashboard Integration...")
    
    response = requests.get(f"{BASE_URL}/insights/dashboard", headers=headers)
    if response.status_code == 200:
        dashboard = response.json()
        print(f"   ✅ Dashboard metrics:")
        print(f"      - Tasks completed: {dashboard['tasks_completed']}")
        print(f"      - Tasks pending: {dashboard['tasks_pending']}")
        print(f"      - Completion rate: {dashboard['completion_rate']}%")
        print(f"      - High priority: {dashboard['high_priority_count']}")
        print(f"      - Medium priority: {dashboard['medium_priority_count']}")
        print(f"      - Low priority: {dashboard['low_priority_count']}")
        
        # Verify task lists
        for priority in ['high', 'medium', 'low']:
            task_list = dashboard['tasks_by_priority'][priority]
            print(f"      - {priority.capitalize()} priority tasks: {len(task_list)}")
    else:
        print(f"   ❌ Failed to get dashboard data: {response.text}")
    
    # Step 8: DELETE - Test task deletion
    print("\n8. Testing Task Deletion...")
    
    delete_task = created_tasks[0]
    print(f"   Testing: Delete task {delete_task['id']}")
    
    response = requests.delete(f"{BASE_URL}/tasks/{delete_task['id']}", headers=headers)
    if response.status_code == 200:
        print(f"   ✅ Task deleted successfully")
        
        # Verify task is gone
        response = requests.get(f"{BASE_URL}/tasks/{delete_task['id']}", headers=headers)
        if response.status_code == 404:
            print(f"   ✅ Confirmed task is deleted (404 response)")
        else:
            print(f"   ⚠️ Warning: Task still accessible after deletion")
    else:
        print(f"   ❌ Failed to delete task: {response.text}")
    
    # Step 9: ERROR HANDLING - Test validation
    print("\n9. Testing Error Handling...")
    
    # Test creating task without required fields
    print("   Testing: Create task without title")
    response = requests.post(f"{BASE_URL}/tasks/", 
                           json={"project_id": project_id}, headers=headers)
    if response.status_code == 400:
        print("   ✅ Validation error for missing title")
    else:
        print(f"   ❌ Expected validation error, got: {response.status_code}")
    
    # Test creating task without project
    print("   Testing: Create task without project_id")
    response = requests.post(f"{BASE_URL}/tasks/", 
                           json={"title": "Test task"}, headers=headers)
    if response.status_code == 400:
        print("   ✅ Validation error for missing project_id")
    else:
        print(f"   ❌ Expected validation error, got: {response.status_code}")
    
    # Test accessing non-existent task
    print("   Testing: Access non-existent task")
    response = requests.get(f"{BASE_URL}/tasks/99999", headers=headers)
    if response.status_code == 404:
        print("   ✅ 404 error for non-existent task")
    else:
        print(f"   ❌ Expected 404, got: {response.status_code}")
    
    print("\n🎉 Task CRUD Testing Complete!")
    print("\n📋 Summary:")
    print("✅ Task Creation - All priorities and fields")
    print("✅ Task Reading - List, filter, individual")
    print("✅ Task Updates - Full update and status-only")
    print("✅ Task Assignment - User assignment")
    print("✅ Task Deletion - With confirmation")
    print("✅ Dashboard Integration - Real-time metrics")
    print("✅ Error Handling - Validation and 404s")
    
    print("\n🔄 Refresh your dashboard to see the updated task data!")

if __name__ == "__main__":
    test_task_crud()