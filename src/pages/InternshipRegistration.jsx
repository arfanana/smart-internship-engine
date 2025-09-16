import { useState, useEffect } from 'react'
import {
  Container, Typography, TextField, Button, Grid, Card, CardContent, MenuItem, Chip, Box
} from '@mui/material'
import axios from 'axios'

function InternshipRegistration() {
  const [formData, setFormData] = useState({
    employer_id: '',
    title: '',
    description: '',
    required_skills: [],
    min_cgpa: '',
    min_year: '',
    positions_available: '',
    domain: ''
  })
  const [employers, setEmployers] = useState([])
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      const response = await axios.get('/api/admin/employers/')
      setEmployers(response.data)
    } catch (error) {
      console.error('Error fetching employers:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, required_skills: [...formData.required_skills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setFormData({ ...formData, required_skills: formData.required_skills.filter(s => s !== skill) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/internships/', formData)
      alert('Internship registered successfully!')
      setFormData({
        employer_id: '',
        title: '',
        description: '',
        required_skills: [],
        min_cgpa: '',
        min_year: '',
        positions_available: '',
        domain: ''
      })
    } catch (error) {
      console.error('Error registering internship:', error)
      alert('Error registering internship')
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Internship Registration</Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Employer"
                  name="employer_id"
                  value={formData.employer_id}
                  onChange={handleChange}
                  required
                >
                  {employers.map(employer => (
                    <MenuItem key={employer.id} value={employer.id}>
                      {employer.company_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum CGPA"
                  name="min_cgpa"
                  type="number"
                  step="0.01"
                  value={formData.min_cgpa}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Year of Study"
                  name="min_year"
                  type="number"
                  value={formData.min_year}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Positions Available"
                  name="positions_available"
                  type="number"
                  value={formData.positions_available}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Required Skills</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Skill"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button variant="contained" onClick={addSkill}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.required_skills.map(skill => (
                    <Chip key={skill} label={skill} onDelete={() => removeSkill(skill)} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Register Internship
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default InternshipRegistration