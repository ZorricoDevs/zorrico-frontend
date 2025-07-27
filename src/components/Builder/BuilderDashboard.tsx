import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Business,
  Assessment,
  TrendingUp,
  AccountBalance,
  Visibility,
  Edit,
  Mail,
  People,
  Add,
  Phone,
  AttachMoney,
  Analytics
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Property {
  _id?: string; // MongoDB _id (optional)
  id: string;
  name: string;
  type: 'apartment' | 'villa' | 'commercial' | 'plot';
  location: string;
  area: string;
  pricePerSqft: number;
  totalUnits: number;
  availableUnits: number;
  configuration: string; // 1BHK, 2BHK, etc.
  amenities: string[];
  status: 'under_construction' | 'ready_to_move' | 'completed';
  leadRequests: number;
  soldUnits: number;
  completionDate: string;
  createdDate: string;
  builderId: string;
}

interface CustomerLead {
  _id?: string;
  id: string;
  customerName: string;
  email: string;
  phone: string;
  budget: number;
  preferredLocation: string;
  configuration: string;
  loanEligibility: number;
  creditScore?: number;
  monthlyIncome?: number;
  status: 'new' | 'contacted' | 'interested' | 'site_visit' | 'negotiating' | 'converted' | 'lost';
  matchedProperties: string[];
  leadCost: number;
  purchaseDate?: string;
  source: string;
  priority: 'high' | 'medium' | 'low';
}

interface DeveloperStats {
  totalProperties: number;
  activeProperties: number;
  totalLeads: number;
  purchasedLeads: number;
  convertedLeads: number;
  totalUnits: number;
  soldUnits: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageLeadCost: number;
  conversionRate: number;
}

