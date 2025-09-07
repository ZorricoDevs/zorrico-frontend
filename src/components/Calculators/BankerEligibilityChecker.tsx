import React, { useState, useCallback, useEffect } from 'react';
import { MetaPixelTracker } from '../../utils/metaPixel';
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
  Alert,
  Chip,
  Divider,
  Avatar,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  AccountBalance,
  Security,
  PersonOutline,
  AttachMoney,
  Settings,
  Analytics,
  Save,
  Refresh,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface BankerSettings {
  customFOIR: number;
  customInterestRate: number;
  bankName: string;
  notes: string;
}

interface EligibilityCalculation {
  maxLoanAmount: number;
  monthlyEMI: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  recommendedInterestRate: string;
}

const BankerEligibilityChecker: React.FC = () => {
  const { user } = useAuth();

  // Form state
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);
  const [existingEMI, setExistingEMI] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(2500000);
  const [propertyValue, setPropertyValue] = useState<number>(3000000);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [employmentType, setEmploymentType] = useState<string>('salaried');
  const [creditScore, setCreditScore] = useState<number>(750);

  // Banker settings
  const [bankerSettings, setBankerSettings] = useState<BankerSettings>({
    customFOIR: 50,
    customInterestRate: 8.5,
    bankName: '',
    notes: '',
  });

  const [calculation, setCalculation] = useState<EligibilityCalculation | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  const steps = ['Customer Details', 'Loan Parameters', 'Banker Settings', 'Assessment Results'];

  // Calculate eligibility with banker's custom parameters
  const calculateEligibility = useCallback(() => {
    // Correct FOIR calculation:
    // 1. Total Income × FOIR% = Maximum allowed total EMI
    // 2. Maximum allowed total EMI - Existing Obligations = Available EMI for new loan
    const maxAllowedTotalEMI = (monthlyIncome * bankerSettings.customFOIR) / 100;
    const availableEMIForNewLoan = maxAllowedTotalEMI - existingEMI;

    const annualInterestRate = bankerSettings.customInterestRate;
    const tenureYears = loanTenure;

    // Calculate max loan amount using standard banking formula
    let maxLoanAmount = 0;

    if (annualInterestRate > 0 && availableEMIForNewLoan > 0) {
      const monthlyRate = annualInterestRate / (12 * 100);
      const totalMonths = tenureYears * 12;

      // Standard loan amount formula: P = EMI × [(1 - (1 + r)^-n) / r]
      const powerTerm = Math.pow(1 + monthlyRate, -totalMonths);
      const presentValueFactor = (1 - powerTerm) / monthlyRate;

      maxLoanAmount = availableEMIForNewLoan * presentValueFactor;
    } else {
      maxLoanAmount = 0;
    }

    // Round to nearest rupee for banker precision
    maxLoanAmount = Math.round(maxLoanAmount); // Calculate EMI for requested loan amount
    const monthlyInterestRate = bankerSettings.customInterestRate / (12 * 100);
    const monthlyEMI = Math.round(
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTenure * 12)) /
        (Math.pow(1 + monthlyInterestRate, loanTenure * 12) - 1)
    );

    // Risk assessment based on FOIR and credit score only (LTV removed)
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    const foirUsed = ((monthlyEMI + existingEMI) / monthlyIncome) * 100;

    if (foirUsed > 60 || creditScore < 650) {
      riskLevel = 'High';
    } else if (foirUsed > 45 || creditScore < 700) {
      riskLevel = 'Medium';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (foirUsed > 50) {
      recommendations.push('Consider reducing loan amount to improve FOIR ratio');
    }
    if (creditScore < 750) {
      recommendations.push('Customer could benefit from credit score improvement');
    }
    if (employmentType === 'self-employed') {
      recommendations.push('Additional income documentation may be required');
    }

    const result: EligibilityCalculation = {
      maxLoanAmount,
      monthlyEMI,
      riskLevel,
      recommendations,
      recommendedInterestRate: `${bankerSettings.customInterestRate}%`,
    };

    setCalculation(result);

    // Track banker calculator usage
    MetaPixelTracker.trackCustomEvent('BankerCalculatorUsed', {
      loan_amount: loanAmount,
      monthly_income: monthlyIncome,
      credit_score: creditScore,
      bank_name: bankerSettings.bankName,
      custom_foir: bankerSettings.customFOIR,
      custom_interest_rate: bankerSettings.customInterestRate,
    });
  }, [
    monthlyIncome,
    existingEMI,
    loanAmount,
    propertyValue,
    loanTenure,
    employmentType,
    creditScore,
    bankerSettings,
  ]);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateEligibility();
  }, [calculateEligibility]);

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

  const saveAssessment = async () => {
    if (!calculation) return;

    setSaving(true);
    try {
      const assessmentData = {
        customerDetails: {
          monthlyIncome,
          existingEMI,
          loanAmount,
          propertyValue,
          loanTenure,
          employmentType,
          creditScore,
        },
        bankerSettings,
        results: calculation,
        assessedBy: user?.email,
        assessmentDate: new Date().toISOString(),
        assessmentId: `ASSESS_${Date.now()}`,
      };

      // Save to localStorage only
      const existingAssessments = JSON.parse(localStorage.getItem('bankerAssessments') || '[]');
      existingAssessments.push(assessmentData);
      localStorage.setItem('bankerAssessments', JSON.stringify(existingAssessments));

      alert('Assessment saved successfully!');
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Error saving assessment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth='xl' sx={{ py: { xs: 1, sm: 2, md: 3 }, px: { xs: 0.5, sm: 1, md: 2 } }}>
      {/* Enhanced Professional Header with Theme Adaptability */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 1.5, sm: 2, md: 3 },
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : 'white',
          borderRadius: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
              : `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: 100, sm: 150, md: 200 },
            height: { xs: 100, sm: 150, md: 200 },
            opacity: theme.palette.mode === 'dark' ? 0.05 : 0.1,
            background: `radial-gradient(circle, ${theme.palette.mode === 'dark' ? theme.palette.common.white : 'white'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            display: { xs: 'none', sm: 'block' },
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={{ xs: 2, sm: 3 }}
            sx={{ mb: 2 }}
          >
            <Avatar
              sx={{
                width: { xs: 40, sm: 50, md: 60 },
                height: { xs: 40, sm: 50, md: 60 },
                bgcolor: alpha('#ffffff', 0.2),
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <AccountBalance sx={{ fontSize: { xs: 20, sm: 25, md: 30 } }} />
            </Avatar>
            <Box>
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2.125rem' },
                }}
              >
                Professional Eligibility Assessment
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                }}
              >
                Advanced Banking Tools for Loan Evaluation
              </Typography>
            </Box>
          </Stack>
          <Typography
            variant='body1'
            sx={{
              opacity: 0.9,
              maxWidth: { xs: '100%', sm: 600 },
              mb: { xs: 1, sm: 2 },
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
              lineHeight: { xs: 1.4, sm: 1.5 },
            }}
          >
            Comprehensive loan assessment platform with customizable FOIR, interest rates, and
            professional risk evaluation tools
          </Typography>
          <Chip
            icon={<Security />}
            label={`Banker: ${user?.firstName || user?.email}`}
            sx={{
              bgcolor: alpha('#ffffff', 0.2),
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': { color: 'white' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          />
        </Box>
      </Paper>

      {/* Progress Stepper with Theme Adaptability */}
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          mb: { xs: 1.5, sm: 2, md: 3 },
          borderRadius: { xs: 2, sm: 3 },
          bgcolor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.8)
              : theme.palette.background.paper,
          border:
            theme.palette.mode === 'dark'
              ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              : 'none',
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel={window.innerWidth >= 600}
          orientation={window.innerWidth < 600 ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepConnector-root': {
              display: { xs: 'none', sm: 'block' },
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => setActiveStep(index)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiStepLabel-label': {
                    color: theme.palette.mode === 'dark' ? theme.palette.text.primary : undefined,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                    fontWeight: { xs: 500, sm: 400 },
                  },
                  '& .MuiStepLabel-iconContainer': {
                    pr: { xs: 1, sm: 0 },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        {/* Left Column - Input Forms */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Customer Details Accordion */}
          <Accordion
            expanded={activeStep === 0}
            onChange={() => setActiveStep(0)}
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              '&:before': { display: 'none' },
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 2px 8px ${alpha(theme.palette.grey[500], 0.1)}`,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Stack direction='row' alignItems='center' spacing={{ xs: 1, sm: 2 }}>
                <PersonOutline color='primary' sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Customer Details
                </Typography>
                <Chip
                  label='Step 1'
                  size='small'
                  color='primary'
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Monthly Income*
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatNumber(monthlyIncome)}
                    onChange={e => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(value))) {
                        setMonthlyIncome(Number(value));
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={monthlyIncome}
                    onChange={(_, value) => setMonthlyIncome(value as number)}
                    min={10000}
                    max={500000}
                    step={5000}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Existing EMIs*
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatNumber(existingEMI)}
                    onChange={e => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(value))) {
                        setExistingEMI(Number(value));
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={existingEMI}
                    onChange={(_, value) => setExistingEMI(value as number)}
                    min={0}
                    max={100000}
                    step={1000}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Employment Type*
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={employmentType}
                      onChange={e => setEmploymentType(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                        '& .MuiSelect-select': {
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.common.white
                              : theme.palette.text.primary,
                        },
                      }}
                    >
                      <MenuItem value='salaried'>Salaried</MenuItem>
                      <MenuItem value='self-employed'>Self Employed</MenuItem>
                      <MenuItem value='business'>Business</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Credit Score
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatNumber(creditScore)}
                    onChange={e => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(value))) {
                        setCreditScore(Number(value));
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={creditScore}
                    onChange={(_, value) => setCreditScore(value as number)}
                    min={300}
                    max={900}
                    step={10}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Loan Parameters Accordion */}
          <Accordion
            expanded={activeStep === 1}
            onChange={() => setActiveStep(1)}
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              '&:before': { display: 'none' },
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 2px 8px ${alpha(theme.palette.grey[500], 0.1)}`,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Stack direction='row' alignItems='center' spacing={{ xs: 1, sm: 2 }}>
                <AttachMoney color='primary' sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Loan Parameters
                </Typography>
                <Chip
                  label='Step 2'
                  size='small'
                  color='primary'
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Requested Loan Amount (Effects on Monthly EMI Only)
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatNumber(loanAmount)}
                    onChange={e => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(value))) {
                        setLoanAmount(Number(value));
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={loanAmount}
                    onChange={(_, value) => setLoanAmount(value as number)}
                    min={100000}
                    max={10000000}
                    step={100000}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Property Value (Effects on Monthly EMI Only)
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatNumber(propertyValue)}
                    onChange={e => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(Number(value))) {
                        setPropertyValue(Number(value));
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={propertyValue}
                    onChange={(_, value) => setPropertyValue(value as number)}
                    min={500000}
                    max={20000000}
                    step={100000}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Loan Tenure (Years)*
                  </Typography>
                  <TextField
                    fullWidth
                    value={loanTenure}
                    onChange={e => setLoanTenure(Number(e.target.value))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={loanTenure}
                    onChange={(_, value) => setLoanTenure(value as number)}
                    min={1}
                    max={30}
                    step={1}
                    sx={{
                      mt: 2,
                      '& .MuiSlider-markLabel': {
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      },
                    }}
                    marks={
                      window.innerWidth < 600
                        ? [
                            { value: 10, label: '10Y' },
                            { value: 20, label: '20Y' },
                            { value: 30, label: '30Y' },
                          ]
                        : [
                            { value: 5, label: '5Y' },
                            { value: 10, label: '10Y' },
                            { value: 15, label: '15Y' },
                            { value: 20, label: '20Y' },
                            { value: 25, label: '25Y' },
                            { value: 30, label: '30Y' },
                          ]
                    }
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Banker Settings Accordion */}
          <Accordion
            expanded={activeStep === 2}
            onChange={() => setActiveStep(2)}
            sx={{
              borderRadius: { xs: 2, sm: 3 },
              '&:before': { display: 'none' },
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 2px 8px ${alpha(theme.palette.common.black, 0.3)}`
                  : `0 2px 8px ${alpha(theme.palette.grey[500], 0.1)}`,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                minHeight: { xs: 48, sm: 56 },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              <Stack direction='row' alignItems='center' spacing={{ xs: 1, sm: 2 }}>
                <Settings color='primary' sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Professional Settings
                </Typography>
                <Chip
                  label='Step 3'
                  size='small'
                  color='primary'
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Custom FOIR %*
                  </Typography>
                  <TextField
                    fullWidth
                    value={bankerSettings.customFOIR}
                    onChange={e =>
                      setBankerSettings({
                        ...bankerSettings,
                        customFOIR: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ ml: 1, color: 'text.secondary' }}>%</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={bankerSettings.customFOIR}
                    onChange={(_, value) =>
                      setBankerSettings({
                        ...bankerSettings,
                        customFOIR: value as number,
                      })
                    }
                    min={30}
                    max={80}
                    step={5}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Interest Rate %*
                  </Typography>
                  <TextField
                    fullWidth
                    value={bankerSettings.customInterestRate}
                    onChange={e =>
                      setBankerSettings({
                        ...bankerSettings,
                        customInterestRate: Number(e.target.value),
                      })
                    }
                    InputProps={{
                      endAdornment: (
                        <Typography sx={{ ml: 1, color: 'text.secondary' }}>%</Typography>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                  <Slider
                    value={bankerSettings.customInterestRate}
                    onChange={(_, value) =>
                      setBankerSettings({
                        ...bankerSettings,
                        customInterestRate: value as number,
                      })
                    }
                    min={6}
                    max={15}
                    step={0.1}
                    sx={{ mt: 2 }}
                  />
                </Box>

                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Bank/Institution
                  </Typography>
                  <TextField
                    fullWidth
                    value={bankerSettings.bankName}
                    onChange={e =>
                      setBankerSettings({
                        ...bankerSettings,
                        bankName: e.target.value,
                      })
                    }
                    placeholder='Enter bank name'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                  <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                    Assessment Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={bankerSettings.notes}
                    onChange={e =>
                      setBankerSettings({
                        ...bankerSettings,
                        notes: e.target.value,
                      })
                    }
                    placeholder='Add professional notes about this assessment...'
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.grey[50],
                        '&:hover': {
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.background.paper, 0.9)
                              : alpha(theme.palette.grey[100], 0.8),
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.common.white
                            : theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Right Column - Results with Enhanced Theme Support */}
        <Box>
          <Card
            sx={{
              position: { xs: 'static', lg: 'sticky' },
              top: 20,
              background:
                theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              borderRadius: { xs: 2, sm: 3 },
              border:
                theme.palette.mode === 'dark'
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                  : `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
                  : undefined,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Stack
                direction='row'
                alignItems='center'
                spacing={{ xs: 1, sm: 2 }}
                sx={{ mb: { xs: 2, sm: 3 } }}
              >
                <Analytics color='primary' sx={{ fontSize: { xs: 24, sm: 30 } }} />
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  Assessment Results
                </Typography>
                <Chip
                  label='Step 4'
                  size='small'
                  color='primary'
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                />
              </Stack>

              {calculation && (
                <>
                  {/* Key Metrics */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                      gap: { xs: 1.5, sm: 2 },
                      mb: { xs: 2, sm: 3 },
                    }}
                  >
                    <Paper
                      sx={{
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        border:
                          theme.palette.mode === 'dark'
                            ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                            : 'none',
                      }}
                    >
                      <Typography
                        variant='h4'
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          fontSize: { xs: '1.5rem', sm: '2.125rem' },
                        }}
                      >
                        {formatCurrency(calculation.maxLoanAmount)}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Max Eligible Amount
                      </Typography>
                    </Paper>

                    <Paper
                      sx={{
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        border:
                          theme.palette.mode === 'dark'
                            ? `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                            : 'none',
                      }}
                    >
                      <Typography
                        variant='h4'
                        sx={{
                          fontWeight: 700,
                          color: 'secondary.main',
                          fontSize: { xs: '1.5rem', sm: '2.125rem' },
                        }}
                      >
                        {formatCurrency(calculation.monthlyEMI)}
                      </Typography>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Monthly EMI
                      </Typography>
                    </Paper>

                    <Paper
                      sx={{
                        p: { xs: 2, sm: 3 },
                        textAlign: 'center',
                        borderRadius: 2,
                        gridColumn: { xs: 'span 1', sm: 'span 2' },
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.8)
                            : theme.palette.background.paper,
                        border:
                          theme.palette.mode === 'dark'
                            ? `1px solid ${alpha(theme.palette.grey[500], 0.2)}`
                            : 'none',
                      }}
                    >
                      <Chip
                        label={calculation.riskLevel}
                        color={
                          calculation.riskLevel === 'Low'
                            ? 'success'
                            : calculation.riskLevel === 'Medium'
                              ? 'warning'
                              : 'error'
                        }
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          px: 2,
                          py: 1,
                        }}
                      />
                      <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                        Risk Assessment
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Recommendations */}
                  {calculation.recommendations.length > 0 && (
                    <Alert
                      severity='info'
                      sx={{
                        mb: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.info.main, 0.1)
                            : undefined,
                        borderColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.info.main, 0.3)
                            : undefined,
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          mb: 1,
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        Professional Recommendations:
                      </Typography>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {calculation.recommendations.map((rec: string, index: number) => (
                          <li
                            key={index}
                            style={{ fontSize: window.innerWidth < 600 ? '0.85rem' : '0.875rem' }}
                          >
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </Alert>
                  )}

                  <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: 1.5, sm: 2 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      variant='contained'
                      startIcon={<Save />}
                      onClick={saveAssessment}
                      disabled={saving}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minHeight: { xs: 44, sm: 48 },
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Assessment'}
                    </Button>
                    <Button
                      variant='outlined'
                      startIcon={<Refresh />}
                      onClick={calculateEligibility}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: { xs: 1.2, sm: 1.5 },
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minHeight: { xs: 44, sm: 48 },
                      }}
                    >
                      Recalculate
                    </Button>
                  </Box>

                  {/* Assessment Summary with Enhanced Theme Support */}
                  <Box
                    sx={{
                      mt: { xs: 2, sm: 3 },
                      p: { xs: 2, sm: 3 },
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.6)
                          : alpha(theme.palette.grey[500], 0.05),
                      borderRadius: 2,
                      border:
                        theme.palette.mode === 'dark'
                          ? `1px solid ${alpha(theme.palette.grey[500], 0.2)}`
                          : 'none',
                    }}
                  >
                    <Typography
                      variant='caption'
                      component='div'
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.75rem' },
                      }}
                    >
                      Assessment Summary:
                    </Typography>
                    <Typography
                      variant='caption'
                      component='div'
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      <strong>Interest Rate:</strong> {calculation.recommendedInterestRate}
                    </Typography>
                    <Typography
                      variant='caption'
                      component='div'
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      <strong>FOIR Applied:</strong> {bankerSettings.customFOIR}%
                    </Typography>
                    <Typography
                      variant='caption'
                      component='div'
                      sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                    >
                      <strong>Assessed By:</strong> {user?.email}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default BankerEligibilityChecker;
