export {}; // Explicit module declaration
import React, { useState } from 'react';
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
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface Application {
  id: string;
  applicantName: string;
  loanAmount: number;
  loanType: string;
  status: string;
  dateApplied: string;
  bankName: string;
  interestRate: number;
}

const AdminApplicationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Mock data - replace with actual API call
  const applications: Application[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      loanAmount: 5000000,
      loanType: 'Home Loan',
      status: 'Pending',
      dateApplied: '2024-01-15',
      bankName: 'HDFC Bank',
      interestRate: 8.5
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      loanAmount: 7500000,
      loanType: 'Home Loan',
      status: 'Approved',
      dateApplied: '2024-01-12',
      bankName: 'SBI',
      interestRate: 8.2
    },
    {
      id: '3',
      applicantName: 'Mike Johnson',
      loanAmount: 3000000,
      loanType: 'Home Loan',
      status: 'Under Review',
      dateApplied: '2024-01-18',
      bankName: 'ICICI Bank',
      interestRate: 8.7
    },
    {
      id: '4',
      applicantName: 'Sarah Wilson',
      loanAmount: 4500000,
      loanType: 'Home Loan',
      status: 'Rejected',
      dateApplied: '2024-01-10',
      bankName: 'Axis Bank',
      interestRate: 8.9
    },
    {
      id: '5',
      applicantName: 'David Brown',
      loanAmount: 6000000,
      loanType: 'Home Loan',
      status: 'Approved',
      dateApplied: '2024-01-20',
      bankName: 'Kotak Mahindra',
      interestRate: 8.3
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Under Review': return 'info';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedApp(appId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApp(null);
  };

  const handleStatusUpdate = (newStatus: string) => {
    // TODO: Implement status update logic here with proper API call
    handleMenuClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      py: 3
    }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              mb: 1
            }}
          >
            Applications Management
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            Monitor and manage all loan applications
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          flexWrap: 'wrap'
        }}>
          <TextField
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#555' },
                '&.Mui-focused fieldset': { borderColor: '#304FFE' },
              },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(event: SelectChangeEvent) => setStatusFilter(event.target.value)}
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#304FFE' },
                '& .MuiSelect-icon': { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Applications Table */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: '#1a1a1a',
            borderRadius: 2,
            border: '1px solid #333'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: '1px solid #333' } }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Applicant</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loan Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bank</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Interest Rate</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Applied</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow
                  key={app.id}
                  sx={{
                    '&:hover': { backgroundColor: '#222' },
                    '& td': { borderBottom: '1px solid #333' }
                  }}
                >
                  <TableCell sx={{ color: 'white' }}>{app.applicantName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{formatCurrency(app.loanAmount)}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{app.loanType}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{app.bankName}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{app.interestRate}%</TableCell>
                  <TableCell>
                    <Chip
                      label={app.status}
                      color={getStatusColor(app.status) as any}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        minWidth: 84
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(app.dateApplied).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={(e) => handleMenuOpen(e, app.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: '#1a1a1a',
              border: '1px solid #333'
            }
          }}
        >
          <MenuItem onClick={() => handleStatusUpdate('Approved')} sx={{ color: 'white' }}>
            <CheckIcon sx={{ mr: 1 }} /> Approve
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Under Review')} sx={{ color: 'white' }}>
            <SearchIcon sx={{ mr: 1 }} /> Review
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('Rejected')} sx={{ color: 'white' }}>
            <CloseIcon sx={{ mr: 1 }} /> Reject
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>
            Cancel
          </MenuItem>
        </Menu>

        {filteredApplications.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 4,
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <Typography variant="h6">
              No applications found
            </Typography>
            <Typography variant="body2">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminApplicationsPage;
