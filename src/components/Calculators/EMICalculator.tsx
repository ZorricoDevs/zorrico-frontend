import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  Stack,
  Container,
  Slider
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  PieChart
} from '@mui/icons-material';
import FinanceLoader from '../UI/FinanceLoader';

interface EMICalculation {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [calculation, setCalculation] = useState<EMICalculation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const calculateEMI = useCallback(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const months = tenure * 12;

    if (monthlyRate === 0) {
      const emi = principal / months;
      const totalPayment = principal;
      const totalInterest = 0;

      setCalculation({
        emi,
        totalPayment,
        totalInterest,
        monthlyBreakdown: []
      });
      return;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    // Calculate monthly breakdown
    const monthlyBreakdown = [];
    let remainingBalance = principal;

    for (let month = 1; month <= months; month++) {
      const interestComponent = remainingBalance * monthlyRate;
      const principalComponent = emi - interestComponent;
      remainingBalance -= principalComponent;

      monthlyBreakdown.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalComponent),
        interest: Math.round(interestComponent),
        balance: Math.round(Math.max(0, remainingBalance))
      });
    }

    setCalculation({
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      monthlyBreakdown
    });
  }, [loanAmount, interestRate, tenure]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

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

  if (loading) {
    return <FinanceLoader />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Enhanced Header Section */}
      <Box sx={{
        mb: 3,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.05,
          borderRadius: 3
        }} />

        {/* Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          opacity: 0.1
        }} />

        <Box sx={{ position: 'relative', py: 3, px: 3 }}>
          <Typography variant="h4" sx={{
            mb: 1,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}>
            EMI Calculator
          </Typography>
          <Typography variant="body1" sx={{
            color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666',
            fontWeight: 400,
            maxWidth: 600,
            margin: '0 auto',
            textAlign: 'center'
          }}>
            Calculate your monthly EMI and plan your loan
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'block', md: 'flex' },
          gap: 3,
          alignItems: { md: 'stretch' },
        }}
      >
        <Card elevation={0} sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: (theme) => theme.palette.mode === 'dark'
            ? '1px solid #333'
            : '1px solid #e3f2fd',
          overflow: 'hidden',
          height: '100%',
          minHeight: { md: '50vh' }
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 2.5,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <Calculate sx={{ mr: 2, fontSize: 28 }} />
              Loan Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Enter your loan details to calculate EMI
            </Typography>
          </Box>
          <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>

            <Stack spacing={2.5}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'
                  }}>
                    Loan Amount *
                  </Typography>
                  <TextField
                    value={formatNumber(loanAmount)}
                    onChange={(e) => setLoanAmount(parseFormattedNumber(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 }
                      }
                    }}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666', fontWeight: 600 }}>₹</Typography>
                    }}
                  />
                  <Slider
                    value={loanAmount}
                    min={100000}
                    max={10000000}
                    step={10000}
                    onChange={(_, value) => setLoanAmount(Number(value))}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'
                  }}>
                    Interest Rate *
                  </Typography>
                  <TextField
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
                        '&:hover fieldset': { borderColor: '#1976d2' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 }
                      }
                    }}
                    InputProps={{
                      endAdornment: <Typography sx={{ ml: 1, color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666', fontWeight: 500 }}>%</Typography>
                    }}
                  />
                  <Slider
                    value={interestRate}
                    min={5}
                    max={20}
                    step={0.05}
                    onChange={(_, value) => setInterestRate(Number(value))}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2'
                }}>
                  Loan Tenure *
                </Typography>
                <TextField
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  fullWidth
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 1, max: 30 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
                      '&:hover fieldset': { borderColor: '#1976d2' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 }
                    }
                  }}
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1, color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666', fontWeight: 500 }}>Years</Typography>
                  }}
                />
                <Slider
                  value={tenure}
                  min={1}
                  max={30}
                  step={1}
                  onChange={(_, value) => setTenure(Number(value))}
                  sx={{ mt: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* EMI Information Section */}
              <Box>
                <Typography variant="h6" sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <PieChart sx={{ mr: 1, fontSize: 20 }} />
                  EMI Information
                </Typography>

                <Stack spacing={1.5}>
                  <Paper sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
                    border: (theme) => theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0'
                  }}>
                    <Typography variant="body2" sx={{
                      fontWeight: 600,
                      color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                      mb: 0.5
                    }}>
                      💡 EMI Tips
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666',
                      fontSize: '0.8rem',
                      lineHeight: 1.3
                    }}>
                      • Lower interest rates reduce monthly EMI
                      <br />
                      • Longer tenure = Lower EMI but higher interest
                    </Typography>
                  </Paper>

                  <Paper sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f9fa',
                    border: (theme) => theme.palette.mode === 'dark' ? '1px solid #444' : '1px solid #e0e0e0'
                  }}>
                    <Typography variant="body2" sx={{
                      fontWeight: 600,
                      color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#1976d2',
                      mb: 0.5
                    }}>
                      📊 Quick Facts
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#666',
                      fontSize: '0.8rem',
                      lineHeight: 1.3
                    }}>
                      • EMI should not exceed 40% of income
                      <br />
                      • Compare offers from multiple banks
                    </Typography>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
          </CardContent>
        </Card>

        {/* Enhanced Results Section */}
        <Card elevation={0} sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: (theme) => theme.palette.mode === 'dark'
            ? '1px solid #333'
            : '1px solid #e3f2fd',
          overflow: 'hidden',
          height: '100%',
          minHeight: { md: '50vh' }
        }}>
          <Box sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            p: 2.5,
            color: 'white'
          }}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 2, fontSize: 28 }} />
              EMI Results
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your monthly payment breakdown
            </Typography>
          </Box>
          <CardContent sx={{ p: 2.5 }}>

            {calculation && (
              <Box>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  mb: 2
                }}>
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
                      Monthly EMI
                    </Typography>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#1976d2'
                    }}>
                      {formatCurrency(calculation.emi)}
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
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#ffffffff',
                      mb: 1,
                      fontWeight: 600
                    }}>
                      Total Interest
                    </Typography>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#ffffffff'
                    }}>
                      {formatCurrency(calculation.totalInterest)}
                    </Typography>
                  </Paper>
                </Box>

                <Paper sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                    : 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
                  border: (theme) => theme.palette.mode === 'dark'
                    ? '2px solid #a855f7'
                    : '2px solid #9c27b0',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#ffffffff',
                    mb: 1,
                    fontWeight: 600
                  }}>
                    Total Payment
                  </Typography>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#ffffffff'
                  }}>
                    {formatCurrency(calculation.totalPayment)}
                  </Typography>
                </Paper>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <PieChart sx={{ mr: 1 }} />
                  Payment Schedule (First 12 Months)
                </Typography>

                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Month</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>EMI</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Principal</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Interest</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Balance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculation.monthlyBreakdown.slice(0, 12).map((row) => (
                        <TableRow key={row.month} hover>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">{formatCurrency(row.emi)}</TableCell>
                          <TableCell align="right" sx={{ color: '#2e7d32' }}>{formatCurrency(row.principal)}</TableCell>
                          <TableCell align="right" sx={{ color: '#d32f2f' }}>{formatCurrency(row.interest)}</TableCell>
                          <TableCell align="right">{formatCurrency(row.balance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.location.href = '/eligibility-checker'}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          Check Eligibility
        </Button>
      </Box>
    </Container>
  );
};

export default EMICalculator;
