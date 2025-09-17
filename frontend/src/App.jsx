import { Routes, Route, Link } from 'react-router-dom'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { useState } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import WorkIcon from '@mui/icons-material/Work'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SettingsIcon from '@mui/icons-material/Settings'

import AdminDashboard from './pages/AdminDashboard'
import SaaSDashboard from './pages/SaaSDashboard'
import StudentRegistration from './pages/StudentRegistration'
import InternshipRegistration from './pages/InternshipRegistration'
import ResumeUpload from './pages/ResumeUpload'
import MatchFinder from './pages/MatchFinder'
import Settings from './pages/Settings'

const drawerWidth = 240

function App() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'SaaS Dashboard', icon: <DashboardIcon />, path: '/saas-dashboard' },
    { text: 'Admin Dashboard', icon: <AdminPanelSettingsIcon />, path: '/' },
    { text: 'Student Registration', icon: <PersonAddIcon />, path: '/student-registration' },
    { text: 'Internship Registration', icon: <WorkIcon />, path: '/internship-registration' },
    { text: 'Resume Upload', icon: <UploadFileIcon />, path: '/resume-upload' },
    { text: 'Find Matches', icon: <SearchIcon />, path: '/match-finder' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ]

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.4rem',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.3px',
            lineHeight: 1.2,
            textAlign: 'center',
            wordWrap: 'break-word',
            maxWidth: '100%'
          }}
        >
          🎯 Smart Internship<br />Allocation Engine
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Smart Internship Allocation Engine
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/saas-dashboard" element={<SaaSDashboard />} />
          <Route path="/student-registration" element={<StudentRegistration />} />
          <Route path="/internship-registration" element={<InternshipRegistration />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/match-finder" element={<MatchFinder />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App