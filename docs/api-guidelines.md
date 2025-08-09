# API Design Guidelines

## REST API Standards

### URL Structure
```
/api/v1/{resource}/{id}/{sub-resource}
```

Examples:
- `GET /api/v1/projects` - List projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/{id}` - Get project
- `PUT /api/v1/projects/{id}` - Update project
- `DELETE /api/v1/projects/{id}` - Delete project
- `GET /api/v1/projects/{id}/tasks` - Get project tasks

### HTTP Methods
- **GET**: Retrieve resources (idempotent)
- **POST**: Create new resources
- **PUT**: Full update (replace entire resource)
- **PATCH**: Partial update (modify specific fields)
- **DELETE**: Remove resources (idempotent)

### Status Codes
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST with resource creation
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing/invalid authentication
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource conflict (e.g., duplicate)
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Request/Response Format

### Request Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
X-Request-ID: {uuid}
```

### Response Format
```json
{
  "data": {},
  "meta": {
    "timestamp": "2025-01-05T10:30:00Z",
    "version": "1.0",
    "request_id": "uuid"
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-05T10:30:00Z",
    "request_id": "uuid"
  }
}
```

### Pagination
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  },
  "links": {
    "first": "/api/v1/tasks?page=1",
    "last": "/api/v1/tasks?page=5",
    "next": "/api/v1/tasks?page=2",
    "prev": null
  }
}
```

## Filtering, Sorting & Search

### Filtering
```
GET /api/v1/tasks?status=completed&priority=high
GET /api/v1/tasks?created_after=2025-01-01
```

### Sorting
```
GET /api/v1/tasks?sort=created_at
GET /api/v1/tasks?sort=-priority,created_at
```

### Search
```
GET /api/v1/tasks?q=meeting
GET /api/v1/tasks?search[title]=report&search[status]=pending
```

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["user", "team_lead"],
  "exp": 1234567890,
  "iat": 1234567890
}
```

### Permission Levels
- **Public**: No authentication required
- **Authenticated**: Valid token required
- **Owner**: Resource owner only
- **Team Member**: Team access
- **Team Lead**: Team management
- **Admin**: Full system access

## Versioning

### URL Versioning
```
/api/v1/...
/api/v2/...
```

### Version Deprecation
- Announce deprecation 3 months in advance
- Include `Sunset` header in responses
- Provide migration guide

## Rate Limiting

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### Limits
- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Premium: 10000 requests/hour

## Webhooks

### Event Format
```json
{
  "id": "evt_123",
  "type": "task.created",
  "data": {},
  "created_at": "2025-01-05T10:30:00Z",
  "signature": "sha256=..."
}
```

### Retry Policy
- 3 retry attempts
- Exponential backoff: 1s, 5s, 30s
- Mark inactive after failures

## Performance

### Response Time Targets
- p50: < 100ms
- p95: < 500ms
- p99: < 1000ms

### Optimization Strategies
- Database query optimization
- Response caching
- Field filtering (`?fields=id,title`)
- Eager loading relationships
- Connection pooling