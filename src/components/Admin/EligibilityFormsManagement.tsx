import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Card,
  CardContent,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

interface EligibilityForm {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  loanAmount?: number;
  monthlyIncome?: number;
  propertyLocation: string;
  bankName: string;
  status: 'new' | 'contacted' | 'converted' | 'rejected';
  leadScore: number;
  createdAt: string;
  eligibilityDetails?: {
    eligibleAmount: string;
    monthlyEMI: string;
    monthlyIncome: string;
  };
}

interface ConvertCustomerFormData {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  selectedBank: string;
  processingFee: number;
  temporaryPassword: string;
}

const EligibilityFormsManagement: React.FC = () => {
  const [forms, setForms] = useState<EligibilityForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<EligibilityForm | null>(null);
  const [convertFormData, setConvertFormData] = useState<ConvertCustomerFormData>({
    loanAmount: 0,
    interestRate: 8.5,
    tenure: 20,
    selectedBank: '',
    processingFee: 0,
    temporaryPassword: 'HomeClient123!',
  });

  // Fetch eligibility forms
  const fetchEligibilityForms = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getEligibilityForms();

      if (data.success) {
        setForms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching eligibility forms:', error);
      setError('Failed to load eligibility forms');
    } finally {
      setLoading(false);
    }
  };

  // Convert customer to client
  const handleConvertCustomer = async () => {
    if (!selectedForm) {
      return;
    }

    try {
      setLoading(true);
      const data = await adminAPI.convertCustomer(selectedForm._id);

      if (data.success) {
        setSuccess(`Customer successfully converted! Application #${data.data.applicationNumber}`);
        setConvertDialogOpen(false);
        setSelectedForm(null);
        fetchEligibilityForms(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to convert customer');
      }
    } catch (error) {
      console.error('Error converting customer:', error);
      setError(error instanceof Error ? error.message : 'Failed to convert customer');
    } finally {
      setLoading(false);
    }
  };

  // Update form status
  const updateFormStatus = async (formId: string, status: string, notes = '') => {
    try {
      const data = await adminAPI.updateFormStatus(formId, status);

      if (data.success) {
        setSuccess('Status updated successfully');
        fetchEligibilityForms();
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  useEffect(() => {
    fetchEligibilityForms();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'primary';
      case 'contacted':
        return 'warning';
      case 'converted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 80) {
      return 'success';
    }
    if (score >= 60) {
      return 'warning';
    }
    return 'error';
  };

  const openConvertDialog = (form: EligibilityForm) => {
    setSelectedForm(form);
    // Extract loan amount from eligibility details or use form loanAmount
    const loanAmount =
      form.loanAmount ||
      parseInt(form.eligibilityDetails?.eligibleAmount?.replace(/[^0-9]/g, '') || '0');

    setConvertFormData({
      ...convertFormData,
      loanAmount: loanAmount,
      selectedBank: form.bankName || '',
    });
    setConvertDialogOpen(true);
  };

  const calculateEMI = () => {
    const { loanAmount, interestRate, tenure } = convertFormData;
    if (loanAmount > 0 && interestRate > 0 && tenure > 0) {
      const monthlyRate = interestRate / 12 / 100;
      const months = tenure * 12;
      const emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  const calculateTotals = () => {
    const emi = calculateEMI();
    const totalAmount = emi * convertFormData.tenure * 12;
    const totalInterest = totalAmount - convertFormData.loanAmount;
    return { emi, totalAmount, totalInterest };
  };

  if (loading && forms.length === 0) {
    return (
      <Container maxWidth='lg' sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Customer Conversion Management
      </Typography>
      <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 3 }}>
        Convert eligible customers to clients and manage their onboarding
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Details</TableCell>
              <TableCell>Loan Details</TableCell>
              <TableCell>Lead Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map(form => (
              <TableRow key={form._id}>
                <TableCell>
                  <Box>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      {form.fullName}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {form.email}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {form.phone}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant='body2'>
                      <strong>Amount:</strong> ₹
                      {(
                        form.loanAmount ||
                        parseInt(
                          form.eligibilityDetails?.eligibleAmount?.replace(/[^0-9]/g, '') || '0'
                        )
                      ).toLocaleString()}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Income:</strong> ₹{form.eligibilityDetails?.monthlyIncome || 'N/A'}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Bank:</strong> {form.bankName || 'Not specified'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${form.leadScore || 0}%`}
                    color={getLeadScoreColor(form.leadScore || 0)}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <Chip label={form.status} color={getStatusColor(form.status)} size='small' />
                </TableCell>
                <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {form.status === 'new' || form.status === 'contacted' ? (
                      <>
                        <Tooltip title='Convert to Client'>
                          <Button
                            size='small'
                            variant='contained'
                            color='success'
                            startIcon={<PersonAddIcon />}
                            onClick={() => openConvertDialog(form)}
                          >
                            Convert
                          </Button>
                        </Tooltip>
                        {form.status === 'new' && (
                          <Tooltip title='Mark as Contacted'>
                            <Button
                              size='small'
                              variant='outlined'
                              color='warning'
                              startIcon={<EditIcon />}
                              onClick={() =>
                                updateFormStatus(
                                  form._id,
                                  'contacted',
                                  'Customer contacted by admin'
                                )
                              }
                            >
                              Contact
                            </Button>
                          </Tooltip>
                        )}
                        <Tooltip title='Reject Application'>
                          <Button
                            size='small'
                            variant='outlined'
                            color='error'
                            startIcon={<CancelIcon />}
                            onClick={() =>
                              updateFormStatus(
                                form._id,
                                'rejected',
                                'Application rejected by admin'
                              )
                            }
                          >
                            Reject
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <Chip
                        label={form.status === 'converted' ? 'Converted to Client' : 'Rejected'}
                        color={form.status === 'converted' ? 'success' : 'error'}
                        size='small'
                        icon={form.status === 'converted' ? <CheckCircleIcon /> : <CancelIcon />}
                      />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {forms.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant='h6' color='text.secondary'>
            No eligibility forms found
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Customer forms will appear here when submitted through the website
          </Typography>
        </Box>
      )}

      {/* Convert Customer Dialog */}
      <Dialog
        open={convertDialogOpen}
        onClose={() => setConvertDialogOpen(false)}
        maxWidth='md'
        fullWidth
      >
        <DialogTitle>Convert Customer to Client</DialogTitle>
        <DialogContent>
          {selectedForm && (
            <Box sx={{ mt: 2 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography>
                        <strong>Name:</strong> {selectedForm.fullName}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {selectedForm.email}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {selectedForm.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography>
                        <strong>Monthly Income:</strong> ₹
                        {selectedForm.eligibilityDetails?.monthlyIncome || 'N/A'}
                      </Typography>
                      <Typography>
                        <strong>Property Location:</strong> {selectedForm.propertyLocation}
                      </Typography>
                      <Typography>
                        <strong>Lead Score:</strong> {selectedForm.leadScore || 0}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Typography variant='h6' gutterBottom>
                Loan Configuration
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  fullWidth
                  label='Loan Amount (₹)'
                  type='number'
                  value={convertFormData.loanAmount}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      loanAmount: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  fullWidth
                  label='Interest Rate (%)'
                  type='number'
                  inputProps={{ step: '0.1' }}
                  value={convertFormData.interestRate}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      interestRate: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  fullWidth
                  label='Tenure (Years)'
                  type='number'
                  value={convertFormData.tenure}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      tenure: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  fullWidth
                  label='Selected Bank'
                  value={convertFormData.selectedBank}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      selectedBank: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label='Processing Fee (₹)'
                  type='number'
                  value={convertFormData.processingFee}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      processingFee: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  fullWidth
                  label='Temporary Password'
                  value={convertFormData.temporaryPassword}
                  onChange={e =>
                    setConvertFormData({
                      ...convertFormData,
                      temporaryPassword: e.target.value,
                    })
                  }
                  helperText='This will be sent to customer for initial login'
                />
              </Box>

              {/* EMI Calculation Preview */}
              {convertFormData.loanAmount > 0 &&
                convertFormData.interestRate > 0 &&
                convertFormData.tenure > 0 && (
                  <Card sx={{ mt: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <CardContent>
                      <Typography variant='h6' gutterBottom>
                        Loan Summary
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                        <Box>
                          <Typography>
                            <strong>Monthly EMI:</strong>
                          </Typography>
                          <Typography variant='h6'>
                            ₹{calculateTotals().emi.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography>
                            <strong>Total Amount:</strong>
                          </Typography>
                          <Typography variant='h6'>
                            ₹{Math.round(calculateTotals().totalAmount).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography>
                            <strong>Total Interest:</strong>
                          </Typography>
                          <Typography variant='h6'>
                            ₹{Math.round(calculateTotals().totalInterest).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConvertCustomer} variant='contained' disabled={loading}>
            {loading ? 'Converting...' : 'Convert to Client'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity='success' sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EligibilityFormsManagement;
