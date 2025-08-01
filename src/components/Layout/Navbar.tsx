import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme as muiUseTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import ThemeToggle from '../UI/ThemeToggle';
import {
  AccountCircle,
  Dashboard,
  Calculate,
  Login,
  Logout,
  Home,
  Apps,
  Settings,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const muiTheme = muiUseTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    // { label: 'Compare Loans', path: '/compare', icon: <Compare /> }, // Removed as per request
    { label: 'EMI Calculator', path: '/emi-calculator', icon: <Calculate /> },
    { label: 'Eligibility Checker', path: '/eligibility-checker', icon: <Calculate /> },
  ];

  const userMenuItems = user ? [
    {
      label: 'Dashboard',
      path: user.role === 'admin' ? '/admin-dashboard' :
            user.role === 'broker' ? '/broker-dashboard' :
            user.role === 'builder' ? '/builder-dashboard' : '/customer-dashboard',
      icon: <Dashboard />
    },
    { label: 'Applications', path: '/applications', icon: <Apps /> },
    { label: 'Profile', path: '/profile', icon: <Person /> },
    { label: 'Settings', path: '/settings', icon: <Settings /> },
  ] : [];

  // Determine dashboard path based on user role
  const dashboardPath = user
    ? user.role === 'admin'
      ? '/admin-dashboard'
      : user.role === 'broker'
        ? '/broker-dashboard'
        : user.role === 'builder'
          ? '/builder-dashboard'
          : '/customer-dashboard'
    : '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              HomeLoanMittra
            </Typography>
          </ListItem>
          <Divider />

          {menuItems.map((item) => (
            <ListItem key={item.label}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}

          {user && (
            <>
              <Divider />
              {userMenuItems.map((item) => (
                <ListItem key={item.label}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider />
              <ListItem>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon><Logout /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          {!user && (
            <>
              <Divider />
              <ListItem>
                <ListItemButton onClick={() => handleNavigation('/login')}>
                  <ListItemIcon><Login /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: scrolled
            ? (isDark
                ? 'rgba(15,22,43,0.85)'
                : 'rgba(255,255,255,0.85)')
            : (isDark ? '#0f162b' : '#fff'),
          color: isDark ? '#fff' : '#222',
          boxShadow: '0 2px 12px 0 rgba(30,41,59,0.10)',
          transition: 'background-color 0.3s cubic-bezier(.4,0,.2,1)',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
        }}
      >
        <Toolbar sx={{ minHeight: 72, px: 0 }}>
          {/* Logo and Business Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              minWidth: 260,
              pl: 1,
              flexShrink: 0
            }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Home Loan Mittra Logo"
              sx={{
                height: 48,
                width: 'auto',
                maxWidth: 120,
                borderRadius: 2,
                boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
                objectFit: 'contain',
                display: 'block'
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#60a5fa' : '#1976d2', lineHeight: 1, fontSize: 24 }}>
                Home Loan Mittra
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#CBD5E1' : '#64748B', fontWeight: 500, letterSpacing: 1 }}>
                MAKING HOME LOANS EFFORTLESS
              </Typography>
            </Box>
          </Box>

          {/* Spacer to push nav to right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation Headings to right */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, pr: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.06)') : 'transparent',
                    color: isDark ? '#fff' : '#222',
                    fontWeight: 500,
                    fontSize: 14,
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.7,
                    minWidth: 0,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(30,41,59,0.10)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* User Menu (avatar) */}
              {user && (
                <Box sx={{ ml: 1 }}>
                  <Tooltip title="Account settings">
  <IconButton
    onClick={handleProfileMenuOpen}
    size="small"
    sx={{ ml: 1 }}
    aria-controls={anchorEl ? 'account-menu' : undefined}
    aria-haspopup="true"
    aria-expanded={anchorEl ? 'true' : undefined}
  >
    <Avatar sx={{ width: 32, height: 32, backgroundColor: '#fff', color: '#1976d2', fontWeight: 700 }}>
      {(user.firstName || user.name) ? (user.firstName || user.name).charAt(0).toUpperCase() : 'U'}
    </Avatar>
  </IconButton>
</Tooltip>
<Menu
  anchorEl={anchorEl}
  id="account-menu"
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  disableScrollLock
  PaperProps={{
    elevation: 2,
    sx: {
      mt: 1.5,
      minWidth: 180,
      borderRadius: 2,
      boxShadow: '0 4px 24px 0 rgba(30,41,59,0.18)',
      bgcolor: isDark ? '#232b3b' : '#fff',
      color: isDark ? '#fff' : '#222',
      p: 0,
    },
  }}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
  <MenuItem onClick={() => { handleMenuClose(); navigate(dashboardPath); }}>
    <ListItemIcon>
      <Dashboard fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </MenuItem>
  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
    <ListItemIcon>
      <Person fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Profile" />
  </MenuItem>
  <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
    <ListItemIcon>
      <Settings fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Settings" />
  </MenuItem>
  <MenuItem onClick={() => { handleMenuClose(); navigate('/support'); }}>
    <ListItemIcon>
      <AccountCircle fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Support" />
  </MenuItem>
  <Divider sx={{ my: 1, bgcolor: isDark ? '#374151' : '#e0e0e0' }} />
  <MenuItem onClick={handleLogout}>
    <ListItemIcon>
      <Logout fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </MenuItem>
</Menu>
                </Box>
              )}
              {/* Theme Toggle at extreme right */}
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
                <ThemeToggle />
              </Box>
            </Box>
          )}

          {/* Remove Login button from Navbar */}

        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {renderMobileDrawer()}
    </>
  );
};

export default Navbar;