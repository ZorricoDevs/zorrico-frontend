import React from 'react';
import { Typography, Stack, Box, Paper, Button, Chip, useTheme } from '@mui/material';
import { Home, TrendingDown, Speed, Verified, Calculate, CompareArrows } from '@mui/icons-material';
import GenericPage from '../components/UI/GenericPage';

const HomeLoansPage: React.FC = () => {

  const loanTypes = [
    {
      title: 'Purchase Home Loan',
      description: 'Finance your dream home with competitive interest rates and flexible tenure options.',
      features: ['Up to 90% LTV', 'Tenure up to 30 years', 'No prepayment penalty'],
      minRate: '8.50%',
      icon: <Home sx={{ fontSize: 40, color: '#304FFE' }} />
    },
    {
      title: 'Home Loan Balance Transfer',
      description: 'Transfer your existing home loan to get better rates and save on EMIs.',
      features: ['Lower interest rates', 'Top-up facility', 'Quick processing'],
      minRate: '8.25%',
      icon: <CompareArrows sx={{ fontSize: 40, color: '#00C8C8' }} />
    },
    {
      title: 'Construction Home Loan',
      description: 'Fund the construction of your home with stage-wise disbursement facility.',
      features: ['Stage-wise disbursement', 'Flexible repayment', 'No EMI during construction'],
      minRate: '8.75%',
      icon: <Home sx={{ fontSize: 40, color: '#FFA726' }} />
    },
    {
      title: 'Home Improvement Loan',
      description: 'Renovate or improve your existing home with quick approval and minimal documentation.',
      features: ['Quick approval', 'Minimal documentation', 'Flexible tenure'],
      minRate: '9.00%',
      icon: <Home sx={{ fontSize: 40, color: '#dc3545' }} />
    }
  ];

  const keyFeatures = [
    {
      icon: <TrendingDown sx={{ fontSize: 32, color: '#28a745' }} />,
      title: 'Lowest Interest Rates',
      description: 'Starting from 8.25% with competitive rates from 50+ lenders'
    },
    {
      icon: <Speed sx={{ fontSize: 32, color: '#1976d2' }} />,
      title: 'Quick Approval',
      description: 'Get pre-approved in 24-48 hours with our digital process'
    },
    {
      icon: <Verified sx={{ fontSize: 32, color: '#ff9800' }} />,
      title: 'Minimal Documentation',
      description: 'Simplified paperwork with digital document verification'
    },
    {
      icon: <Calculate sx={{ fontSize: 32, color: '#dc3545' }} />,
      title: 'EMI Calculator',
      description: 'Plan your finances with our advanced EMI and eligibility calculators'
    }
  ];

  const eligibilityCriteria = [
    { criteria: 'Age', requirement: '21-65 years' },
    { criteria: 'Income', requirement: 'Min ₹25,000/month' },
    { criteria: 'Credit Score', requirement: '650 and above' },
    { criteria: 'Employment', requirement: 'Salaried/Self-employed' },
    { criteria: 'Property Value', requirement: 'As per bank norms' }
  ];

  const content = (
    <Stack spacing={4}>
      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Home Loans Made Simple
      </Typography>

      <Typography variant="body1" paragraph>
        Make your dream of homeownership a reality with HomeLoanMittra&apos;s comprehensive home loan solutions.
        Compare offers from 50+ banks and NBFCs to find the best rates and terms that suit your needs.
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        textAlign: 'center',
        mb: 4
      }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700, mb: 1 }}>
            8.25%*
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Starting Interest Rate
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ color: '#28a745', fontWeight: 700, mb: 1 }}>
            90%
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Loan to Value Ratio
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 700, mb: 1 }}>
            30 Yrs
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Maximum Tenure
          </Typography>
        </Paper>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ color: '#dc3545', fontWeight: 700, mb: 1 }}>
            50+
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Partner Lenders
          </Typography>
        </Paper>
      </Box>

      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Types of Home Loans
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {loanTypes.map((loan, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {loan.icon}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {loan.title}
                </Typography>
                <Chip
                  label={`Starting ${loan.minRate} p.a.*`}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
              {loan.description}
            </Typography>

            <Stack spacing={1} sx={{ mb: 3 }}>
              {loan.features.map((feature, idx) => (
                <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    mr: 1,
                    flexShrink: 0
                  }} />
                  {feature}
                </Typography>
              ))}
            </Stack>

            <Button variant="outlined" size="small" fullWidth>
              Check Eligibility
            </Button>
          </Paper>
        ))}
      </Box>

      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Why Choose HomeLoanMittra?
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        {keyFeatures.map((feature, index) => (
          <Paper key={index} elevation={1} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {feature.icon}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Eligibility Criteria
      </Typography>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Basic Requirements
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {eligibilityCriteria.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {item.criteria}:
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                {item.requirement}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Additional Requirements:
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            • Property should be approved by local authorities<br/>
            • Clear property title and necessary approvals<br/>
            • Property insurance as per lender requirements<br/>
            • Co-applicant may be required based on income
          </Typography>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" sx={{ color: '#1976d2', fontWeight: 600 }}>
        Required Documents
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
            Identity & Address Proof
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Aadhaar Card</Typography>
            <Typography variant="body2">• PAN Card</Typography>
            <Typography variant="body2">• Passport/Voter ID</Typography>
            <Typography variant="body2">• Driving License</Typography>
          </Stack>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
            Income Proof
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Salary Slips (3 months)</Typography>
            <Typography variant="body2">• Bank Statements (6 months)</Typography>
            <Typography variant="body2">• Form 16/ITR (2 years)</Typography>
            <Typography variant="body2">• Employment Certificate</Typography>
          </Stack>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
            Property Documents
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Sale Agreement</Typography>
            <Typography variant="body2">• Property Papers</Typography>
            <Typography variant="body2">• NOC from Builder</Typography>
            <Typography variant="body2">• Approved Building Plan</Typography>
          </Stack>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
            Additional Documents
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">• Property Valuation Report</Typography>
            <Typography variant="body2">• Insurance Documents</Typography>
            <Typography variant="body2">• Processing Fee Receipt</Typography>
            <Typography variant="body2">• Passport Size Photos</Typography>
          </Stack>
        </Paper>
      </Box>

      <Paper elevation={2} sx={{ p: 4, backgroundColor: '#f8f9fa', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Ready to Apply for Your Home Loan?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Get instant pre-approval and compare offers from 50+ lenders in minutes.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button variant="contained" size="large">
            Check Eligibility
          </Button>
          <Button variant="outlined" size="large">
            Calculate EMI
          </Button>
          <Button variant="outlined" size="large">
            Compare Loans
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          *Interest rates are subject to change and depend on credit profile, loan amount, and lender policies.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <GenericPage
      title="Home Loans"
      content={content}
      breadcrumb="Home Loan Products & Services"
    />
  );
};

export default HomeLoansPage;
