# Dashboard API Integration Guide

## 🎯 Quick Setup Steps

### 1. **Replace Current Dashboard**
To see real data immediately, replace your current Dashboard component:

```bash
# Backup current dashboard
mv apps/frontend/src/pages/Dashboard.tsx apps/frontend/src/pages/Dashboard.backup.tsx

# Use the new API-integrated dashboard
mv apps/frontend/src/pages/DashboardWithAPI.tsx apps/frontend/src/pages/Dashboard.tsx
```

### 2. **Test API Connection**
First, test if your backend is working:

```bash
# Create a test user (restart your backend server first!)
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "demo123456"}'

# Verify the user in database
cd apps/backend
python3 -c "
from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()
with app.app_context():
    user = User.query.filter_by(email='demo@example.com').first()
    if user:
        user.is_verified = True
        db.session.commit()
        print('User verified')
    else:
        print('User not found')
"

# Test login
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "demo123456"}'
```

### 3. **Add Test Component (Optional)**
To test the API integration, add this route to your frontend:

In `apps/frontend/src/App.tsx`, add:
```tsx
import ApiTest from './components/ApiTest'

// Add this route in your router
<Route path="/api-test" element={<ApiTest />} />
```

Then visit: `http://localhost:3000/api-test`

### 4. **What the New Dashboard Does**

✅ **Real API Integration:**
- Fetches task counts from `/api/insights/dashboard`
- Shows real completion rates and metrics
- Displays actual high/medium/low priority tasks
- Loads real project data

✅ **Loading States:**
- Shows spinner while loading data
- Handles API errors gracefully
- Retry functionality on failure

✅ **Dynamic Data:**
- Task counts update based on real data
- Priority task lists show actual tasks
- Project sidebar shows real projects
- AI chat mentions actual task counts

## 🔧 Manual Integration Steps

If you prefer to integrate manually:

### 1. **Add API Utils**
Copy `apps/frontend/src/utils/api.ts` to your project and install any missing dependencies.

### 2. **Update Your Dashboard Component**
Replace hardcoded data with API calls:

```tsx
import { useState, useEffect } from 'react'
import { apiClient } from '../utils/api'

// In your Dashboard component:
const [metrics, setMetrics] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const loadData = async () => {
    try {
      const data = await apiClient.getDashboardMetrics()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  loadData()
}, [])

// Replace hardcoded values:
// OLD: <div className="text-5xl font-medium mb-2">202</div>
// NEW: <div className="text-5xl font-medium mb-2">{metrics?.tasks_completed || 0}</div>
```

### 3. **Authentication**
Make sure users are logged in before accessing the dashboard:

```tsx
// Check authentication
import { isAuthenticated } from '../utils/api'

if (!isAuthenticated()) {
  // Redirect to login
  window.location.href = '/login'
}
```

## 🧪 Testing the Integration

### Create Sample Data
Once logged in, create some test data:

```bash
# Get your access token from login response
TOKEN="your_access_token_here"

# Create a team
curl -X POST http://localhost:5002/api/teams/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Development Team", "description": "Main dev team"}'

# Create a project (use team_id from above)
curl -X POST http://localhost:5002/api/projects/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Website Redesign", "team_id": 1, "description": "New website project"}'

# Create some tasks (use project_id from above)
curl -X POST http://localhost:5002/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Fix header bug", "project_id": 1, "priority": "high", "description": "Header not responsive"}'

curl -X POST http://localhost:5002/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Update documentation", "project_id": 1, "priority": "medium", "description": "Update API docs"}'

curl -X POST http://localhost:5002/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Refactor CSS", "project_id": 1, "priority": "low", "description": "Clean up stylesheets"}'
```

### Verify Data
```bash
# Check dashboard metrics
curl -X GET http://localhost:5002/api/insights/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 🚀 Expected Results

After integration, your Dashboard should show:
- **Real task counts** instead of 202, 22, 45%
- **Actual priority tasks** in the task lists
- **Real project names** in the sidebar
- **Dynamic metrics** that update with your data
- **Loading states** while fetching data
- **Error handling** if API calls fail

## 🔍 Troubleshooting

**Dashboard shows "Failed to load dashboard data":**
- Check if backend is running on port 5002
- Verify user is logged in (check localStorage for access_token)
- Check browser console for detailed error messages
- Restart backend server if you made database changes

**Empty task lists:**
- Create some sample data using the API calls above
- Verify tasks are assigned to projects in teams you're a member of

**Authentication errors:**
- Make sure user is verified in database
- Check if token is being sent in API requests
- Try logging in again to get fresh token

The dashboard will now display real, dynamic data from your backend! 🎉