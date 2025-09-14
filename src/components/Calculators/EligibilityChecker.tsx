import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Button,
  Stack,
  Container,
  Slider,
} from '@mui/material';
import { TrendingUp, Calculate, AccountBalance } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FinanceLoader from '../UI/FinanceLoader';
import LoanApplicationPopup from '../UI/LoanApplicationPopup';
import { MetaPixelTracker } from '../../utils/metaPixel';

interface EligibilityCalculation {
  eligible: boolean;
  maxLoanAmount: number;
  emi: number;
  totalPayment: number;
  totalInterest: number;
  recommendedBanks: Array<{
    name: string;
    interestRate: string;
    processingFee: string;
    maxLoanAmount: number;
    specialFeatures: string[];
  }>;
  offerCount?: number;
  primaryMessage?: string;
  subMessage?: string;
  urgency?: string;
}

const EligibilityChecker: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [age, setAge] = useState(30);
  const [employmentType, setEmploymentType] = useState('salaried');
  const [existingLoans, setExistingLoans] = useState(0);
  const [creditScore, setCreditScore] = useState(750);
  const [requestedTenure, setRequestedTenure] = useState(20);
  const [calculation, setCalculation] = useState<EligibilityCalculation | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const calculateEligibility = useCallback(() => {
    try {
      // FOIR % based on annual income slabs (your exact specification)
      const annualIncome = monthlyIncome * 12;
      let foir = 0.55; // Default 55%

      if (annualIncome >= 300000 && annualIncome < 600000) {
        foir = 0.55; // 3-6 Lakh => 55%
      } else if (annualIncome >= 600000 && annualIncome < 1000000) {
        foir = 0.6; // 6-10 Lakh => 60%
      } else if (annualIncome >= 1000000 && annualIncome < 1800000) {
        foir = 0.65; // 10-18 Lakh => 65%
      } else if (annualIncome >= 1800000) {
        foir = 0.7; // 18 Lakh & Above => 70%
      }

      // Main eligibility formula: Net Salary * FOIR% - Obligations / Per Lakh EMI
      const netAvailableEMI = monthlyIncome * foir - existingLoans;

      if (netAvailableEMI <= 0) {
        setCalculation({
          eligible: false,
          maxLoanAmount: 0,
          emi: 0,
          totalPayment: 0,
          totalInterest: 0,
          recommendedBanks: [],
        });
        return;
      }

      // Per Lakh EMI calculation using your exact formula
      const P = 100000; // Principal = 1 lakh (fixed)
      const R = 9 / 12 / 100; // 9% annual rate converted to monthly decimal (9/12/100)
      const N = requestedTenure * 12; // Tenure in months (20*12 default)

      const perLakhEMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);

      if (isNaN(perLakhEMI) || perLakhEMI <= 0) {
        setCalculation({
          eligible: false,
          maxLoanAmount: 0,
          emi: 0,
          totalPayment: 0,
          totalInterest: 0,
          recommendedBanks: [],
        });
        return;
      }

      // Calculate max loan amount using your exact formula
      let maxLoanAmount = (netAvailableEMI / perLakhEMI) * 100000;
      maxLoanAmount = Math.floor(maxLoanAmount); // Round down for safety
      // Age validation
      const minAge = 23;
      let maxAge = 62;
      if (employmentType === 'self-employed' || employmentType === 'business') {
        maxAge = 70;
      }

      const ageValid = age >= minAge && age <= maxAge;

      // Always show offers regardless of credit score - make customers excited!
      const baseEligible = maxLoanAmount > 100000 && ageValid;

      // Generate credit score specific messaging and offers
      const getCreditScoreOffers = (score: number) => {
        if (score >= 750) {
          return {
            eligible: true,
            offerCount: 8,
            primaryMessage: '🎉 Excellent Credit! Premium Offers Available',
            subMessage: 'Get the best rates from top banks with instant approval',
            urgency: 'Limited time offer - Apply now!',
            banks: [
              {
                name: 'State Bank of India',
                interestRate: '7.25% - 7.75%',
                processingFee: '0.25%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.98),
                specialFeatures: [
                  'No prepayment penalty',
                  'Overdraft facility',
                  'Priority processing',
                ],
              },
              {
                name: 'HDFC Bank',
                interestRate: '7.35% - 7.85%',
                processingFee: '0.35%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.95),
                specialFeatures: ['Digital processing', 'Same day approval', 'Doorstep service'],
              },
              {
                name: 'ICICI Bank',
                interestRate: '7.30% - 7.80%',
                processingFee: '0.30%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.96),
                specialFeatures: [
                  'Online account management',
                  'Flexible EMI dates',
                  'Quick disbursement',
                ],
              },
              {
                name: 'Axis Bank',
                interestRate: '7.40% - 7.90%',
                processingFee: '0.40%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.94),
                specialFeatures: [
                  'Personal RM assigned',
                  'Free property valuation',
                  'EMI holiday option',
                ],
              },
            ],
          };
        } else if (score >= 700) {
          return {
            eligible: true,
            offerCount: 6,
            primaryMessage: '🌟 Great Credit Score! Multiple Offers Ready',
            subMessage: 'Competitive rates from leading banks await you',
            urgency: "Special rates available - Don't miss out!",
            banks: [
              {
                name: 'State Bank of India',
                interestRate: '7.50% - 8.25%',
                processingFee: '0.35%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.95),
                specialFeatures: ['No prepayment penalty after 1 year', 'Overdraft facility'],
              },
              {
                name: 'HDFC Bank',
                interestRate: '7.65% - 8.40%',
                processingFee: '0.45%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.92),
                specialFeatures: ['Digital processing', 'Quick approval', 'Online tracking'],
              },
              {
                name: 'ICICI Bank',
                interestRate: '7.60% - 8.35%',
                processingFee: '0.40%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.93),
                specialFeatures: [
                  'Online account management',
                  'Flexible EMI dates',
                  'Mobile banking',
                ],
              },
              {
                name: 'Punjab National Bank',
                interestRate: '7.75% - 8.50%',
                processingFee: '0.50%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.9),
                specialFeatures: [
                  'Government bank reliability',
                  'Pan India presence',
                  'Competitive rates',
                ],
              },
            ],
          };
        } else if (score >= 650) {
          return {
            eligible: true,
            offerCount: 5,
            primaryMessage: '✅ Good Credit! Bank Offers Available',
            subMessage: 'Multiple lenders ready to approve your application',
            urgency: 'Apply today to lock these rates!',
            banks: [
              {
                name: 'State Bank of India',
                interestRate: '7.75% - 8.50%',
                processingFee: '0.50%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.9),
                specialFeatures: [
                  'Trusted government bank',
                  'Wide branch network',
                  'Flexible terms',
                ],
              },
              {
                name: 'Bank of Baroda',
                interestRate: '7.85% - 8.60%',
                processingFee: '0.55%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.88),
                specialFeatures: ['Quick processing', 'Competitive rates', 'Personal assistance'],
              },
              {
                name: 'Punjab National Bank',
                interestRate: '7.90% - 8.65%',
                processingFee: '0.60%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.87),
                specialFeatures: [
                  'Government bank trust',
                  'Nationwide presence',
                  'Easy documentation',
                ],
              },
              {
                name: 'Union Bank of India',
                interestRate: '8.00% - 8.75%',
                processingFee: '0.65%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.85),
                specialFeatures: ['Merger benefits', 'Strong network', 'Customer focused'],
              },
            ],
          };
        } else if (score >= 600) {
          return {
            eligible: true,
            offerCount: 7,
            primaryMessage: '💪 Fair Credit - Multiple Options Available!',
            subMessage: "Don't worry! Several lenders specialize in your profile",
            urgency: 'Exclusive offers for improving credit profiles!',
            banks: [
              {
                name: 'HDFC Bank (Special Program)',
                interestRate: '8.25% - 9.25%',
                processingFee: '0.75%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.8),
                specialFeatures: [
                  'Credit improvement program',
                  'Dedicated support',
                  'Flexible eligibility',
                ],
              },
              {
                name: 'ICICI Bank (Growth Program)',
                interestRate: '8.40% - 9.40%',
                processingFee: '0.80%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.78),
                specialFeatures: [
                  'Progressive rate reduction',
                  'Credit counseling',
                  'Step-up loan facility',
                ],
              },
              {
                name: 'Axis Bank (Aspire Program)',
                interestRate: '8.50% - 9.50%',
                processingFee: '0.85%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.75),
                specialFeatures: [
                  'Fresh start program',
                  'Rate revision option',
                  'Credit building support',
                ],
              },
              {
                name: 'Yes Bank (Opportunity Plus)',
                interestRate: '8.75% - 9.75%',
                processingFee: '0.90%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.73),
                specialFeatures: [
                  'Second chance program',
                  'Gradual rate benefits',
                  'Personalized guidance',
                ],
              },
              {
                name: 'Kotak Mahindra Bank',
                interestRate: '8.85% - 9.85%',
                processingFee: '0.95%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.7),
                specialFeatures: [
                  'Flexible documentation',
                  'Quick approval',
                  'Credit score improvement tips',
                ],
              },
            ],
          };
        } else {
          // Even for very low credit scores, show exciting offers!
          return {
            eligible: true,
            offerCount: 9,
            primaryMessage: '🚀 Building Credit? Exclusive Programs Available!',
            subMessage: 'Special programs designed for credit building - Your dream home awaits!',
            urgency: 'Limited spots in credit building programs - Apply now!',
            banks: [
              {
                name: 'HDFC Bank (Fresh Start)',
                interestRate: '9.25% - 10.75%',
                processingFee: '1.00%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.6),
                specialFeatures: [
                  'Fresh start guarantee',
                  'Credit mentorship',
                  'No hidden charges',
                  'Rate review after 2 years',
                ],
              },
              {
                name: 'ICICI Bank (New Beginning)',
                interestRate: '9.50% - 11.00%',
                processingFee: '1.10%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.58),
                specialFeatures: [
                  'New beginning program',
                  'Credit rehabilitation',
                  'Progressive benefits',
                  'Free credit counseling',
                ],
              },
              {
                name: 'Axis Bank (Phoenix Program)',
                interestRate: '9.75% - 11.25%',
                processingFee: '1.20%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.55),
                specialFeatures: [
                  'Phoenix rise program',
                  'Credit restoration',
                  'Guaranteed approval*',
                  'Mentorship included',
                ],
              },
              {
                name: 'Yes Bank (Second Chance)',
                interestRate: '10.00% - 11.50%',
                processingFee: '1.25%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.53),
                specialFeatures: [
                  'Second chance initiative',
                  'Specialized team',
                  'Flexible terms',
                  'Success guarantee',
                ],
              },
              {
                name: 'IndusInd Bank (Fresh Credit)',
                interestRate: '10.25% - 11.75%',
                processingFee: '1.30%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.5),
                specialFeatures: [
                  'Fresh credit program',
                  'Personal banker',
                  'Credit improvement plan',
                  'Rate reduction promise',
                ],
              },
              {
                name: 'Kotak Mahindra (Rebuild)',
                interestRate: '10.50% - 12.00%',
                processingFee: '1.35%',
                maxLoanAmount: Math.round(maxLoanAmount * 0.48),
                specialFeatures: [
                  'Credit rebuild focus',
                  'Dedicated support',
                  'Transparent process',
                  'Future rate benefits',
                ],
              },
            ],
          };
        }
      };

      const offerData = getCreditScoreOffers(creditScore);
      const eligible = baseEligible && offerData.eligible;

      // Final EMI & interest calculations using same R and N values
      const finalEmi = (maxLoanAmount * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const totalPayment = finalEmi * N;
      const totalInterest = totalPayment - maxLoanAmount;

      // Use dynamic recommended banks based on credit score
      const recommendedBanks = baseEligible ? offerData.banks : [];

      setCalculation({
        eligible,
        maxLoanAmount: Math.round(maxLoanAmount),
        emi: Math.round(finalEmi),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        recommendedBanks,
        // Add additional data for enhanced UI
        offerCount: offerData.offerCount,
        primaryMessage: offerData.primaryMessage,
        subMessage: offerData.subMessage,
        urgency: offerData.urgency,
      });

      // Track eligibility check with Meta Pixel
      MetaPixelTracker.trackEligibilityCheck(monthlyIncome, Math.round(maxLoanAmount));
    } catch (error) {
      setCalculation({
        eligible: false,
        maxLoanAmount: 0,
        emi: 0,
        totalPayment: 0,
        totalInterest: 0,
        recommendedBanks: [],
        offerCount: 0,
        primaryMessage: 'Calculation Error',
        subMessage: 'Please check your inputs and try again',
        urgency: '',
      });
    }
  }, [monthlyIncome, age, employmentType, existingLoans, creditScore, requestedTenure]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Track Eligibility Checker page view
  useEffect(() => {
    MetaPixelTracker.trackViewContent('Eligibility Checker', 'calculator');
  }, []);

  useEffect(() => {
    calculateEligibility();
  }, [calculateEligibility]);

  if (loading) {
    return <FinanceLoader />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };

  // Prepare bank cards for rendering to avoid linter error
  let bankCards: React.ReactNode = null;
  if (calculation && calculation.recommendedBanks) {
    bankCards = calculation.recommendedBanks.map((bank, index) => {
      const interestColor = isDark ? '#81c784' : '#2e7d32';
      return (
        <Paper
          key={index}
          sx={{
            p: 2.5,
            borderRadius: 2,
            backgroundColor: isDark ? '#23272f' : '#fafafa',
            border: isDark ? '1px solid #444' : '1px solid #e0e0e0',
            color: isDark ? '#fff' : 'inherit',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Main Content Area */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            {/* Bank Logo/Icon */}
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                backgroundColor: index === 0 ? '#1976d2' : index === 1 ? '#d32f2f' : '#ff9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.5,
                filter: 'blur(6px)',
                flexShrink: 0,
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  filter: 'blur(6px)',
                  opacity: 0.5,
                }}
              >
                {bank.name}
              </Typography>
            </Box>

            {/* Bank Details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant='subtitle1'
                sx={{
                  fontWeight: 600,
                  color: isDark ? '#bbb' : 'text.primary',
                  fontSize: '1rem',
                  filter: 'blur(6px)',
                  opacity: 0.5,
                  mb: 0.5,
                }}
              >
                {bank.name}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  color: interestColor,
                  fontWeight: 500,
                  display: 'block',
                  fontSize: '0.875rem',
                }}
              >
                Interest Rate:{' '}
                <span style={{ color: interestColor, fontWeight: 600 }}>{bank.interestRate}</span>
              </Typography>
            </Box>

            {/* Apply Button */}
            <Button
              variant='contained'
              size='small'
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                backgroundColor: 'primary.main',
                color: 'white',
                minWidth: 80,
                fontSize: '0.85rem',
                flexShrink: 0,
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
              onClick={() => setOpenDialog(true)}
            >
              Apply
            </Button>
          </Box>

          {/* Special Features - Below main content */}
          <Box
            sx={{
              mt: 1,
              pt: 1.5,
              borderTop: isDark ? '1px solid #444' : '1px solid #e0e0e0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              {bank.specialFeatures.map((feature, featureIndex) => (
                <Box
                  key={featureIndex}
                  sx={{
                    backgroundColor: index === 0 ? '#4caf50' : index === 1 ? '#2196f3' : '#ff9800',
                    color: 'white',
                    px: 1,
                    py: 0.3,
                    borderRadius: 0.8,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {feature}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      );
    });
  }

  if (calculation === null) {
    return <FinanceLoader />;
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          Home Loan Eligibility Checker
        </Typography>
        <Typography
          variant='body1'
          sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}
        >
          Check your eligibility and get personalized loan offers from top banks
        </Typography>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 3, alignItems: { md: 'stretch' } }}>
        {/* Input Card */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            background: theme =>
              theme.palette.mode === 'dark' ? 'rgba(36,40,47,0.98)' : '#f5f7fa',
            border: theme =>
              theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
            overflow: 'hidden',
            height: '100%',
            minHeight: { md: '70vh' },
          }}
        >
          <Box
            sx={{
              background: 'none',
              p: 3,
              color: 'primary.main',
              borderBottom: theme =>
                theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              gap: 1,
            }}
          >
            <Calculate sx={{ mr: 1, fontSize: 24 }} />
            Personal & Property Details
          </Box>
          <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={2.5}>
              {/* Monthly Income with Slider */}
              <Box>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Monthly Income
                </Typography>
                <TextField
                  value={formatNumber(monthlyIncome)}
                  onChange={e => setMonthlyIncome(parseFormattedNumber(e.target.value))}
                  fullWidth
                  variant='outlined'
                  size='small'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        ₹
                      </Typography>
                    ),
                  }}
                />
                <Slider
                  value={monthlyIncome}
                  onChange={(_, value) => setMonthlyIncome(value as number)}
                  min={20000}
                  max={500000}
                  step={1000}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    ₹20K
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    ₹5L
                  </Typography>
                </Box>
              </Box>
              {/* Age and Employment Type */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}
                  >
                    Age
                  </Typography>
                  <TextField
                    type='number'
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    fullWidth
                    variant='outlined'
                    size='small'
                    inputProps={{ min: 18, max: 75 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme =>
                          theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant='body2'
                    sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}
                  >
                    Employment Type
                  </Typography>
                  <FormControl fullWidth size='small'>
                    <Select
                      value={employmentType}
                      onChange={e => setEmploymentType(e.target.value)}
                      variant='outlined'
                      sx={{
                        borderRadius: 2,
                        backgroundColor: theme =>
                          theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                      }}
                    >
                      <MenuItem value='salaried'>Salaried</MenuItem>
                      <MenuItem value='self-employed'>Self Employed</MenuItem>
                      <MenuItem value='business'>Business Owner</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              {/* Existing Loan EMIs with Slider */}
              <Box>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Existing Loan EMIs
                </Typography>
                <TextField
                  value={formatNumber(existingLoans)}
                  onChange={e => setExistingLoans(parseFormattedNumber(e.target.value))}
                  fullWidth
                  variant='outlined'
                  size='small'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>
                        ₹
                      </Typography>
                    ),
                  }}
                />
                <Slider
                  value={existingLoans}
                  onChange={(_, value) => setExistingLoans(value as number)}
                  min={0}
                  max={100000}
                  step={1000}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    ₹0
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    ₹1L
                  </Typography>
                </Box>
              </Box>
              {/* Credit Score with Slider */}
              <Box>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Credit Score (Optional)
                </Typography>
                <TextField
                  type='number'
                  value={creditScore}
                  onChange={e => setCreditScore(Number(e.target.value))}
                  fullWidth
                  variant='outlined'
                  size='small'
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                    },
                  }}
                />
                <Slider
                  value={creditScore}
                  onChange={(_, value) => setCreditScore(value as number)}
                  min={300}
                  max={900}
                  step={1}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    300
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    900
                  </Typography>
                </Box>
              </Box>
              {/* Removed Property Value and Down Payment fields */}
              {/* Loan Tenure */}
              <Box>
                <Typography variant='body2' sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Loan Tenure (Years)
                </Typography>
                <TextField
                  type='number'
                  value={requestedTenure}
                  onChange={e => setRequestedTenure(Number(e.target.value))}
                  fullWidth
                  variant='outlined'
                  size='small'
                  inputProps={{ min: 1, max: 30 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: theme =>
                        theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                    },
                  }}
                />
                <Slider
                  value={requestedTenure}
                  min={1}
                  max={30}
                  step={1}
                  onChange={(_, value) => setRequestedTenure(Number(value))}
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    1
                  </Typography>
                  <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    30
                  </Typography>
                </Box>
              </Box>
              {/* Remove Calculate Eligibility button */}
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            background: theme =>
              theme.palette.mode === 'dark' ? 'rgba(36,40,47,0.98)' : '#f5f7fa',
            border: theme =>
              theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
            overflow: 'hidden',
            height: '100%',
            minHeight: { md: '70vh' },
          }}
        >
          <Box
            sx={{
              background: 'none',
              p: 3,
              color: 'primary.main',
              borderBottom: theme =>
                theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '1.2rem',
              gap: 1,
            }}
          >
            <TrendingUp sx={{ mr: 1, fontSize: 24 }} />
            Eligibility Results
          </Box>
          <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {calculation && (
              <Box>
                {/* 2x2 Grid for Results */}
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr' }, gap: 2, mb: 3 }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: theme =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                          : 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)',
                      border: theme =>
                        theme.palette.mode === 'dark' ? '2px solid #3b82f6' : '2px solid #1976d2',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        color: theme => (theme.palette.mode === 'dark' ? '#e3f2fd' : '#1565c0'),
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Eligible Amount
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 700,
                        color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2'),
                      }}
                    >
                      {formatCurrency(calculation.maxLoanAmount)}
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: theme =>
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)'
                          : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
                      border: theme =>
                        theme.palette.mode === 'dark' ? '2px solid #ea580c' : '2px solid #ff9800',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        color: theme => (theme.palette.mode === 'dark' ? '#fff3e0' : '#e65100'),
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Monthly EMI
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 700,
                        color: theme => (theme.palette.mode === 'dark' ? '#ffffff' : '#ff9800'),
                      }}
                    >
                      {formatCurrency(calculation.emi)}
                    </Typography>
                  </Paper>
                </Box>
                {/* Dynamic Bank Offers Section */}
                <Typography
                  variant='h6'
                  sx={{
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 700,
                    color: 'primary.main',
                  }}
                >
                  <AccountBalance sx={{ mr: 1 }} />
                  {calculation.primaryMessage || 'Personalized Bank Offers'}
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: theme => (theme.palette.mode === 'dark' ? '#23272f' : '#fff'),
                    color: theme => (theme.palette.mode === 'dark' ? '#fff' : 'inherit'),
                    boxShadow: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        mb: 0.5,
                        fontWeight: 600,
                        color: theme =>
                          theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main',
                      }}
                    >
                      {calculation.subMessage || 'Exclusive Bank Partnerships'}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        mb: 0.5,
                        color: theme => (theme.palette.mode === 'dark' ? '#bbb' : 'text.secondary'),
                      }}
                    >
                      Comparing offers from{' '}
                      {calculation.offerCount || calculation.recommendedBanks.length}+ leading banks
                    </Typography>
                    {calculation.urgency && (
                      <Typography
                        variant='body2'
                        sx={{
                          color: theme => (theme.palette.mode === 'dark' ? '#ffab40' : '#f57c00'),
                          fontWeight: 600,
                          background: theme =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,171,64,0.1)'
                              : 'rgba(245,124,0,0.1)',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          display: 'inline-block',
                          mt: 1,
                        }}
                      >
                        ⚡ {calculation.urgency}
                      </Typography>
                    )}
                  </Box>
                  <Stack spacing={1.5}>{bankCards}</Stack>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant='contained'
          size='medium'
          onClick={() => {
            if (typeof window !== 'undefined' && window.location) {
              window.location.href = '/emi-calculator';
            }
          }}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          EMI Calculator
        </Button>
        <Button
          variant='outlined'
          size='medium'
          onClick={() => setOpenDialog(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          Apply for Loan
        </Button>
      </Box>

      {/* Loan Application Popup Form */}
      <LoanApplicationPopup
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        showEligibilitySummary={true}
        eligibilityData={
          calculation
            ? {
                maxLoanAmount: calculation.maxLoanAmount,
                emi: calculation.emi,
              }
            : null
        }
      />
    </Container>
  );
};

export default EligibilityChecker;