const BuilderDashboard: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line no-unused-vars
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars
  const [tabValue, setTabValue] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [stats, setStats] = useState<DeveloperStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    purchasedLeads: 0,
    convertedLeads: 0,
    totalUnits: 0,
    soldUnits: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageLeadCost: 0,
    conversionRate: 0
  });
  const [openAddPropertyDialog, setOpenAddPropertyDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'apartment' as 'apartment' | 'villa' | 'commercial' | 'plot',
    location: '',
    area: '',
    pricePerSqft: 0,
    totalUnits: 0,
    configuration: '',
    amenities: '',
    completionDate: ''
  });
  // Edit property dialog state
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editPropertyForm, setEditPropertyForm] = useState<any>(null);
  // Analytics dialog state
  const [analyticsProperty, setAnalyticsProperty] = useState<Property | null>(null);


  useEffect(() => {
    const fetchBuilderData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Fetch properties for this builder
        const propRes = await fetch(`/api/builder/properties?builderId=${user?.id}`, { headers });
        if (propRes.status === 401 || propRes.status === 403) {
          alert('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!propRes.ok) throw new Error('Failed to fetch properties');
        const propContentType = propRes.headers.get('content-type');
        if (!propContentType || !propContentType.includes('application/json')) {
          const text = await propRes.text();
          console.error('Non-JSON response for properties:', text);
          throw new Error('Properties API did not return JSON');
        }
        const propData = await propRes.json();
        setProperties(propData);

        // Fetch leads assigned to this builder
        const leadRes = await fetch(`/api/builder/leads`, { headers });
        if (leadRes.status === 401 || leadRes.status === 403) {
          alert('Session expired or unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!leadRes.ok) throw new Error('Failed to fetch leads');
        const leadContentType = leadRes.headers.get('content-type');
        if (!leadContentType || !leadContentType.includes('application/json')) {
          const text = await leadRes.text();
          console.error('Non-JSON response for leads:', text);
          throw new Error('Leads API did not return JSON');
        }
        const leadData = await leadRes.json();
        setLeads(leadData);

        // Optionally, update stats here based on fetched data
        setStats((prev) => ({
          ...prev,
          totalProperties: propData.length,
          totalLeads: leadData.length,
          // Add more stats calculations as needed
        }));
      } catch (error) {
        console.error('Error fetching builder data:', error);
      }
    };
    if (user?.id) fetchBuilderData();
  }, [user, navigate]);

  const handleAddProperty = async () => {
    const newPropertyData: Property = {
      id: `PR${String(properties.length + 1).padStart(3, '0')}`,
      name: newProperty.name,
      type: newProperty.type,
      location: newProperty.location,
      area: newProperty.area,
      pricePerSqft: newProperty.pricePerSqft,
      totalUnits: newProperty.totalUnits,
      availableUnits: newProperty.totalUnits,
      configuration: newProperty.configuration,
      amenities: newProperty.amenities.split(',').map(a => a.trim()),
      status: 'under_construction',
      leadRequests: 0,
      soldUnits: 0,
      completionDate: newProperty.completionDate,
      createdDate: new Date().toISOString().split('T')[0],
      builderId: user?.id ?? ''
    };

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/builder/properties', {
        method: 'POST',
        headers,
        body: JSON.stringify(newPropertyData)
      });
      if (!res.ok) throw new Error('Failed to add property');
      const savedProperty = await res.json();
      setProperties([...properties, savedProperty]);
      setOpenAddPropertyDialog(false);
      setNewProperty({
        name: '',
        type: 'apartment',
        location: '',
        area: '',
        pricePerSqft: 0,
        totalUnits: 0,
        configuration: '',
        amenities: '',
        completionDate: ''
      });
    } catch (err) {
      alert('Error adding property: ' + (err as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'success';
      case 'interested': return 'success';
      case 'site_visit': return 'info';
      case 'negotiating': return 'warning';
      case 'contacted': return 'info';
      case 'new': return 'default';
      case 'lost': return 'error';
      case 'ready_to_move': return 'success';
      case 'under_construction': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <Business sx={{ mr: 2, color: '#28a745' }} />
        Builder Dashboard
      </Typography>

      {/* Stats Overview (Builder) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {stats.totalProperties}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Total Properties
                </Typography>
              </Box>
              <Business sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {stats.totalLeads}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Customer Leads
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {formatCurrency(stats.totalRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Total Revenue
                </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {formatCurrency(stats.averageLeadCost)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Avg Lead Cost
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, color: 'rgba(255,255,255,0.8)' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Performance Breakdown (Builder) */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
        gap: 3,
        mb: 4
      }}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#28a745', fontWeight: 'bold' }}>
                  {stats.activeProperties}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Active Properties
                </Typography>
              </Box>
              <Assessment sx={{ fontSize: 30, color: '#28a745' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  {stats.soldUnits}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Units Sold
                </Typography>
              </Box>
              <AccountBalance sx={{ fontSize: 30, color: '#1976d2' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  {formatCurrency(stats.monthlyRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Monthly Revenue
                </Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 30, color: '#ff9800' }} />
            </Box>
          </CardContent>
        </Card>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
                  {stats.purchasedLeads}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Purchased Leads
                </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 30, color: '#dc3545' }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions (Builder) */}
      <Card elevation={3} sx={{ mb: 4, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#495057' }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Add />}
              onClick={() => setOpenAddPropertyDialog(true)}
              sx={{
                backgroundColor: '#28a745',
                '&:hover': { backgroundColor: '#1e7e34' }
              }}
            >
              Add New Property
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<People />}
              onClick={() => setTabValue(1)}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              View Customer Leads
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs (Builder) */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Properties" />
          <Tab label="Customer Leads" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {/* Properties Tab (Builder) */}
      {tabValue === 0 && (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Property Portfolio</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: {properties.length} properties
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Price/Sq.Ft</TableCell>
                    <TableCell>Units</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Lead Requests</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property._id || property.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {property.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {property.id} • {property.configuration}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={property.type.replace('_', ' ').toUpperCase()}
                          size="small"
                          sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {property.location}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {property.area}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#28a745' }}>
                          ₹{property.pricePerSqft.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Available: {property.availableUnits}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Total: {property.totalUnits}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={property.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(property.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {property.leadRequests}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Property">
                        <IconButton size="small" color="secondary" onClick={() => {
                          setEditProperty(property);
                          setEditPropertyForm({ ...property, amenities: property.amenities.join(', ') });
                        }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Analytics">
                        <IconButton size="small" color="success" onClick={() => setAnalyticsProperty(property)}>
                          <Analytics />
                        </IconButton>
                      </Tooltip>
      {/* Edit Property Dialog */}
      <Dialog open={!!editProperty} onClose={() => setEditProperty(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          {editPropertyForm && (
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Property Name"
                value={editPropertyForm.name}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, name: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Property Type"
                select
                value={editPropertyForm.type}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, type: e.target.value }))}
                SelectProps={{ native: true }}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot</option>
              </TextField>
              <TextField
                fullWidth
                label="Location"
                value={editPropertyForm.location}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, location: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Area"
                value={editPropertyForm.area}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, area: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Price per Sq.Ft (₹)"
                type="number"
                value={editPropertyForm.pricePerSqft}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, pricePerSqft: Number(e.target.value) }))}
                required
              />
              <TextField
                fullWidth
                label="Total Units"
                type="number"
                value={editPropertyForm.totalUnits}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, totalUnits: Number(e.target.value) }))}
                required
              />
              <TextField
                fullWidth
                label="Configuration"
                value={editPropertyForm.configuration}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, configuration: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Amenities"
                multiline
                rows={3}
                value={editPropertyForm.amenities}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, amenities: e.target.value }))}
                required
              />
              <TextField
                fullWidth
                label="Expected Completion Date"
                type="date"
                value={editPropertyForm.completionDate}
                onChange={e => setEditPropertyForm((f: any) => ({ ...f, completionDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProperty(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!editPropertyForm) return;
              try {
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {
                  'Content-Type': 'application/json',
                };
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const res = await fetch(`/api/property/${editPropertyForm._id || editPropertyForm.id}`, {
                  method: 'PUT',
                  headers,
                  body: JSON.stringify({ ...editPropertyForm, amenities: editPropertyForm.amenities.split(',').map((a: string) => a.trim()) })
                });
                if (!res.ok) throw new Error('Failed to update property');
                const updated = await res.json();
                setProperties(props => props.map(p => (p._id === updated._id || p.id === updated.id) ? updated : p));
                setEditProperty(null);
              } catch (err) {
                alert('Error updating property: ' + (err as Error).message);
              }
            }}
            disabled={!editPropertyForm || !editPropertyForm.name || !editPropertyForm.type || !editPropertyForm.location || !editPropertyForm.area || !editPropertyForm.pricePerSqft || !editPropertyForm.totalUnits || !editPropertyForm.configuration || !editPropertyForm.amenities || !editPropertyForm.completionDate}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={!!analyticsProperty} onClose={() => setAnalyticsProperty(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Property Analytics</DialogTitle>
        <DialogContent>
          {analyticsProperty && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600}>{analyticsProperty.name}</Typography>
              <Typography variant="body2">Units Sold: {analyticsProperty.soldUnits}</Typography>
              <Typography variant="body2">Available Units: {analyticsProperty.availableUnits}</Typography>
              <Typography variant="body2">Total Units: {analyticsProperty.totalUnits}</Typography>
              <Typography variant="body2">Lead Requests: {analyticsProperty.leadRequests}</Typography>
              <Typography variant="body2">Completion Date: {analyticsProperty.completionDate}</Typography>
              {/* Add more analytics as needed */}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalyticsProperty(null)}>Close</Button>
        </DialogActions>
      </Dialog>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Customer Leads Tab (Builder) */}
      {tabValue === 1 && (
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Customer Leads</Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total: {leads.length} leads
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lead</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Budget & Eligibility</TableCell>
                    <TableCell>Preferred Location</TableCell>
                    <TableCell>Credit Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Lead Cost</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead._id || lead.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {lead.id}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {lead.configuration}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            {lead.customerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {lead.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">
                            Budget: {formatCurrency(lead.budget)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Eligible: {formatCurrency(lead.loanEligibility)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {lead.preferredLocation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{
                          fontWeight: 'bold',
                          color: (lead.creditScore || 0) >= 750 ? '#28a745' : (lead.creditScore || 0) >= 650 ? '#ff9800' : '#dc3545'
                        }}>
                          {lead.creditScore || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(lead.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          {formatCurrency(lead.leadCost)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Contact Customer">
                            <IconButton size="small" color="success">
                              <Phone />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton size="small" color="info">
                              <Mail />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab (Builder) */}
      {tabValue === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Performance Metrics</Typography>
              <Stack spacing={3}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Lead Conversion Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.conversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.conversionRate}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Properties Utilization</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.totalProperties > 0 ? ((stats.activeProperties / stats.totalProperties) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalProperties > 0 ? (stats.activeProperties / stats.totalProperties) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="primary"
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Sales Performance</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {stats.totalUnits > 0 ? ((stats.soldUnits / stats.totalUnits) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stats.totalUnits > 0 ? (stats.soldUnits / stats.totalUnits) * 100 : 0}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="warning"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Key Metrics</Typography>
              <Stack spacing={2}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Total Revenue</Typography>
                  <Typography variant="body2" sx={{
                    fontWeight: 'bold',
                    color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit'
                  }}>
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Monthly Revenue</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#28a745' }}>
                    {formatCurrency(stats.monthlyRevenue)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Average Lead Cost</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {formatCurrency(stats.averageLeadCost)}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  borderRadius: 1,
                  border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  <Typography variant="body2" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Total Units</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#dc3545' }}>
                    {stats.totalUnits}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Add Property Dialog (Builder) */}
      <Dialog open={openAddPropertyDialog} onClose={() => setOpenAddPropertyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Property Name"
              value={newProperty.name}
              onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Property Type"
              select
              value={newProperty.type}
              onChange={(e) => setNewProperty({...newProperty, type: e.target.value as any})}
              SelectProps={{ native: true }}
              required
            >
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="commercial">Commercial</option>
              <option value="plot">Plot</option>
            </TextField>
            <TextField
              fullWidth
              label="Location"
              value={newProperty.location}
              onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Area"
              value={newProperty.area}
              onChange={(e) => setNewProperty({...newProperty, area: e.target.value})}
              required
            />
            <TextField
              fullWidth
              label="Price per Sq.Ft (₹)"
              type="number"
              value={newProperty.pricePerSqft}
              onChange={(e) => setNewProperty({...newProperty, pricePerSqft: Number(e.target.value)})}
              required
            />
            <TextField
              fullWidth
              label="Total Units"
              type="number"
              value={newProperty.totalUnits}
              onChange={(e) => setNewProperty({...newProperty, totalUnits: Number(e.target.value)})}
              required
            />
            <TextField
              fullWidth
              label="Configuration"
              value={newProperty.configuration}
              onChange={(e) => setNewProperty({...newProperty, configuration: e.target.value})}
              placeholder="e.g., 1BHK, 2BHK, 3BHK"
              required
            />
            <TextField
              fullWidth
              label="Amenities"
              multiline
              rows={3}
              value={newProperty.amenities}
              onChange={(e) => setNewProperty({...newProperty, amenities: e.target.value})}
              placeholder="Separate amenities with commas"
              required
            />
            <TextField
              fullWidth
              label="Expected Completion Date"
              type="date"
              value={newProperty.completionDate}
              onChange={(e) => setNewProperty({...newProperty, completionDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPropertyDialog(false)}>Cancel</Button>
          <Button onClick={handleAddProperty} variant="contained">
            Add Property
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BuilderDashboard;
