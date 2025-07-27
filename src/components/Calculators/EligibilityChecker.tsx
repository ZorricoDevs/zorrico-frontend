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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  AccountBalance,
  Close,
  Email,
  Phone,
  Person,
  Work
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import FinanceLoader from '../UI/FinanceLoader';

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
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    occupation: '',
    companyName: '',
    workExperience: '',
    currentAddress: '',
    propertyLocation: '',
    bankName: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);

  const calculateEligibility = useCallback(() => {
    try {
      // FOIR % based on annual income slabs (your exact specification)
      const annualIncome = monthlyIncome * 12;
      let foir = 0.55; // Default 55%

      if (annualIncome >= 300000 && annualIncome < 600000) {
        foir = 0.55; // 3-6 Lakh => 55%
      } else if (annualIncome >= 600000 && annualIncome < 1000000) {
        foir = 0.60; // 6-10 Lakh => 60%
      } else if (annualIncome >= 1000000 && annualIncome < 1800000) {
        foir = 0.65; // 10-18 Lakh => 65%
      } else if (annualIncome >= 1800000) {
        foir = 0.70; // 18 Lakh & Above => 70%
      }

      // Main eligibility formula: Net Salary * FOIR% - Obligations / Per Lakh EMI
      const netAvailableEMI = (monthlyIncome * foir) - existingLoans;

      if (netAvailableEMI <= 0) {
        setCalculation({
          eligible: false,
          maxLoanAmount: 0,
          emi: 0,
          totalPayment: 0,
          totalInterest: 0,
          recommendedBanks: []
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
          recommendedBanks: []
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
      const eligible = maxLoanAmount > 100000 && ageValid && creditScore >= 650;

      // Final EMI & interest calculations using same R and N values
      const finalEmi = (maxLoanAmount * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      const totalPayment = finalEmi * N;
      const totalInterest = totalPayment - maxLoanAmount;

      // Recommended banks (frontend-only static data)
      const recommendedBanks = eligible ? [
        {
          name: 'State Bank of India',
          interestRate: '8.50% - 9.25%',
          processingFee: '0.35%',
          maxLoanAmount: Math.round(maxLoanAmount * 0.95),
          specialFeatures: ['No prepayment penalty after 1 year', 'Overdraft facility']
        },
        {
          name: 'HDFC Bank',
          interestRate: '8.75% - 9.50%',
          processingFee: '0.50%',
          maxLoanAmount: Math.round(maxLoanAmount * 0.90),
          specialFeatures: ['Digital processing', 'Quick approval']
        },
        {
          name: 'ICICI Bank',
          interestRate: '8.65% - 9.40%',
          processingFee: '0.50%',
          maxLoanAmount: Math.round(maxLoanAmount * 0.92),
          specialFeatures: ['Online account management', 'Flexible EMI dates']
        }
      ] : [];

      setCalculation({
        eligible,
        maxLoanAmount: Math.round(maxLoanAmount),
        emi: Math.round(finalEmi),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        recommendedBanks
      });
    } catch (error) {
      setCalculation({
        eligible: false,
        maxLoanAmount: 0,
        emi: 0,
        totalPayment: 0,
        totalInterest: 0,
        recommendedBanks: []
      });
    }
  }, [monthlyIncome, age, employmentType, existingLoans, creditScore, requestedTenure]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
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
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const parseFormattedNumber = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };


  const handleFormSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone) {
        setSnackbar({ open: true, message: 'Please fill in all required fields', severity: 'error' });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'error' });
        return;
      }

      // Phone validation
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        setSnackbar({ open: true, message: 'Please enter a valid 10-digit phone number', severity: 'error' });
        return;
      }

      // Prepare application data with eligibility details
      const applicationData = {
        ...formData,
        eligibilityDetails: calculation ? {
          monthlyIncome: formatNumber(monthlyIncome),
          age,
          employmentType,
          existingLoans: formatNumber(existingLoans),
          creditScore,
          requestedTenure,
          eligibleAmount: formatCurrency(calculation.maxLoanAmount),
          monthlyEMI: formatCurrency(calculation.emi)
        } : null
      };

      // Send to backend API
      const response = await fetch('http://localhost:5000/api/applications/eligibility-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSnackbar({
          open: true,
          message: 'Application submitted successfully! You will receive a confirmation email shortly.',
          severity: 'success'
        });
        setOpenDialog(false);

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          panNumber: '',
          occupation: '',
          companyName: '',
          workExperience: '',
          currentAddress: '',
          propertyLocation: '',
          bankName: ''
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to submit application. Please try again.',
          severity: 'error'
        });
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      setSnackbar({
        open: true,
        message: 'Network error. Please check your connection and try again.',
        severity: 'error'
      });
    }
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
            p: 2,
            borderRadius: 2,
            backgroundColor: isDark ? '#23272f' : '#fafafa',
            border: isDark ? '1px solid #444' : '1px solid #e0e0e0',
            color: isDark ? '#fff' : 'inherit',
        position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
        <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            backgroundColor: index === 0 ? '#1976d2' : index === 1 ? '#d32f2f' : '#ff9800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            opacity: 0.5,
            filter: 'blur(6px)'
          }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem', filter: 'blur(6px)', opacity: 0.5 }}>{bank.name}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDark ? '#bbb' : 'text.primary', fontSize: '1rem', filter: 'blur(6px)', opacity: 0.5 }}>{bank.name}</Typography>
            <Typography variant="caption" sx={{ color: interestColor, fontWeight: 500 }}>
              Interest Rate: <span style={{ color: interestColor, fontWeight: 600 }}>{bank.interestRate}</span>
            </Typography>
          </Box>
          <Button variant="contained" size="small" sx={{ px: 2.5, py: 1, borderRadius: 1.5, fontWeight: 600, textTransform: 'none', backgroundColor: 'primary.main', color: 'white', minWidth: 80, fontSize: '0.85rem', '&:hover': { backgroundColor: 'primary.dark' } }}
            onClick={() => setOpenDialog(true)}
          >Apply</Button>
          <Box sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: index === 0 ? '#4caf50' : index === 1 ? '#2196f3' : '#ff9800', color: 'white', px: 1, py: 0.3, borderRadius: 0.8, fontSize: '0.7rem', fontWeight: 600 }}>{bank.specialFeatures.join(', ')}</Box>
        </Paper>
      );
    });
  }

  if (calculation === null) {
    return <FinanceLoader />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Home Loan Eligibility Checker
          </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
          Check your eligibility and get personalized loan offers from top banks
          </Typography>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: 3, alignItems: { md: 'stretch' } }}>
        {/* Input Card */}
        <Card elevation={0} sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(36,40,47,0.98)' : '#f5f7fa',
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
          overflow: 'hidden',
          height: '100%',
          minHeight: { md: '70vh' },
        }}>
          <Box sx={{
            background: 'none',
            p: 3,
            color: 'primary.main',
            borderBottom: (theme) => theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.2rem',
            gap: 1,
          }}>
            <Calculate sx={{ mr: 1, fontSize: 24 }} />
              Personal & Property Details
          </Box>
          <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={2.5}>
              {/* Monthly Income with Slider */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                  Monthly Income
                </Typography>
                <TextField
                  value={formatNumber(monthlyIncome)}
                  onChange={(e) => setMonthlyIncome(parseFormattedNumber(e.target.value))}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa',
                    },
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>₹</Typography>,
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>₹20K</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>₹5L</Typography>
                  </Box>
                </Box>
              {/* Age and Employment Type */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Age</Typography>
                  <TextField
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 18, max: 75 }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa' } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Employment Type</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      variant="outlined"
                      sx={{ borderRadius: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa' }}
                    >
                      <MenuItem value="salaried">Salaried</MenuItem>
                      <MenuItem value="self-employed">Self Employed</MenuItem>
                      <MenuItem value="business">Business Owner</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              {/* Existing Loan EMIs with Slider */}
                <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Existing Loan EMIs</Typography>
                  <TextField
                    value={formatNumber(existingLoans)}
                    onChange={(e) => setExistingLoans(parseFormattedNumber(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa' } }}
                  InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>₹</Typography> }}
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>₹0</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>₹1L</Typography>
                </Box>
              </Box>
              {/* Credit Score with Slider */}
                <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Credit Score</Typography>
                  <TextField
                    type="number"
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa' } }}
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>300</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>900</Typography>
                </Box>
              </Box>
              {/* Removed Property Value and Down Payment fields */}
              {/* Loan Tenure */}
                <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>Loan Tenure (Years)</Typography>
                  <TextField
                    type="number"
                    value={requestedTenure}
                    onChange={(e) => setRequestedTenure(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 30 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f8f9fa' } }}
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
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>1</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>30</Typography>
                </Box>
              </Box>
              {/* Remove Calculate Eligibility button */}
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card elevation={0} sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: (theme) => theme.palette.mode === 'dark' ? 'rgba(36,40,47,0.98)' : '#f5f7fa',
          border: (theme) => theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
          overflow: 'hidden',
          height: '100%',
          minHeight: { md: '70vh' },
        }}>
          <Box sx={{
            background: 'none',
            p: 3,
            color: 'primary.main',
            borderBottom: (theme) => theme.palette.mode === 'dark' ? '1px solid #23272f' : '1px solid #e3f2fd',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: '1.2rem',
            gap: 1,
          }}>
            <TrendingUp sx={{ mr: 1, fontSize: 24 }} />
            Eligibility Results
          </Box>
          <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {calculation && (
              <Box>
                {/* 2x2 Grid for Results */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr' }, gap: 2, mb: 3 }}>
                      <Paper sx={{
                    p: 2,
                        textAlign: 'center',
                        borderRadius: 3,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                      : 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)',
                    border: (theme) => theme.palette.mode === 'dark'
                      ? '2px solid #3b82f6'
                      : '2px solid #1976d2',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Typography variant="body2" sx={{
                      color: (theme) => theme.palette.mode === 'dark' ? '#e3f2fd' : '#1565c0',
                      mb: 1,
                      fontWeight: 600
                    }}>
                      Eligible Amount
                        </Typography>
                    <Typography variant="h6" sx={{
                          fontWeight: 700,
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2'
                        }}>
                          {formatCurrency(calculation.maxLoanAmount)}
                        </Typography>
                      </Paper>

                      <Paper sx={{
                    p: 2,
                        textAlign: 'center',
                        borderRadius: 3,
                    background: (theme) => theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)'
                      : 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
                    border: (theme) => theme.palette.mode === 'dark'
                      ? '2px solid #ea580c'
                      : '2px solid #ff9800',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Typography variant="body2" sx={{
                      color: (theme) => theme.palette.mode === 'dark' ? '#fff3e0' : '#e65100',
                      mb: 1,
                      fontWeight: 600
                        }}>
                          Monthly EMI
                        </Typography>
                    <Typography variant="h6" sx={{
                          fontWeight: 700,
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#ff9800'
                        }}>
                          {formatCurrency(calculation.emi)}
                        </Typography>
                      </Paper>
                    </Box>
                {/* Personalized Bank Offers Section */}
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 700, color: 'primary.main' }}>
                      <AccountBalance sx={{ mr: 1 }} />
                      Personalized Bank Offers
                    </Typography>
                    <Paper sx={{
                      p: 3,
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#fff',
                  color: (theme) => theme.palette.mode === 'dark' ? '#fff' : 'inherit',
                  boxShadow: 2,
                  mb: 2
                    }}>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main' }}>
                          Exclusive Bank Partnerships
                        </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : 'text.secondary' }}>
                          Comparing offers from {calculation.recommendedBanks.length}+ leading banks
                        </Typography>
                    <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32', fontWeight: 500 }}>
                          Interest rates starting from 8.30% p.a. | Apply to get specific bank details
                        </Typography>
                      </Box>
                  <Stack spacing={1.5}>
                    {bankCards}
                  </Stack>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="medium"
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
            textTransform: 'none'
          }}
        >
          EMI Calculator
        </Button>
        <Button
          variant="outlined"
          size="medium"
          onClick={() => setOpenDialog(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          Apply for Loan
        </Button>
      </Box>

      {/* Loan Application Popup Form */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            maxHeight: '90vh',
            background: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#fff',
            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#23272f',
            boxShadow: 24,
            p: 0,
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1976d2' : '#e3f2fd',
          color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1976d2',
          py: 2.5,
          px: 3,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Apply for Home Loan
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Get competitive offers from our partner banks
            </Typography>
          </Typography>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1976d2' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, background: 'none' }}>
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                <Person sx={{ mr: 1 }} />
                Personal Information
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
              <TextField
                label="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: '#666' }} />
                }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#666' }} />
                }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label="PAN Number"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                fullWidth
                size="small"
                variant="outlined"
                inputProps={{ maxLength: 10 }}
                sx={{ mb: { xs: 2, md: 0 } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                <Work sx={{ mr: 1 }} />
                Professional Information
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 3 }}>
              <TextField
                label="Occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: { xs: 2, md: 0 } }}
              />

              <TextField
                label="Work Experience (Years)"
                value={formData.workExperience}
                onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: { xs: 2, md: 0 } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                label="Current Address"
                value={formData.currentAddress}
                onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Property Location"
                value={formData.propertyLocation}
                onChange={(e) => setFormData({ ...formData, propertyLocation: e.target.value })}
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
              />
            </Box>

            {/* Display Eligibility Summary */}
            {calculation && (
              <Paper sx={{ p: 2.5, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#f5f5f5', borderRadius: 2, mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 1.5, color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2', fontWeight: 700 }}>
                  Your Eligibility Summary
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : 'textSecondary' }}>Eligible Amount:</Typography>
                    <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main', fontWeight: 700 }}>{formatCurrency(calculation.maxLoanAmount)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : 'textSecondary' }}>Monthly EMI:</Typography>
                    <Typography variant="h6" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : 'primary.main', fontWeight: 700 }}>{formatCurrency(calculation.emi)}</Typography>
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#23272f' : '#fafafa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{ px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{ px: 4, ml: 2 }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EligibilityChecker;
