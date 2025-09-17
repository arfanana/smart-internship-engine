import { useState, useEffect } from 'react'
import {
  Container, Typography, Grid, Card, CardContent, Box, LinearProgress,
  Paper, Avatar, Chip, Divider
} from '@mui/material'
import {
  People as PeopleIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material'
import axios from 'axios'

function SaaSDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    totalMatches: 0,
    matchRate: 0,
    avgMatchScore: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [studentsRes, internshipsRes, matchesRes] = await Promise.all([
        axios.get('/api/admin/students/'),
        axios.get('/api/admin/internships/'),
        axios.get('/api/admin/matches/')
      ])

      const students = studentsRes.data
      const internships = internshipsRes.data
      const matches = matchesRes.data

      const matchRate = students.length > 0 ? (matches.length / students.length) * 100 : 0
      const avgMatchScore = matches.length > 0
        ? matches.reduce((sum, match) => sum + (match.match_score || 0), 0) / matches.length
        : 0

      setStats({
        totalStudents: students.length,
        totalInternships: internships.length,
        totalMatches: matches.length,
        matchRate: Math.round(matchRate),
        avgMatchScore: Math.round(avgMatchScore * 100) / 100
      })

      // Generate recent activity (mock data for now)
      setRecentActivity([
        { id: 1, type: 'match', message: 'New match created', time: '2 minutes ago' },
        { id: 2, type: 'student', message: 'Student registered', time: '5 minutes ago' },
        { id: 3, type: 'internship', message: 'Internship posted', time: '10 minutes ago' },
        { id: 4, type: 'match', message: 'Match score updated', time: '15 minutes ago' },
      ])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const KPICard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}20`,
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'transform 0.3s ease',
        boxShadow: `0 8px 25px ${color}20`
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: color }}>
              {loading ? '...' : value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{
            bgcolor: color,
            width: 56,
            height: 56,
            boxShadow: `0 4px 14px ${color}30`
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  const ActivityItem = ({ activity }) => (
    <Box display="flex" alignItems="center" sx={{ py: 1.5 }}>
      <Avatar sx={{
        width: 32,
        height: 32,
        mr: 2,
        bgcolor: activity.type === 'match' ? '#4caf50' :
                 activity.type === 'student' ? '#2196f3' : '#ff9800'
      }}>
        {activity.type === 'match' ? <TrendingUpIcon fontSize="small" /> :
         activity.type === 'student' ? <PeopleIcon fontSize="small" /> :
         <WorkIcon fontSize="small" />}
      </Avatar>
      <Box flexGrow={1}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {activity.message}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {activity.time}
        </Typography>
      </Box>
      <Chip
        label={activity.type}
        size="small"
        sx={{
          bgcolor: activity.type === 'match' ? '#4caf5015' :
                   activity.type === 'student' ? '#2196f315' : '#ff980015',
          color: activity.type === 'match' ? '#4caf50' :
                 activity.type === 'student' ? '#2196f3' : '#ff9800'
        }}
      />
    </Box>
  )

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <LinearProgress />
          <Typography sx={{ mt: 2, textAlign: 'center' }}>Loading dashboard...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
        }}>
          SaaS Analytics Dashboard
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Real-time insights into your internship allocation platform
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Students"
              value={stats.totalStudents}
              icon={<PeopleIcon />}
              color="#2196f3"
              subtitle="Active registrations"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Available Internships"
              value={stats.totalInternships}
              icon={<WorkIcon />}
              color="#4caf50"
              subtitle="Open positions"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Successful Matches"
              value={stats.totalMatches}
              icon={<TrendingUpIcon />}
              color="#ff9800"
              subtitle="Completed pairings"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Match Rate"
              value={`${stats.matchRate}%`}
              icon={<AssessmentIcon />}
              color="#9c27b0"
              subtitle="Success percentage"
            />
          </Grid>
        </Grid>

        {/* Charts and Analytics Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  Performance Metrics
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Average Match Score
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {stats.avgMatchScore}/100
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={stats.avgMatchScore}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mt: 1,
                      bgcolor: '#e3f2fd',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PieChartIcon sx={{ mr: 1 }} />
                  Recent Activity
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {recentActivity.map((activity, index) => (
                    <Box key={activity.id}>
                      <ActivityItem activity={activity} />
                      {index < recentActivity.length - 1 && <Divider sx={{ my: 1 }} />}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Analytics Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Platform Health
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">System Uptime</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      99.9%
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">API Response Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      120ms
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Active Sessions</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {stats.totalStudents}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label="Generate Report"
                    clickable
                    sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                  />
                  <Chip
                    label="Export Data"
                    clickable
                    sx={{ bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                  />
                  <Chip
                    label="View Analytics"
                    clickable
                    sx={{ bgcolor: '#e8f5e8', color: '#388e3c' }}
                  />
                  <Chip
                    label="System Settings"
                    clickable
                    sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default SaaSDashboard