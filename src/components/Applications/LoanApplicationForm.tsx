import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Stack,
  Paper,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface ApplicationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
  };
  employmentInfo: {
    employmentType: string;
    companyName: string;
    designation: string;
    monthlyIncome: string;
    experienceYears: string;
    officeAddress: string;
  };
  propertyInfo: {
    propertyType: string;
    propertyValue: string;
    downPayment: string;
    propertyAddress: string;
    constructionStatus: string;
  };
  loanInfo: {
    loanAmount: string;
    tenure: string;
    selectedBank: string;
    interestRate: string;
  };
  documents: {
    identityProof: File | null;
    addressProof: File | null;
    incomeProof: File | null;
    propertyDocuments: File | null;
  };
}

const LoanApplicationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      maritalStatus: '',
    },
    employmentInfo: {
      employmentType: '',
      companyName: '',
      designation: '',
      monthlyIncome: '',
      experienceYears: '',
      officeAddress: '',
    },
    propertyInfo: {
      propertyType: '',
      propertyValue: '',
      downPayment: '',
      propertyAddress: '',
      constructionStatus: '',
    },
    loanInfo: {
      loanAmount: '',
      tenure: '',
      selectedBank: '',
      interestRate: '',
    },
    documents: {
      identityProof: null,
      addressProof: null,
      incomeProof: null,
      propertyDocuments: null,
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');

  const steps = [
    'Personal Information',
    'Employment Details',
    'Property Information',
    'Loan Details',
    'Document Upload',
  ];

  useEffect(() => {
    // Load pre-filled data from eligibility checker if available
    const savedData = localStorage.getItem('loanApplicationData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setApplicationData(prev => ({
        ...prev,
        loanInfo: {
          ...prev.loanInfo,
          loanAmount: data.maxLoanAmount?.toString() || data.loanAmount?.toString() || '',
          selectedBank: data.selectedBank || '',
          tenure: data.requestedTenure?.toString() || data.tenure?.toString() || '',
          interestRate: data.interestRate?.toString() || '8.5',
        },
        employmentInfo: {
          ...prev.employmentInfo,
          monthlyIncome: data.monthlyIncome || '',
          employmentType: data.employmentType || '',
          experienceYears: data.experienceYears || '',
        },
      }));
    }
  }, []);

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleInputChange = (section: keyof ApplicationData, field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileUpload = (field: string, file: File) => {
    setApplicationData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file,
      },
    }));
  };

  const handleSubmit = async () => {
    // Generate simplified application number (HLM-0000000000)
    const timestamp = Date.now().toString();
    const appNumber = `HLM-${timestamp.slice(-10).padStart(10, '0')}`;
    setApplicationNumber(appNumber);

    // Store application data (in real app, this would be sent to backend)
    const applicationPayload = {
      ...applicationData,
      applicationNumber: appNumber,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      nextSteps: [
        'Application under review',
        'Document verification',
        'Bank processing',
        'Approval/Rejection',
      ],
    };

    localStorage.setItem('loanApplication_' + appNumber, JSON.stringify(applicationPayload));

    // In real app, this would create customer credentials via admin
    // Application submitted successfully
    setSubmitted(true);
  };

  const renderPersonalInfo = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Personal Information
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='First Name'
              value={applicationData.personalInfo.firstName}
              onChange={e => handleInputChange('personalInfo', 'firstName', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Last Name'
              value={applicationData.personalInfo.lastName}
              onChange={e => handleInputChange('personalInfo', 'lastName', e.target.value)}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Email'
              type='email'
              value={applicationData.personalInfo.email}
              onChange={e => handleInputChange('personalInfo', 'email', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Phone Number'
              type='tel'
              value={applicationData.personalInfo.phone}
              onChange={e => handleInputChange('personalInfo', 'phone', e.target.value)}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Date of Birth'
              type='date'
              value={applicationData.personalInfo.dateOfBirth}
              onChange={e => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={applicationData.personalInfo.gender}
                onChange={e => handleInputChange('personalInfo', 'gender', e.target.value)}
              >
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
                <MenuItem value='other'>Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={applicationData.personalInfo.maritalStatus}
              onChange={e => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
            >
              <MenuItem value='single'>Single</MenuItem>
              <MenuItem value='married'>Married</MenuItem>
              <MenuItem value='divorced'>Divorced</MenuItem>
              <MenuItem value='widowed'>Widowed</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderEmploymentInfo = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Employment Information
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Employment Type</InputLabel>
            <Select
              value={applicationData.employmentInfo.employmentType}
              onChange={e => handleInputChange('employmentInfo', 'employmentType', e.target.value)}
            >
              <MenuItem value='salaried'>Salaried Employee</MenuItem>
              <MenuItem value='self-employed'>Self Employed Professional</MenuItem>
              <MenuItem value='business'>Business Owner</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Company/Business Name'
              value={applicationData.employmentInfo.companyName}
              onChange={e => handleInputChange('employmentInfo', 'companyName', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Designation'
              value={applicationData.employmentInfo.designation}
              onChange={e => handleInputChange('employmentInfo', 'designation', e.target.value)}
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Monthly Income (₹)'
              type='number'
              value={applicationData.employmentInfo.monthlyIncome}
              onChange={e => handleInputChange('employmentInfo', 'monthlyIncome', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Experience (Years)'
              type='number'
              value={applicationData.employmentInfo.experienceYears}
              onChange={e => handleInputChange('employmentInfo', 'experienceYears', e.target.value)}
              required
            />
          </Box>

          <TextField
            fullWidth
            label='Office Address'
            multiline
            rows={3}
            value={applicationData.employmentInfo.officeAddress}
            onChange={e => handleInputChange('employmentInfo', 'officeAddress', e.target.value)}
            required
          />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderPropertyInfo = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Property Information
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={applicationData.propertyInfo.propertyType}
              onChange={e => handleInputChange('propertyInfo', 'propertyType', e.target.value)}
            >
              <MenuItem value='apartment'>Apartment</MenuItem>
              <MenuItem value='independent-house'>Independent House</MenuItem>
              <MenuItem value='villa'>Villa</MenuItem>
              <MenuItem value='plot'>Plot</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Property Value (₹)'
              type='number'
              value={applicationData.propertyInfo.propertyValue}
              onChange={e => handleInputChange('propertyInfo', 'propertyValue', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Down Payment (₹)'
              type='number'
              value={applicationData.propertyInfo.downPayment}
              onChange={e => handleInputChange('propertyInfo', 'downPayment', e.target.value)}
              required
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Construction Status</InputLabel>
            <Select
              value={applicationData.propertyInfo.constructionStatus}
              onChange={e =>
                handleInputChange('propertyInfo', 'constructionStatus', e.target.value)
              }
            >
              <MenuItem value='ready-to-move'>Ready to Move</MenuItem>
              <MenuItem value='under-construction'>Under Construction</MenuItem>
              <MenuItem value='new-construction'>New Construction</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label='Property Address'
            multiline
            rows={3}
            value={applicationData.propertyInfo.propertyAddress}
            onChange={e => handleInputChange('propertyInfo', 'propertyAddress', e.target.value)}
            required
          />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderLoanInfo = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Loan Information
        </Typography>
        <Stack spacing={2}>
          <Alert severity='info'>
            These details are pre-filled based on your eligibility check. You can modify them if
            needed.
          </Alert>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label='Loan Amount (₹)'
              type='number'
              value={applicationData.loanInfo.loanAmount}
              onChange={e => handleInputChange('loanInfo', 'loanAmount', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Tenure (Years)'
              type='number'
              value={applicationData.loanInfo.tenure}
              onChange={e => handleInputChange('loanInfo', 'tenure', e.target.value)}
              required
            />
          </Box>

          <TextField
            fullWidth
            label='Preferred Bank'
            value={applicationData.loanInfo.selectedBank}
            onChange={e => handleInputChange('loanInfo', 'selectedBank', e.target.value)}
            helperText='Bank you selected during eligibility check'
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            fullWidth
            label='Expected Interest Rate (%)'
            value={applicationData.loanInfo.interestRate}
            onChange={e => handleInputChange('loanInfo', 'interestRate', e.target.value)}
            helperText='This is indicative. Final rate will be determined by the bank.'
          />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderDocumentUpload = () => (
    <Card>
      <CardContent>
        <Typography variant='h6' gutterBottom>
          Document Upload
        </Typography>
        <Stack spacing={3}>
          <Alert severity='warning'>
            Please upload clear, readable copies of all required documents. Supported formats: PDF,
            JPG, PNG
          </Alert>

          {[
            { key: 'identityProof', label: 'Identity Proof (Aadhar/PAN/Passport)', required: true },
            {
              key: 'addressProof',
              label: 'Address Proof (Utility Bill/Rent Agreement)',
              required: true,
            },
            {
              key: 'incomeProof',
              label: 'Income Proof (Salary Slips/ITR/Bank Statements)',
              required: true,
            },
            {
              key: 'propertyDocuments',
              label: 'Property Documents (Sale Deed/Agreement)',
              required: true,
            },
          ].map(doc => (
            <Box key={doc.key}>
              <Typography variant='subtitle2' gutterBottom>
                {doc.label} {doc.required && '*'}
              </Typography>
              <Button
                variant='outlined'
                component='label'
                fullWidth
                sx={{ justifyContent: 'flex-start', p: 2 }}
              >
                {applicationData.documents[doc.key as keyof typeof applicationData.documents]
                  ?.name || 'Choose File'}
                <input
                  type='file'
                  hidden
                  accept='.pdf,.jpg,.jpeg,.png'
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(doc.key, file);
                    }
                  }}
                />
              </Button>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );

  if (submitted) {
    return (
      <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant='h4' gutterBottom>
          Application Submitted Successfully!
        </Typography>

        <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.light' }}>
          <Typography variant='h6' gutterBottom>
            Application Number
          </Typography>
          <Typography variant='h4' sx={{ fontFamily: 'monospace' }}>
            {applicationNumber}
          </Typography>
        </Paper>

        <Alert severity='info' sx={{ mb: 3 }}>
          <Typography variant='body1'>
            <strong>What happens next?</strong>
            <br />
            1. Our admin team will review your application within 24 hours
            <br />
            2. Customer login credentials will be created and sent to your email
            <br />
            3. You can then track your application status and EMI payments
            <br />
            4. Bank representative will contact you for further processing
          </Typography>
        </Alert>

        <Button variant='contained' size='large' onClick={() => (window.location.href = '/')}>
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant='h4' gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Loan Application Form
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>
        {activeStep === 0 && renderPersonalInfo()}
        {activeStep === 1 && renderEmploymentInfo()}
        {activeStep === 2 && renderPropertyInfo()}
        {activeStep === 3 && renderLoanInfo()}
        {activeStep === 4 && renderDocumentUpload()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant='outlined'>
          Back
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button onClick={handleSubmit} variant='contained' size='large'>
            Submit Application
          </Button>
        ) : (
          <Button onClick={handleNext} variant='contained'>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default LoanApplicationForm;
