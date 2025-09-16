import { useState } from 'react'
import {
  Container, Typography, TextField, Button, Card, CardContent, Grid, Chip, Box
} from '@mui/material'
import { Search } from '@mui/icons-material'
import axios from 'axios'

function MatchFinder() {
  const [studentId, setStudentId] = useState('')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!studentId) return

    setLoading(true)
    try {
      const response = await axios.get(`/api/matches/${studentId}`)
      setMatches(response.data)
    } catch (error) {
      console.error('Error fetching matches:', error)
      alert('Error fetching matches. Please check the student ID.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Find Internship Matches</Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={!studentId || loading}
                startIcon={<Search />}
                fullWidth
                sx={{ height: 56 }}
              >
                {loading ? 'Searching...' : 'Find Matches'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Top Matches</Typography>
          <Grid container spacing={3}>
            {matches.map((match, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {match.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {match.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {match.required_skills.map(skill => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        Domain: {match.domain}
                      </Typography>
                      <Chip
                        label={`Match: ${(match.match_score * 100).toFixed(1)}%`}
                        color={match.match_score > 0.7 ? 'success' : match.match_score > 0.5 ? 'warning' : 'error'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {matches.length === 0 && studentId && !loading && (
        <Typography variant="body1" color="text.secondary" align="center">
          No matches found for this student.
        </Typography>
      )}
    </Container>
  )
}

export default MatchFinder