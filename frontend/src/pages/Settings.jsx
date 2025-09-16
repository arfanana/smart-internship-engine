import { useState, useEffect, useContext } from 'react'
import {
  Container, Typography, Card, CardContent, Grid, Button, Switch, FormControlLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Alert, Box
} from '@mui/material'
import {
  DeleteForever, Delete, History, DarkMode, LightMode
} from '@mui/icons-material'
import axios from 'axios'
import { ThemeContext } from '../main.jsx'

function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const [matches, setMatches] = useState([])
  const [stats, setStats] = useState({ employers: 0, students: 0, internships: 0, matches: 0 })
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', type: '' })
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [matchesRes, statsRes] = await Promise.all([
        axios.get('/api/admin/matches/'),
        axios.get('/api/admin/stats')
      ])

      setMatches(matchesRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      showAlert('Error loading data', 'error')
    }
  }

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity })
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000)
  }

  const handleClearData = async (type) => {
    try {
      await axios.delete(`/api/admin/clear/${type}`)
      showAlert(`${type === 'all' ? 'All' : type} data cleared successfully`)
      fetchData()
    } catch (error) {
      console.error('Error clearing data:', error)
      showAlert('Error clearing data', 'error')
    }
    setConfirmDialog({ open: false, action: '', type: '' })
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    showAlert(`Dark mode ${newDarkMode ? 'enabled' : 'disabled'}`)
  }

  const openConfirmDialog = (action, type) => {
    setConfirmDialog({ open: true, action, type })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      default: return 'warning'
    }
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        ⚙️ Settings & Administration
      </Typography>

      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Data Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🗂️ Data Management
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Clear specific data or wipe everything from the database
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Statistics:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2">Employers: {stats.employers}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Students: {stats.students}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Internships: {stats.internships}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">Matches: {stats.matches}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Delete />}
                  onClick={() => openConfirmDialog('clear', 'students')}
                  disabled={stats.students === 0}
                >
                  Clear All Students
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<Delete />}
                  onClick={() => openConfirmDialog('clear', 'internships')}
                  disabled={stats.internships === 0}
                >
                  Clear All Internships
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForever />}
                  onClick={() => openConfirmDialog('clear', 'all')}
                  disabled={stats.employers === 0 && stats.students === 0 && stats.internships === 0 && stats.matches === 0}
                >
                  Clear ALL Data
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎨 Appearance Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Customize the look and feel of the application
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    icon={<LightMode />}
                    checkedIcon={<DarkMode />}
                  />
                }
                label="Dark Mode"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                {darkMode ? '🌙 Dark mode is enabled' : '☀️ Light mode is enabled'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Past Matches */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Past Matches History
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View all previous student-internship matches and their status
              </Typography>

              {matches.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No matches found. Start matching students with internships!
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Internship ID</TableCell>
                        <TableCell>Match Score</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell>{match.id}</TableCell>
                          <TableCell>{match.student_id}</TableCell>
                          <TableCell>{match.internship_id}</TableCell>
                          <TableCell>{(match.match_score * 100).toFixed(1)}%</TableCell>
                          <TableCell>
                            <Chip
                              label={match.status}
                              color={getStatusColor(match.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: '', type: '' })}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action} {confirmDialog.type === 'all' ? 'ALL data' : confirmDialog.type}?
            {confirmDialog.type === 'all' && ' This action cannot be undone!'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', type: '' })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleClearData(confirmDialog.type)}
            color="error"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Settings