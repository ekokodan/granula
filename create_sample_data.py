#!/usr/bin/env python3
"""
Create sample data for testing the dashboard
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

def create_sample_data():
    """Create sample teams, projects, and tasks"""
    token = login()
    if not token:
        print("❌ Could not login. Make sure user exists and is verified.")
        return
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    print("🎯 Creating sample data...")
    
    # 1. Create team
    print("1. Creating team...")
    team_response = requests.post(f"{BASE_URL}/teams/", 
                                 json={"name": "Development Team", "description": "Main development team"},
                                 headers=headers)
    
    if team_response.status_code != 201:
        print(f"❌ Failed to create team: {team_response.text}")
        return
    
    team_id = team_response.json()['id']
    print(f"✅ Team created with ID: {team_id}")
    
    # 2. Create projects
    projects = [
        {"name": "Website Redesign", "description": "Complete website overhaul"},
        {"name": "Mobile App", "description": "iOS and Android app development"},
        {"name": "API Integration", "description": "Third-party API integrations"}
    ]
    
    project_ids = []
    for project in projects:
        print(f"2. Creating project: {project['name']}...")
        project['team_id'] = team_id
        
        response = requests.post(f"{BASE_URL}/projects/", json=project, headers=headers)
        if response.status_code == 201:
            project_id = response.json()['id']
            project_ids.append(project_id)
            print(f"✅ Project '{project['name']}' created with ID: {project_id}")
        else:
            print(f"❌ Failed to create project: {response.text}")
    
    # 3. Create tasks
    tasks = [
        # High priority tasks
        {"title": "Fix critical login bug", "priority": "high", "description": "Users can't login on mobile"},
        {"title": "Database backup failure", "priority": "high", "description": "Backup system is down"},
        {"title": "Payment gateway error", "priority": "high", "description": "Payments failing intermittently"},
        {"title": "Security vulnerability", "priority": "high", "description": "XSS vulnerability found"},
        {"title": "Server down", "priority": "high", "description": "Production server not responding"},
        
        # Medium priority tasks
        {"title": "Update user interface", "priority": "medium", "description": "Modernize the UI design"},
        {"title": "Add email notifications", "priority": "medium", "description": "Implement email notification system"},
        {"title": "Performance optimization", "priority": "medium", "description": "Optimize database queries"},
        {"title": "User feedback feature", "priority": "medium", "description": "Add feedback collection"},
        {"title": "Documentation update", "priority": "medium", "description": "Update API documentation"},
        {"title": "Testing improvements", "priority": "medium", "description": "Add more unit tests"},
        
        # Low priority tasks
        {"title": "Code cleanup", "priority": "low", "description": "Remove unused code and comments"},
        {"title": "Refactor CSS", "priority": "low", "description": "Organize stylesheets better"},
        {"title": "Update dependencies", "priority": "low", "description": "Update npm packages"},
        {"title": "Add dark mode", "priority": "low", "description": "Implement dark theme option"},
    ]
    
    # Distribute tasks across projects
    for i, task in enumerate(tasks):
        project_id = project_ids[i % len(project_ids)] if project_ids else project_ids[0]
        task['project_id'] = project_id
        
        print(f"3. Creating task: {task['title']}...")
        response = requests.post(f"{BASE_URL}/tasks/", json=task, headers=headers)
        if response.status_code == 201:
            print(f"✅ Task '{task['title']}' created")
        else:
            print(f"❌ Failed to create task: {response.text}")
    
    # 4. Complete some tasks to show metrics
    print("4. Completing some tasks...")
    completed_tasks = ["Code cleanup", "Update dependencies", "Refactor CSS"]
    
    # Get all tasks
    tasks_response = requests.get(f"{BASE_URL}/tasks/", headers=headers)
    if tasks_response.status_code == 200:
        all_tasks = tasks_response.json()['tasks']
        
        for task in all_tasks:
            if task['title'] in completed_tasks:
                print(f"4. Completing task: {task['title']}...")
                response = requests.patch(f"{BASE_URL}/tasks/{task['id']}/status", 
                                        json={"status": "completed"}, headers=headers)
                if response.status_code == 200:
                    print(f"✅ Task '{task['title']}' marked as completed")
    
    print("\n🎉 Sample data created successfully!")
    print("🔄 Refresh your dashboard to see the data!")
    
    # Show summary
    dashboard_response = requests.get(f"{BASE_URL}/insights/dashboard", headers=headers)
    if dashboard_response.status_code == 200:
        metrics = dashboard_response.json()
        print("\n📊 Dashboard Summary:")
        print(f"   - Tasks completed: {metrics['tasks_completed']}")
        print(f"   - Tasks pending: {metrics['tasks_pending']}")
        print(f"   - Completion rate: {metrics['completion_rate']}%")
        print(f"   - High priority: {metrics['high_priority_count']}")
        print(f"   - Medium priority: {metrics['medium_priority_count']}")
        print(f"   - Low priority: {metrics['low_priority_count']}")

if __name__ == "__main__":
    create_sample_data()