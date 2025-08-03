import React from 'react';
import { Typography, Stack, Box, Paper, Chip, Button, useTheme } from '@mui/material';
import { Article, CalendarToday, TrendingUp, Business } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const NewsroomPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const newsArticles = [
    {
      id: 1,
      title: 'RBI Keeps Repo Rate Unchanged at 6.5% - Impact on Home Loans',
      excerpt:
        'Reserve Bank of India maintains the policy repo rate at 6.5%, providing stability to home loan interest rates across the banking sector.',
      date: '2025-08-01',
      category: 'RBI Policy',
      readTime: '4 min read',
      featured: true,
    },
    {
      id: 2,
      title: 'RBI Issues New Guidelines for Digital Home Loan Processing',
      excerpt:
        'Central bank releases comprehensive framework for digital onboarding and loan approval processes to enhance customer experience.',
      date: '2025-07-28',
      category: 'Digital Banking',
      readTime: '5 min read',
      featured: true,
    },
    {
      id: 3,
      title: 'RBI Announces Relaxation in Home Loan Risk Weights',
      excerpt:
        'Risk weight for housing loans up to ₹75 lakh reduced from 35% to 30%, potentially leading to lower interest rates.',
      date: '2025-07-20',
      category: 'Regulatory',
      readTime: '3 min read',
      featured: false,
    },
    {
      id: 4,
      title: 'New RBI Circular on PMAY-Linked Home Loan Benefits',
      excerpt:
        'Updated guidelines for Pradhan Mantri Awas Yojana beneficiaries with enhanced subsidy calculation methods.',
      date: '2025-07-15',
      category: 'Government Schemes',
      readTime: '4 min read',
      featured: false,
    },
    {
      id: 5,
      title: 'RBI Mandates Better Home Loan Transparency',
      excerpt:
        'New regulations require lenders to provide comprehensive cost breakdowns and clearer terms to borrowers.',
      date: '2025-07-10',
      category: 'Consumer Protection',
      readTime: '3 min read',
      featured: false,
    },
    {
      id: 6,
      title: "RBI's Priority Sector Lending Norms Updated for Housing",
      excerpt:
        'Revised guidelines increase housing finance allocation under priority sector lending, boosting affordable housing.',
      date: '2025-07-05',
      category: 'Priority Sector',
      readTime: '4 min read',
      featured: false,
    },
    {
      id: 7,
      title: 'RBI Working Group Report on Housing Finance',
      excerpt:
        'Comprehensive recommendations to strengthen housing finance ecosystem and improve credit flow to the sector.',
      date: '2025-06-30',
      category: 'Research',
      readTime: '6 min read',
      featured: false,
    },
    {
      id: 8,
      title: 'RBI Allows Higher LTV Ratios for Green Housing',
      excerpt:
        'Loan-to-value ratios increased to 90% for energy-efficient homes to promote sustainable housing development.',
      date: '2025-06-25',
      category: 'Green Finance',
      readTime: '3 min read',
      featured: false,
    },
  ];

  const content = (
    <Stack spacing={4}>
      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        RBI Home Loan News & Updates
      </Typography>

      <Typography variant='body1' paragraph sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
        Stay updated with the latest RBI policies, guidelines, and regulations affecting home loans
        in India. Get insights into monetary policy decisions, regulatory changes, and their impact
        on borrowers.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <Article sx={{ color: '#304FFE', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Policy Updates
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Latest RBI monetary policy and regulatory changes
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <TrendingUp sx={{ color: '#00C8C8', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Market Impact
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            Analysis of policy impact on home loan rates
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          }}
        >
          <Business sx={{ color: '#FFA726', fontSize: 40, mb: 2 }} />
          <Typography
            variant='h6'
            sx={{ fontWeight: 600, mb: 1, color: isDarkMode ? '#fff' : '#2E2E2E' }}
          >
            Regulatory Guidelines
          </Typography>
          <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
            New RBI guidelines and compliance requirements
          </Typography>
        </Paper>
      </Box>

      <Typography variant='h5' component='h2' sx={{ color: '#304FFE', fontWeight: 600 }}>
        Latest News & Updates
      </Typography>

      <Stack spacing={3}>
        {newsArticles.map(article => (
          <Paper
            key={article.id}
            elevation={article.featured ? 3 : 2}
            sx={{
              p: 3,
              border: article.featured ? '2px solid #304FFE' : 'none',
              position: 'relative',
              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
              borderColor: article.featured ? '#304FFE' : isDarkMode ? '#333' : '#e0e0e0',
            }}
          >
            {article.featured && (
              <Chip
                label='Featured'
                size='small'
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: '#304FFE',
                  color: '#fff',
                }}
              />
            )}

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant={article.featured ? 'h5' : 'h6'}
                  sx={{
                    fontWeight: 600,
                    color: article.featured ? '#304FFE' : isDarkMode ? '#fff' : '#2E2E2E',
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {article.title}
                </Typography>

                <Typography
                  variant='body2'
                  sx={{ color: isDarkMode ? '#b0b0b0' : '#666', mb: 2, lineHeight: 1.6 }}
                >
                  {article.excerpt}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexWrap: 'wrap',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 16, color: isDarkMode ? '#b0b0b0' : '#666' }} />
                    <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                      {new Date(article.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Chip
                    label={article.category}
                    size='small'
                    sx={{
                      backgroundColor: '#304FFE',
                      color: '#fff',
                      border: 'none',
                    }}
                    variant='filled'
                  />

                  <Typography variant='body2' sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                    {article.readTime}
                  </Typography>
                </Box>

                <Button
                  variant={article.featured ? 'contained' : 'outlined'}
                  size='small'
                  sx={{
                    backgroundColor: article.featured ? '#304FFE' : 'transparent',
                    color: article.featured ? '#fff' : '#304FFE',
                    borderColor: '#304FFE',
                    '&:hover': {
                      backgroundColor: article.featured ? '#1976d2' : 'rgba(48, 79, 254, 0.1)',
                      borderColor: '#304FFE',
                    },
                  }}
                  onClick={() =>
                    window.open(
                      'mailto:media@homeloanmittra.com?subject=Press Release Request',
                      '_blank'
                    )
                  }
                >
                  Read Full Article
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
          textAlign: 'center',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant='h6'
          sx={{ fontWeight: 600, mb: 2, color: isDarkMode ? '#fff' : '#2E2E2E' }}
        >
          Media Inquiries
        </Typography>
        <Typography variant='body1' sx={{ mb: 3, color: isDarkMode ? '#b0b0b0' : '#666' }}>
          For press releases, media kits, or interview requests, please contact our media team.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent='center'>
          <Button
            variant='contained'
            sx={{
              backgroundColor: '#304FFE',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
            onClick={() =>
              window.open('mailto:media@homeloanmittra.com?subject=Media Inquiry', '_blank')
            }
          >
            Contact Media Team
          </Button>
          <Button
            variant='outlined'
            sx={{
              borderColor: '#FFA726',
              color: '#FFA726',
              '&:hover': {
                borderColor: '#FFA726',
                backgroundColor: isDarkMode
                  ? 'rgba(255, 167, 38, 0.1)'
                  : 'rgba(255, 167, 38, 0.05)',
              },
            }}
            onClick={() =>
              window.open('mailto:media@homeloanmittra.com?subject=Press Kit Request', '_blank')
            }
          >
            Download Press Kit
          </Button>
        </Stack>
      </Paper>

      <Typography variant='h5' component='h2' sx={{ color: '#1976d2', fontWeight: 600 }}>
        Company Highlights
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          textAlign: 'center',
        }}
      >
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ color: '#1976d2', fontWeight: 700, mb: 1 }}>
            10K+
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Happy Customers
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ color: '#28a745', fontWeight: 700, mb: 1 }}>
            ₹50 Cr+
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Loans Disbursed
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
            50+
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Partner Banks
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant='h4' sx={{ color: '#dc3545', fontWeight: 700, mb: 1 }}>
            50+
          </Typography>
          <Typography variant='body2' sx={{ color: '#666' }}>
            Cities Covered
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant='h6' sx={{ color: '#1976d2', fontWeight: 600, mb: 3 }}>
          Follow Our Journey
        </Typography>

        <Typography variant='body1' paragraph>
          Stay connected with HomeLoanMittra&apos;s growth story and get the latest updates on our
          social media channels:
        </Typography>

        <Stack spacing={2}>
          <Typography variant='body2'>
            • <strong>LinkedIn:</strong> Follow us for professional updates and industry insights
          </Typography>
          <Typography variant='body2'>
            • <strong>Twitter:</strong> Real-time updates and customer success stories
          </Typography>
          <Typography variant='body2'>
            • <strong>YouTube:</strong> Educational content and product demonstrations
          </Typography>
          <Typography variant='body2'>
            • <strong>Blog:</strong> In-depth articles on home loans and financial planning
          </Typography>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant='body2' sx={{ color: '#666' }}>
          For the latest updates, subscribe to our newsletter or follow us on social media.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <GenericPage title='RBI Home Loan News' content={content} breadcrumb='RBI Updates & Policies' />
  );
};

export default NewsroomPage;
