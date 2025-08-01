import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  useTheme
} from '@mui/material';
import { Home, ArrowForward } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface GenericPageProps {
  title: string;
  content: React.ReactNode;
  breadcrumb?: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ title, content, breadcrumb }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        py: 4,
        backgroundColor: isDarkMode ? theme.palette.background.default : '#F5F7FA',
        minHeight: 'calc(100vh - 200px)'
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs
          sx={{
            mb: 3,
            '& .MuiBreadcrumbs-separator': {
              color: isDarkMode ? theme.palette.text.secondary : '#304FFE'
            }
          }}
          separator={<ArrowForward fontSize="small" />}
        >
          <Link
            underline="hover"
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: isDarkMode ? theme.palette.text.secondary : '#304FFE',
              '&:hover': {
                color: '#FFA726'
              }
            }}
          >
            <Home sx={{ mr: 0.5, color: '#304FFE' }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{
              color: isDarkMode ? theme.palette.text.primary : '#2E2E2E',
              fontWeight: 500
            }}
          >
            {breadcrumb || title}
          </Typography>
        </Breadcrumbs>

        {/* Main Content */}
        <Paper
          elevation={isDarkMode ? 4 : 2}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: isDarkMode ? theme.palette.background.paper : '#FFFFFF',
            border: isDarkMode ? '1px solid rgba(48, 79, 254, 0.12)' : 'none'
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#304FFE',
              mb: 3,
              textAlign: 'center'
            }}
          >
            {title}
          </Typography>

          <Divider
            sx={{
              mb: 4,
              borderColor: isDarkMode ? 'rgba(48, 79, 254, 0.12)' : 'rgba(48, 79, 254, 0.2)'
            }}
          />

          <Box sx={{ typography: 'body1', lineHeight: 1.8 }}>
            {content}
          </Box>
        </Paper>

        {/* Back to Home */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link
            href="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              color: '#304FFE',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
                color: '#FFA726'
              }
            }}
          >
            <Home sx={{ mr: 1, color: '#304FFE' }} />
            Back to Home
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default GenericPage;
