import { useState } from 'react'
import {
  Container, Typography, Button, Card, CardContent, Grid, TextField, Chip, Box, LinearProgress
} from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import axios from 'axios'

function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    degree: '',
    year_of_study: '',
    cgpa: '',
    skills: [],
    preferences: []
  })

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await axios.post('/api/upload_resume/', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setExtractedData(response.data.extracted_data)
      setFormData({
        ...response.data.extracted_data,
        skills: response.data.extracted_data.skills || [],
        preferences: []
      })
    } catch (error) {
      console.error('Error uploading resume:', error)
      alert('Error uploading resume')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] })
    }
  }

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) })
  }

  const addPreference = () => {
    const preference = prompt('Enter preference:')
    if (preference && !formData.preferences.includes(preference)) {
      setFormData({ ...formData, preferences: [...formData.preferences, preference] })
    }
  }

  const removePreference = (preference) => {
    setFormData({ ...formData, preferences: formData.preferences.filter(p => p !== preference) })
  }

  const handleSave = async () => {
    try {
      await axios.post('/api/students/', formData)
      alert('Student data saved successfully!')
      setExtractedData(null)
      setFile(null)
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
      console.error('Error saving student:', error)
      alert('Error saving student')
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Resume Upload</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                accept=".pdf,.docx"
                style={{ display: 'none' }}
                id="resume-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ height: 56 }}
                >
                  {file ? file.name : 'Choose Resume File (PDF or DOCX)'}
                </Button>
              </label>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || loading}
                fullWidth
              >
                {loading ? 'Processing...' : 'Upload and Parse Resume'}
              </Button>
            </Grid>
            {loading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {extractedData && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>Extracted Information</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please review and edit the extracted data before saving.
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
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
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {formData.skills.map(skill => (
                    <Chip key={skill} label={skill} onDelete={() => removeSkill(skill)} />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  label="Add Skill"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill(e.target.value)
                      e.target.value = ''
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Preferences</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {formData.preferences.map(preference => (
                    <Chip key={preference} label={preference} onDelete={() => removePreference(preference)} />
                  ))}
                </Box>
                <Button variant="outlined" onClick={addPreference}>Add Preference</Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSave} fullWidth>
                  Save Student Data
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

export default ResumeUpload