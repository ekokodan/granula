# Offline Sync Protocol

## Overview
Granula implements an offline-first architecture to ensure productivity even with limited connectivity.

## Sync Protocol

### 1. Delta Sync
- Track changes using timestamps and version vectors
- Maintain operation log for offline changes
- Batch sync when connection restored

### 2. Conflict Resolution

#### Last-Write-Wins (LWW)
Default strategy for simple conflicts:
- Compare timestamps
- Server timestamp as tiebreaker
- User notification for data loss

#### Three-Way Merge
For complex conflicts:
- Maintain base version
- Compare local and remote changes
- Auto-merge non-conflicting changes
- Flag conflicts for user resolution

### 3. Queue Management

```typescript
interface SyncQueue {
  pending: Operation[]
  failed: Operation[]
  syncing: Operation[]
}

interface Operation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: string
  data: any
  timestamp: number
  retryCount: number
}
```

## Implementation

### Client-Side (IndexedDB with Dexie)

```typescript
// db/sync.ts
class SyncManager {
  async queueOperation(op: Operation) {
    await db.syncQueue.add(op)
    this.attemptSync()
  }

  async attemptSync() {
    if (!navigator.onLine) return
    
    const pending = await db.syncQueue
      .where('status').equals('pending')
      .toArray()
    
    for (const op of pending) {
      try {
        await this.syncOperation(op)
        await db.syncQueue.delete(op.id)
      } catch (error) {
        await this.handleSyncError(op, error)
      }
    }
  }
}
```

### Server-Side (Flask)

```python
# app/sync/routes.py
@sync_bp.route('/sync', methods=['POST'])
@jwt_required()
def sync():
    client_state = request.json.get('state')
    operations = request.json.get('operations', [])
    
    # Process operations
    results = []
    for op in operations:
        result = process_operation(op)
        results.append(result)
    
    # Get server changes since client state
    server_changes = get_changes_since(client_state)
    
    return jsonify({
        'results': results,
        'changes': server_changes,
        'serverState': get_current_state()
    })
```

## Sync Strategies

### 1. Aggressive Sync
- Sync immediately on change
- Retry with exponential backoff
- Suitable for critical data

### 2. Batched Sync
- Queue changes locally
- Sync periodically (e.g., every 30s)
- Optimize for battery and data usage

### 3. Manual Sync
- User-triggered sync
- Show sync status clearly
- Allow forced conflict resolution

## Data Storage Limits

### IndexedDB
- Typically 50% of free disk space
- Request persistent storage for critical data
- Implement data pruning strategies

### Cache Management
- Prioritize recent and frequently accessed data
- Implement LRU eviction
- Compress large text data

## Testing

### Scenarios to Test
1. Network loss during sync
2. Concurrent edits from multiple devices
3. Schema version mismatches
4. Large batch syncs
5. Partial sync failures

### Tools
- Chrome DevTools Network throttling
- Service Worker for offline simulation
- Conflict generation scripts