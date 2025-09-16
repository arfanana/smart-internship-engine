import { useState, useEffect } from 'react'
import {
  Container, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import axios from 'axios'

function AdminDashboard() {
  const [students, setStudents] = useState([])
  const [internships, setInternships] = useState([])
  const [employers, setEmployers] = useState([])
  const [matches, setMatches] = useState([])
  const [open, setOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, internshipsRes, employersRes, matchesRes] = await Promise.all([
        axios.get('/api/admin/students/'),
        axios.get('/api/admin/internships/'),
        axios.get('/api/admin/employers/'),
        axios.get('/api/admin/matches/')
      ])
      setStudents(studentsRes.data)
      setInternships(internshipsRes.data)
      setEmployers(employersRes.data)
      setMatches(matchesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type })
    setFormData(item)
    setOpen(true)
  }

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`/api/admin/${type}/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleSave = async () => {
    try {
      if (editingItem.id) {
        await axios.put(`/api/admin/${editingItem.type}/${editingItem.id}`, formData)
      }
      setOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error saving item:', error)
    }
  }

  const renderTable = (data, columns, type) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col}>{col}</TableCell>)}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              {columns.map(col => <TableCell key={col}>{item[col.toLowerCase().replace(' ', '_')]}</TableCell>)}
              <TableCell>
                <IconButton onClick={() => handleEdit(item, type)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(item.id, type)}><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Students ({students.length})</Typography>
              {renderTable(students, ['ID', 'Email', 'Full Name', 'Degree', 'CGPA'], 'students')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Internships ({internships.length})</Typography>
              {renderTable(internships, ['ID', 'Title', 'Domain', 'Min CGPA', 'Positions'], 'internships')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Employers ({employers.length})</Typography>
              {renderTable(employers, ['ID', 'Email', 'Company Name', 'Industry'], 'employers')}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Matches ({matches.length})</Typography>
              {renderTable(matches, ['ID', 'Student ID', 'Internship ID', 'Match Score', 'Status'], 'matches')}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit {editingItem?.type}</DialogTitle>
        <DialogContent>
          {Object.keys(formData).map(key => (
            <TextField
              key={key}
              margin="dense"
              label={key}
              fullWidth
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AdminDashboard