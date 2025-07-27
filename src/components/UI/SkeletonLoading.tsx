import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

interface SkeletonLoadingProps {
  variant?: 'dashboard' | 'table' | 'card' | 'form' | 'list';
  rows?: number;
  height?: number | string;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  variant = 'card',
  rows = 3,
  height = 'auto'
}) => {
  switch (variant) {
    case 'dashboard':
      return (
        <Box sx={{ p: 3 }} data-testid="skeleton-dashboard">
          {/* Stats Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 3,
            mb: 4
          }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} elevation={3} data-testid="skeleton-card">
                <CardContent>
                  <Stack spacing={2}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="rectangular" width="100%" height={8} />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Chart Area */}
          <Card elevation={3} data-testid="skeleton-chart">
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={300} />
            </CardContent>
          </Card>
        </Box>
      );

    case 'table':
      return (
        <Card elevation={3}>
          <CardContent>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
            <Stack spacing={2}>
              {/* Table Header */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="text" width="20%" height={24} />
                <Skeleton variant="text" width="25%" height={24} />
                <Skeleton variant="text" width="20%" height={24} />
                <Skeleton variant="text" width="15%" height={24} />
                <Skeleton variant="text" width="20%" height={24} />
              </Box>

              {/* Table Rows */}
              {Array.from({ length: rows }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width="20%" height={20} />
                  <Skeleton variant="text" width="25%" height={20} />
                  <Skeleton variant="text" width="20%" height={20} />
                  <Skeleton variant="text" width="15%" height={20} />
                  <Skeleton variant="rectangular" width="20%" height={32} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      );

    case 'form':
      return (
        <Card elevation={3}>
          <CardContent>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 3 }} />
            <Stack spacing={3}>
              {Array.from({ length: rows }).map((_, index) => (
                <Box key={index}>
                  <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" width="100%" height={56} />
                </Box>
              ))}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Skeleton variant="rectangular" width={100} height={40} />
                <Skeleton variant="rectangular" width={120} height={40} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      );

    case 'list':
      return (
        <Card elevation={3}>
          <CardContent>
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
            <Stack spacing={2}>
              {Array.from({ length: rows }).map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Skeleton variant="rectangular" width={60} height={60} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={24} />
                    <Skeleton variant="text" width="50%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                  <Skeleton variant="circular" width={32} height={32} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      );

    default: // 'card'
      return (
        <Card elevation={3} sx={{ height }}>
          <CardContent>
            <Stack spacing={2}>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={120} />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Skeleton variant="rectangular" width={80} height={36} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      );
  }
};

export default SkeletonLoading;
