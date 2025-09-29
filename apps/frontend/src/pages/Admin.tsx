import { useEffect, useState } from 'react'
import api from '@/lib/api.ts'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Mail, Calendar, Download, RefreshCw } from 'lucide-react'

type BackendRoute = { rule: string; endpoint: string; methods: string[] }
type FrontendPage = { file: string; name: string; route_hint: string }
type WaitlistEntry = { 
  id: number
  email: string
  signed_up_at: string
  status: string
  confirmation_sent: boolean 
}
type WaitlistStats = {
  total_signups: number
  recent_signups: number
}

type AdminUser = {
  id: number
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
  is_active: boolean
  created_at?: string
}

export default function Admin() {
  const [routes, setRoutes] = useState<BackendRoute[]>([])
  const [pages, setPages] = useState<FrontendPage[]>([])
  const [running, setRunning] = useState(false)
  const [testOutput, setTestOutput] = useState<string>('')
  const [testOk, setTestOk] = useState<boolean | null>(null)
  const [waitlistStats, setWaitlistStats] = useState<WaitlistStats>({ total_signups: 0, recent_signups: 0 })
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [loadingWaitlist, setLoadingWaitlist] = useState(false)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    api.get('/admin/routes').then(r => setRoutes(r.data.routes || [])).catch(() => {})
    api.get('/admin/frontend/pages').then(r => setPages(r.data.pages || [])).catch(() => {})
    loadWaitlistData()
    loadUsers()
  }, [])

  const loadWaitlistData = async () => {
    setLoadingWaitlist(true)
    try {
      const [statsRes, entriesRes] = await Promise.all([
        api.get('/waitlist/status'),
        api.get('/waitlist/entries?per_page=20')
      ])
      
      setWaitlistStats({
        total_signups: statsRes.data.total_signups,
        recent_signups: statsRes.data.recent_signups
      })
      
      setWaitlistEntries(entriesRes.data.entries || [])
    } catch (error) {
      console.error('Failed to load waitlist data:', error)
    } finally {
      setLoadingWaitlist(false)
    }
  }

  const runTests = async () => {
    setRunning(true)
    setTestOutput('')
    setTestOk(null)
    try {
      const res = await api.post('/admin/tests/run', {})
      setTestOutput((res.data.stdout || '') + '\n' + (res.data.stderr || ''))
      setTestOk(!!res.data.success)
    } catch (e: any) {
      setTestOk(false)
      setTestOutput(e?.response?.data?.stderr || 'Failed to run tests')
    } finally {
      setRunning(false)
    }
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const res = await api.get('/admin/users?per_page=50')
      setUsers(res.data.items || [])
    } catch (_) {
      toast.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const setRole = async (userId: number, role: 'user' | 'admin') => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role })
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: res.data.user.role as any } : u)))
      toast.success('Role updated')
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update role')
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      
      {/* Waitlist Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Waitlist Management</h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadWaitlistData}
              disabled={loadingWaitlist}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingWaitlist ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/api/waitlist/export">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </a>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistStats.total_signups}</div>
              <p className="text-xs text-muted-foreground">All time registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waitlistStats.recent_signups}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Confirmations</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {waitlistEntries.filter(e => e.confirmation_sent).length}
              </div>
              <p className="text-xs text-muted-foreground">Emails sent successfully</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Waitlist Entries</CardTitle>
            <CardDescription>Latest 20 signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Signup Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Email Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 font-mono">{entry.email}</td>
                      <td className="p-2">
                        {new Date(entry.signed_up_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.confirmation_sent 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {entry.confirmation_sent ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {waitlistEntries.length === 0 && !loadingWaitlist && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        No waitlist entries found
                      </td>
                    </tr>
                  )}
                  {loadingWaitlist && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Users Management */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Users Management</h2>
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loadingUsers}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingUsers ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>First 50 users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Verified</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="p-2 font-mono">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2">{u.is_verified ? 'Yes' : 'No'}</td>
                      <td className="p-2">
                        {u.role === 'admin' ? (
                          <Button variant="outline" size="sm" onClick={() => setRole(u.id, 'user')}>Make User</Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setRole(u.id, 'admin')}>Make Admin</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loadingUsers && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">No users found</td>
                    </tr>
                  )}
                  {loadingUsers && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">Loading…</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Backend Routes</h2>
          <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" onClick={() => api.get('/admin/routes').then(r => setRoutes(r.data.routes || []))}>Refresh</button>
        </div>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Rule</th>
                <th className="text-left p-2">Methods</th>
                <th className="text-left p-2">Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.rule + r.endpoint} className="border-t">
                  <td className="p-2 font-mono">{r.rule}</td>
                  <td className="p-2">{r.methods.join(', ')}</td>
                  <td className="p-2">{r.endpoint}</td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr className="border-t">
                  <td className="p-2" colSpan={3}>No routes found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Frontend Pages</h2>
          <button className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" onClick={() => api.get('/admin/frontend/pages').then(r => setPages(r.data.pages || []))}>Refresh</button>
        </div>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Route</th>
                <th className="text-left p-2">File</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.file} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 font-mono">{p.route_hint}</td>
                  <td className="p-2 font-mono">{p.file}</td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr className="border-t">
                  <td className="p-2" colSpan={3}>No pages found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-medium">Tests</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50" disabled={running} onClick={runTests}>{running ? 'Running…' : 'Run backend tests'}</button>
          </div>
        </div>
        {testOk !== null && (
          <div className={`text-sm mb-2 ${testOk ? 'text-green-600' : 'text-red-600'}`}>{testOk ? 'Tests passed' : 'Tests failed'}</div>
        )}
        <pre className="p-3 border rounded bg-gray-50 overflow-auto text-xs whitespace-pre-wrap max-h-96">{testOutput || 'No output yet'}</pre>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Exports</h2>
        <div className="flex items-center gap-3">
          <a className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/api/waitlist/export">Download Waitlist CSV</a>
        </div>
      </section>
    </div>
  )
}


