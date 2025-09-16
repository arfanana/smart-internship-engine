import { useState } from 'react'
import {
  Container, Typography, TextField, Button, Grid, Card, CardContent, Chip, Box
} from '@mui/material'
import axios from 'axios'

function StudentRegistration() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    degree: '',
    year_of_study: '',
    cgpa: '',
    skills: [],
    preferences: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [preferenceInput, setPreferenceInput] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] })
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
  }

  const addPreference = () => {
    if (preferenceInput.trim()) {
      setFormData({ ...formData, preferences: [...formData.preferences, preferenceInput.trim()] })
      setPreferenceInput('')
    }
  }

  const removePreference = (preference) => {
    setFormData({ ...formData, preferences: formData.preferences.filter(p => p !== preference) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/students/', formData)
      alert('Student registered successfully!')
      setFormData({
        email: '',
        full_name: '',
        degree: '',
        year_of_study: '',
        cgpa: '',
        skills: [],
        preferences: []
      })
    } catch (error) {
      console.error('Error registering student:', error)
      alert('Error registering student')
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Student Registration</Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year of Study"
                  name="year_of_study"
                  type="number"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CGPA"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  value={formData.cgpa}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Skills</Typography>
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
                  {formData.skills.map(skill => (
                    <Chip key={skill} label={skill} onDelete={() => removeSkill(skill)} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Preferences</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Preference"
                    value={preferenceInput}
                    onChange={(e) => setPreferenceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreference())}
                  />
                  <Button variant="contained" onClick={addPreference}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.preferences.map(preference => (
                    <Chip key={preference} label={preference} onDelete={() => removePreference(preference)} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Register Student
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default StudentRegistration