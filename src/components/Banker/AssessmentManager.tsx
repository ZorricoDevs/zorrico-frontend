import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Tooltip,
  Alert,
  useTheme,
  alpha,
  Stack,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Download,
  Search,
  Assessment,
  TrendingUp,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface AssessmentData {
  assessmentId: string;
  customerDetails: {
    monthlyIncome: number;
    existingEMI: number;
    loanAmount: number;
    propertyValue: number;
    loanTenure: number;
    employmentType: string;
    creditScore: number;
  };
  bankerSettings: {
    customFOIR: number;
    customInterestRate: number;
    bankName: string;
    notes: string;
  };
  results: {
    maxLoanAmount: number;
    monthlyEMI: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    recommendations: string[];
    recommendedInterestRate: string;
  };
  assessedBy: string;
  assessmentDate: string;
}

const AssessmentManager: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentData[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [editingAssessment, setEditingAssessment] = useState<AssessmentData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Load assessments from localStorage
  useEffect(() => {
    const loadAssessments = () => {
      const stored = localStorage.getItem('bankerAssessments');
      if (stored) {
        const allAssessments = JSON.parse(stored);
        // Filter to show only current user's assessments
        const userAssessments = allAssessments.filter(
          (assessment: AssessmentData) => assessment.assessedBy === user?.email
        );
        setAssessments(userAssessments);
        setFilteredAssessments(userAssessments);
      }
    };

    loadAssessments();
  }, [user?.email]);

  // Filter assessments based on search and risk level
  useEffect(() => {
    let filtered = assessments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        assessment =>
          assessment.assessmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.bankerSettings.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.customerDetails.employmentType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.results.riskLevel === riskFilter);
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, riskFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleView = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
    setViewDialogOpen(true);
  };

  const handleEdit = (assessment: AssessmentData) => {
    setEditingAssessment({ ...assessment }); // Create a copy for editing
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingAssessment) {
      // Update the assessments array
      const updatedAssessments = assessments.map(assessment =>
        assessment.assessmentId === editingAssessment.assessmentId ? editingAssessment : assessment
      );
      setAssessments(updatedAssessments);

      // Update localStorage
      const allAssessments = JSON.parse(localStorage.getItem('bankerAssessments') || '[]');
      const updatedAll = allAssessments.map((assessment: AssessmentData) =>
        assessment.assessmentId === editingAssessment.assessmentId ? editingAssessment : assessment
      );
      localStorage.setItem('bankerAssessments', JSON.stringify(updatedAll));

      setEditDialogOpen(false);
      setEditingAssessment(null);
    }
  };

  const handleDelete = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAssessment) {
      const updatedAssessments = assessments.filter(
        assessment => assessment.assessmentId !== selectedAssessment.assessmentId
      );
      setAssessments(updatedAssessments);

      // Update localStorage
      const allAssessments = JSON.parse(localStorage.getItem('bankerAssessments') || '[]');
      const filteredAll = allAssessments.filter(
        (assessment: AssessmentData) => assessment.assessmentId !== selectedAssessment.assessmentId
      );
      localStorage.setItem('bankerAssessments', JSON.stringify(filteredAll));

      setDeleteDialogOpen(false);
      setSelectedAssessment(null);
    }
  };

  const handleDownload = (assessment: AssessmentData) => {
    // Create professional branded Excel report
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const csvContent = [
      // Company Header Section
      ['═══════════════════════════════════════════════════════════════'],
      ['         🏠 Zorrico - PROFESSIONAL LOAN ASSESSMENT REPORT'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['Company Name:', 'Zorrico Finance LLP', '', ''],
      ['Website:', 'www.zorrico.com', '', ''],
      ['Report Generated:', currentDate, '', ''],
      ['Report Type:', 'Banker Eligibility Assessment', '', ''],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                        ASSESSMENT IDENTIFICATION'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['Assessment ID:', assessment.assessmentId, '', ''],
      ['Assessment Date:', formatDate(assessment.assessmentDate), '', ''],
      ['Assessed By:', assessment.assessedBy, '', ''],
      ['Bank/Institution:', assessment.bankerSettings.bankName || 'Not Specified', '', ''],
      ['Status:', 'Completed', '', ''],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                           CUSTOMER PROFILE'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📊 INCOME DETAILS', '', '', ''],
      ['Monthly Income:', formatCurrency(assessment.customerDetails.monthlyIncome), '', ''],
      ['Existing Monthly EMI:', formatCurrency(assessment.customerDetails.existingEMI), '', ''],
      [
        'Available Income for New EMI:',
        formatCurrency(
          assessment.customerDetails.monthlyIncome - assessment.customerDetails.existingEMI
        ),
        '',
        '',
      ],
      [''],
      ['🏢 EMPLOYMENT DETAILS', '', '', ''],
      ['Employment Type:', assessment.customerDetails.employmentType.toUpperCase(), '', ''],
      ['Credit Score:', assessment.customerDetails.creditScore.toString(), '', ''],
      [''],
      ['🏠 LOAN REQUIREMENTS', '', '', ''],
      ['Requested Loan Amount:', formatCurrency(assessment.customerDetails.loanAmount), '', ''],
      ['Property Value:', formatCurrency(assessment.customerDetails.propertyValue), '', ''],
      ['Loan Tenure:', `${assessment.customerDetails.loanTenure} years`, '', ''],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                        ASSESSMENT RESULTS'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['✅ ELIGIBILITY OUTCOME', '', '', ''],
      [
        'Maximum Eligible Amount:',
        formatCurrency(assessment.results.maxLoanAmount),
        '✓ APPROVED LIMIT',
        '',
      ],
      ['Monthly EMI:', formatCurrency(assessment.results.monthlyEMI), '', ''],
      ['Risk Assessment:', assessment.results.riskLevel.toUpperCase(), '', ''],
      [''],
      ['💰 FINANCIAL PARAMETERS', '', '', ''],
      ['Applied Interest Rate:', assessment.results.recommendedInterestRate, '', ''],
      ['FOIR Applied:', `${assessment.bankerSettings.customFOIR}%`, '', ''],
      ['Bank Interest Rate:', `${assessment.bankerSettings.customInterestRate}%`, '', ''],
      [''],
      ['📈 LOAN-TO-VALUE ANALYSIS', '', '', ''],
      [
        'Requested Amount vs Property:',
        `${((assessment.customerDetails.loanAmount / assessment.customerDetails.propertyValue) * 100).toFixed(1)}%`,
        '',
        '',
      ],
      [
        'Approved Amount vs Property:',
        `${((assessment.results.maxLoanAmount / assessment.customerDetails.propertyValue) * 100).toFixed(1)}%`,
        '',
        '',
      ],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                    PROFESSIONAL RECOMMENDATIONS'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ...(assessment.results.recommendations.length > 0
        ? assessment.results.recommendations.map((rec, index) => [
            `${index + 1}. ${rec}`,
            '',
            '',
            '',
          ])
        : [['✓ No specific recommendations - Customer profile meets all criteria', '', '', '']]),
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                         BANKER NOTES'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      [assessment.bankerSettings.notes || 'No additional notes provided', '', '', ''],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      ['                      ASSESSMENT SUMMARY'],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      [
        'Customer Monthly Income:',
        formatCurrency(assessment.customerDetails.monthlyIncome),
        '',
        '',
      ],
      ['Maximum Loan Approved:', formatCurrency(assessment.results.maxLoanAmount), '', ''],
      ['Monthly EMI Commitment:', formatCurrency(assessment.results.monthlyEMI), '', ''],
      ['Risk Level:', assessment.results.riskLevel, '', ''],
      [
        'Overall Assessment:',
        assessment.results.riskLevel === 'Low'
          ? '✅ RECOMMENDED FOR APPROVAL'
          : assessment.results.riskLevel === 'Medium'
            ? '⚠️ CONDITIONAL APPROVAL'
            : '❌ REQUIRES DETAILED REVIEW',
        '',
        '',
      ],
      [''],
      ['═══════════════════════════════════════════════════════════════'],
      [''],
      ['📞 Contact Information:', '', '', ''],
      ['Email: sales@zorrico.com', '', '', ''],
      ['Phone: +91-84228-89910', '', '', ''],
      ['Address: Zorrico Finance LLP, Mumbai, Maharashtra', '', '', ''],
      [''],
      ['⚖️ Disclaimer:', '', '', ''],
      ['This assessment is based on provided information and current lending', '', '', ''],
      ['guidelines. Final approval subject to document verification and', '', '', ''],
      ['bank/lender discretion. Terms and conditions apply.', '', '', ''],
      [''],
      ['© 2025 Zorrico Finance LLP All rights reserved.', '', '', ''],
      ['Generated by Zorrico Professional Assessment System', '', '', ''],
    ];

    // Convert to CSV format with proper encoding
    const csvString =
      '\uFEFF' + csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    // Create and download the file
    const dataBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zorrico_Assessment_${assessment.assessmentId}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getRiskChipColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          background:
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.9)}, ${alpha(theme.palette.secondary.dark, 0.9)})`
              : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2,
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Assessment sx={{ fontSize: { xs: 32, sm: 40 }, mr: { xs: 0, sm: 2 } }} />
            <Box>
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', sm: '2.125rem' },
                }}
              >
                Assessment Manager
              </Typography>
              <Typography
                variant='subtitle1'
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Manage your loan assessments locally - View, Edit, Delete, and Export
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: '100%', sm: 300 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <TextField
                fullWidth
                placeholder='Search by Assessment ID, Bank Name, or Employment Type...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                minWidth: { xs: '100%', sm: 200 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <TextField
                select
                fullWidth
                label='Risk Level'
                value={riskFilter}
                onChange={e => setRiskFilter(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                size='small'
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              >
                <option value='all'>All Risk Levels</option>
                <option value='Low'>Low Risk</option>
                <option value='Medium'>Medium Risk</option>
                <option value='High'>High Risk</option>
              </TextField>
            </Box>
            <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}>
              <Typography variant='body2' color='text.secondary'>
                <strong>{filteredAssessments.length}</strong> of{' '}
                <strong>{assessments.length}</strong> assessments
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Assessments Table */}
      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: { xs: 400, sm: 500, md: 600 },
              overflowX: 'auto',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px',
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
              },
            }}
          >
            <Table
              stickyHeader
              size='small'
              sx={{
                minWidth: { xs: 800, sm: 1000 },
                '& .MuiTableCell-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px', sm: '16px' },
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  backgroundColor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  fontWeight: 'bold',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Assessment ID
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: { xs: 'none', sm: 'table-cell' },
                    }}
                  >
                    Bank
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Loan Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Eligible Amount
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Risk Level
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      display: { xs: 'none', md: 'table-cell' },
                    }}
                  >
                    Employment
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: { xs: '120px', sm: '180px' },
                      width: { xs: '120px', sm: '180px' },
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align='center'>
                      <Box sx={{ py: 4 }}>
                        <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant='h6' color='text.secondary'>
                          No assessments found
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {assessments.length === 0
                            ? 'Start by creating your first assessment'
                            : 'Try adjusting your search or filter criteria'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAssessments.map(assessment => (
                    <TableRow key={assessment.assessmentId} hover>
                      <TableCell>
                        <Typography
                          variant='body2'
                          fontFamily='monospace'
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                        >
                          {window.innerWidth < 600
                            ? assessment.assessmentId.slice(-8)
                            : assessment.assessmentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                        >
                          {window.innerWidth < 600
                            ? new Date(assessment.assessmentDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })
                            : formatDate(assessment.assessmentDate)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant='body2' sx={{ fontSize: '0.875rem' }}>
                          {assessment.bankerSettings.bankName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                        >
                          {window.innerWidth < 600
                            ? `₹${(assessment.customerDetails.loanAmount / 100000).toFixed(1)}L`
                            : formatCurrency(assessment.customerDetails.loanAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant='body2'
                          sx={{
                            fontWeight: 'bold',
                            color: 'success.main',
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                          }}
                        >
                          {window.innerWidth < 600
                            ? `₹${(assessment.results.maxLoanAmount / 100000).toFixed(1)}L`
                            : formatCurrency(assessment.results.maxLoanAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={assessment.results.riskLevel}
                          color={getRiskChipColor(assessment.results.riskLevel) as any}
                          size='small'
                          sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Chip
                          label={assessment.customerDetails.employmentType}
                          variant='outlined'
                          size='small'
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: { xs: 0.5, sm: 1 },
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            width: '100%',
                          }}
                        >
                          <Tooltip title='View Details' arrow>
                            <IconButton
                              size={window.innerWidth < 600 ? 'medium' : 'small'}
                              onClick={() => handleView(assessment)}
                              sx={{
                                padding: { xs: '8px', sm: '8px' },
                                minWidth: { xs: '44px', sm: '40px' },
                                minHeight: { xs: '44px', sm: '40px' },
                                border: { xs: '1px solid', sm: 'none' },
                                borderColor: { xs: 'primary.main', sm: 'transparent' },
                                borderRadius: { xs: 2, sm: 1 },
                                backgroundColor: {
                                  xs: alpha(theme.palette.primary.main, 0.1),
                                  sm: 'transparent',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: {
                                    xs: alpha(theme.palette.primary.main, 0.2),
                                    sm: alpha(theme.palette.action.hover, 0.1),
                                  },
                                  transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                                },
                                '&:active': {
                                  transform: 'scale(0.95)',
                                },
                              }}
                            >
                              <Visibility sx={{ fontSize: { xs: 20, sm: 20 } }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Edit Assessment' arrow>
                            <IconButton
                              size={window.innerWidth < 600 ? 'medium' : 'small'}
                              onClick={() => handleEdit(assessment)}
                              sx={{
                                padding: { xs: '8px', sm: '8px' },
                                minWidth: { xs: '44px', sm: '40px' },
                                minHeight: { xs: '44px', sm: '40px' },
                                border: { xs: '1px solid', sm: 'none' },
                                borderColor: { xs: 'info.main', sm: 'transparent' },
                                borderRadius: { xs: 2, sm: 1 },
                                backgroundColor: {
                                  xs: alpha(theme.palette.info.main, 0.1),
                                  sm: 'transparent',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: {
                                    xs: alpha(theme.palette.info.main, 0.2),
                                    sm: alpha(theme.palette.action.hover, 0.1),
                                  },
                                  transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                                },
                                '&:active': {
                                  transform: 'scale(0.95)',
                                },
                              }}
                            >
                              <Edit sx={{ fontSize: { xs: 20, sm: 20 } }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Download Excel Report' arrow>
                            <IconButton
                              size={window.innerWidth < 600 ? 'medium' : 'small'}
                              onClick={() => handleDownload(assessment)}
                              sx={{
                                padding: { xs: '8px', sm: '8px' },
                                minWidth: { xs: '44px', sm: '40px' },
                                minHeight: { xs: '44px', sm: '40px' },
                                border: { xs: '1px solid', sm: 'none' },
                                borderColor: { xs: 'success.main', sm: 'transparent' },
                                borderRadius: { xs: 2, sm: 1 },
                                backgroundColor: {
                                  xs: alpha(theme.palette.success.main, 0.1),
                                  sm: 'transparent',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: {
                                    xs: alpha(theme.palette.success.main, 0.2),
                                    sm: alpha(theme.palette.action.hover, 0.1),
                                  },
                                  transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                                },
                                '&:active': {
                                  transform: 'scale(0.95)',
                                },
                              }}
                            >
                              <Download sx={{ fontSize: { xs: 20, sm: 20 } }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete Assessment' arrow>
                            <IconButton
                              size={window.innerWidth < 600 ? 'medium' : 'small'}
                              color='error'
                              onClick={() => handleDelete(assessment)}
                              sx={{
                                padding: { xs: '8px', sm: '8px' },
                                minWidth: { xs: '44px', sm: '40px' },
                                minHeight: { xs: '44px', sm: '40px' },
                                border: { xs: '1px solid', sm: 'none' },
                                borderColor: { xs: 'error.main', sm: 'transparent' },
                                borderRadius: { xs: 2, sm: 1 },
                                backgroundColor: {
                                  xs: alpha(theme.palette.error.main, 0.1),
                                  sm: 'transparent',
                                },
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: {
                                    xs: alpha(theme.palette.error.main, 0.2),
                                    sm: alpha(theme.palette.action.hover, 0.1),
                                  },
                                  transform: { xs: 'scale(1.05)', sm: 'scale(1.1)' },
                                },
                                '&:active': {
                                  transform: 'scale(0.95)',
                                },
                              }}
                            >
                              <Delete sx={{ fontSize: { xs: 20, sm: 20 } }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth='md'
        fullWidth
        fullScreen={window.innerWidth < 768}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Visibility sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant='h5' sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Assessment Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
          {selectedAssessment && (
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <Alert severity='info' sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                <strong>Assessment ID:</strong> {selectedAssessment.assessmentId}
              </Alert>

              {/* Customer Details and Results */}
              <Box
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3 },
                  flexWrap: 'wrap',
                  flexDirection: { xs: 'column', md: 'row' },
                }}
              >
                <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
                  <Card>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant='h6'
                        sx={{
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                      >
                        <Person sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} /> Customer Details
                      </Typography>
                      <Stack spacing={1}>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Monthly Income:</strong>{' '}
                          {formatCurrency(selectedAssessment.customerDetails.monthlyIncome)}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Existing EMI:</strong>{' '}
                          {formatCurrency(selectedAssessment.customerDetails.existingEMI)}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Requested Loan:</strong>{' '}
                          {formatCurrency(selectedAssessment.customerDetails.loanAmount)}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Property Value:</strong>{' '}
                          {formatCurrency(selectedAssessment.customerDetails.propertyValue)}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Loan Tenure:</strong>{' '}
                          {selectedAssessment.customerDetails.loanTenure} years
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Employment:</strong>{' '}
                          {selectedAssessment.customerDetails.employmentType}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Credit Score:</strong>{' '}
                          {selectedAssessment.customerDetails.creditScore}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 300 } }}>
                  <Card>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant='h6'
                        sx={{
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                      >
                        <TrendingUp sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} /> Assessment
                        Results
                      </Typography>
                      <Stack spacing={1}>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Max Eligible:</strong>{' '}
                          <span style={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                            {formatCurrency(selectedAssessment.results.maxLoanAmount)}
                          </span>
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Monthly EMI:</strong>{' '}
                          {formatCurrency(selectedAssessment.results.monthlyEMI)}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Risk Level:</strong>{' '}
                          <Chip
                            label={selectedAssessment.results.riskLevel}
                            color={getRiskChipColor(selectedAssessment.results.riskLevel) as any}
                            size='small'
                          />
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>Interest Rate:</strong>{' '}
                          {selectedAssessment.results.recommendedInterestRate}
                        </Typography>
                        <Typography
                          variant='body2'
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          <strong>FOIR Applied:</strong>{' '}
                          {selectedAssessment.bankerSettings.customFOIR}%
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Bank Settings & Notes */}
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Bank Settings & Notes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 250 }}>
                      <Typography>
                        <strong>Bank/Institution:</strong>{' '}
                        {selectedAssessment.bankerSettings.bankName || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Custom FOIR:</strong> {selectedAssessment.bankerSettings.customFOIR}
                        %
                      </Typography>
                      <Typography>
                        <strong>Interest Rate:</strong>{' '}
                        {selectedAssessment.bankerSettings.customInterestRate}%
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 250 }}>
                      <Typography>
                        <strong>Assessment Date:</strong>{' '}
                        {formatDate(selectedAssessment.assessmentDate)}
                      </Typography>
                      <Typography>
                        <strong>Assessed By:</strong> {selectedAssessment.assessedBy}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedAssessment.bankerSettings.notes && (
                    <Box>
                      <Typography>
                        <strong>Notes:</strong>
                      </Typography>
                      <Paper sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                        <Typography variant='body2'>
                          {selectedAssessment.bankerSettings.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              {selectedAssessment.results.recommendations.length > 0 && (
                <Card>
                  <CardContent>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                      Recommendations
                    </Typography>
                    <Stack spacing={1}>
                      {selectedAssessment.results.recommendations.map((rec, index) => (
                        <Alert key={index} severity='warning' variant='outlined'>
                          {rec}
                        </Alert>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Button
            onClick={() => selectedAssessment && handleDownload(selectedAssessment)}
            startIcon={<Download sx={{ fontSize: { xs: 18, sm: 20 } }} />}
            disabled={!selectedAssessment}
            variant='contained'
            fullWidth={window.innerWidth < 600}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Download Excel Report
          </Button>
          <Button
            onClick={() => setViewDialogOpen(false)}
            fullWidth={window.innerWidth < 600}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth='md'
        fullWidth
        fullScreen={window.innerWidth < 768}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Edit sx={{ mr: { xs: 1, sm: 2 }, fontSize: { xs: 20, sm: 24 } }} />
            <Typography variant='h5' sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Edit Assessment
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {editingAssessment && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <Alert severity='info'>
                <strong>Assessment ID:</strong> {editingAssessment.assessmentId}
              </Alert>

              {/* Bank Settings */}
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Bank Settings
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label='Bank/Institution'
                      value={editingAssessment.bankerSettings.bankName}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          bankerSettings: {
                            ...editingAssessment.bankerSettings,
                            bankName: e.target.value,
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 200 }}
                    />
                    <TextField
                      label='Custom FOIR (%)'
                      type='number'
                      value={editingAssessment.bankerSettings.customFOIR}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          bankerSettings: {
                            ...editingAssessment.bankerSettings,
                            customFOIR: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label='Interest Rate (%)'
                      type='number'
                      value={editingAssessment.bankerSettings.customInterestRate}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          bankerSettings: {
                            ...editingAssessment.bankerSettings,
                            customInterestRate: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                  </Box>
                  <TextField
                    label='Assessment Notes'
                    multiline
                    rows={3}
                    fullWidth
                    value={editingAssessment.bankerSettings.notes}
                    onChange={e =>
                      setEditingAssessment({
                        ...editingAssessment,
                        bankerSettings: {
                          ...editingAssessment.bankerSettings,
                          notes: e.target.value,
                        },
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    Customer Details
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      label='Monthly Income'
                      type='number'
                      value={editingAssessment.customerDetails.monthlyIncome}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            monthlyIncome: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label='Existing EMI'
                      type='number'
                      value={editingAssessment.customerDetails.existingEMI}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            existingEMI: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label='Credit Score'
                      type='number'
                      value={editingAssessment.customerDetails.creditScore}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            creditScore: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    <TextField
                      label='Loan Amount'
                      type='number'
                      value={editingAssessment.customerDetails.loanAmount}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            loanAmount: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label='Property Value'
                      type='number'
                      value={editingAssessment.customerDetails.propertyValue}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            propertyValue: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                      label='Loan Tenure (Years)'
                      type='number'
                      value={editingAssessment.customerDetails.loanTenure}
                      onChange={e =>
                        setEditingAssessment({
                          ...editingAssessment,
                          customerDetails: {
                            ...editingAssessment.customerDetails,
                            loanTenure: Number(e.target.value),
                          },
                        })
                      }
                      sx={{ flex: 1, minWidth: 150 }}
                    />
                  </Box>
                  <TextField
                    label='Employment Type'
                    select
                    value={editingAssessment.customerDetails.employmentType}
                    onChange={e =>
                      setEditingAssessment({
                        ...editingAssessment,
                        customerDetails: {
                          ...editingAssessment.customerDetails,
                          employmentType: e.target.value,
                        },
                      })
                    }
                    SelectProps={{
                      native: true,
                    }}
                    sx={{ mt: 2, minWidth: 200 }}
                  >
                    <option value='salaried'>Salaried</option>
                    <option value='self-employed'>Self Employed</option>
                    <option value='business'>Business</option>
                  </TextField>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant='contained' color='primary'>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this assessment? This action cannot be undone.
          </Typography>
          {selectedAssessment && (
            <Alert severity='warning' sx={{ mt: 2 }}>
              <strong>Assessment ID:</strong> {selectedAssessment.assessmentId}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentManager;
