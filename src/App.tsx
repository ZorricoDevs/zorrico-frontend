import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import AuthProvider from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import FinanceLoader from './components/UI/FinanceLoader';
import ErrorBoundary from './components/UI/ErrorBoundary';
import ChunkErrorBoundary from './components/UI/ChunkErrorBoundary';
import AuthErrorBoundary from './components/UI/AuthErrorBoundary';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/UI/ScrollToTop';
import ISO270012022Page from './pages/ISO270012022Page';
import BuilderLoginPage from './pages/BuilderLoginPage';

// Optimized lazy loading - simpler in development, robust in production
const lazyWithRetry = (importFunc: () => Promise<any>) => {
  // In development, use simpler loading for faster startup
  if (process.env.NODE_ENV === 'development') {
    return React.lazy(importFunc);
  }

  // In production, use robust retry logic
  return React.lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const componentModule = await importFunc();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return componentModule;
    } catch (error: any) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Chunk load error - force refresh once
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        console.log('Chunk loading failed, forcing page refresh...');
        window.location.reload();
      }
      // If refresh already happened and still failing, throw the error
      throw error;
    }
  });
};

const HomePage = lazyWithRetry(() => import('./pages/HomePage'));
const ApplicationsPage = lazyWithRetry(() => import('./pages/ApplicationsPage'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const Settings = lazyWithRetry(() => import('./pages/Settings'));
const AdminApplicationsPage = lazyWithRetry(() => import('./pages/AdminApplicationsPage'));
const EligibilityChecker = lazyWithRetry(
  () => import('./components/Calculators/EligibilityChecker')
);
const EMICalculator = lazyWithRetry(() => import('./components/Calculators/EMICalculator'));
const LoanApplicationForm = lazyWithRetry(
  () => import('./components/Applications/LoanApplicationForm')
);
const CustomerDashboard = lazyWithRetry(() => import('./components/Customer/CustomerDashboard'));
const BrokerDashboard = lazyWithRetry(() => import('./components/Broker/BrokerDashboard'));
const BuilderDashboard = lazyWithRetry(() => import('./components/Builder/BuilderDashboard'));
const AdminDashboard = lazyWithRetry(() => import('./components/Admin/AdminDashboard'));
const CustomerLoginPage = lazyWithRetry(() => import('./pages/CustomerLoginPage'));
const BrokerLoginPage = lazyWithRetry(() => import('./pages/BrokerLoginPage'));
const BankerLoginPage = lazyWithRetry(() => import('./pages/BankerLoginPage'));
const BankerDashboardPage = lazyWithRetry(() => import('./pages/BankerDashboardPage'));
const BankerEligibilityChecker = lazyWithRetry(
  () => import('./components/Calculators/BankerEligibilityChecker')
);
const LenderLoginPage = lazyWithRetry(() => import('./pages/LenderLoginPage'));
const AdminLoginPage = lazyWithRetry(() => import('./pages/AdminLoginPage'));
const AboutUsPage = lazyWithRetry(() => import('./pages/AboutUsPage'));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'));
const CareersPage = lazyWithRetry(() => import('./pages/CareersPage'));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazyWithRetry(() => import('./pages/TermsOfUsePage'));
const SecurityDisclosurePage = lazyWithRetry(() => import('./pages/SecurityDisclosurePage'));
const NewsroomPage = lazyWithRetry(() => import('./pages/NewsroomPage'));
const HomeLoansPage = lazyWithRetry(() => import('./pages/HomeLoansPage'));

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});

// Use FinanceLoader directly for all Suspense fallback loading screens

const AppContent: React.FC = () => {
  const themeContext = useTheme() as { theme: 'light' | 'dark' } | null;
  const mode = themeContext?.theme || 'light';

  const muiTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#ffffff',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow:
              mode === 'dark' ? '0 4px 8px rgba(0, 0, 0, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <AuthErrorBoundary>
          <AuthProvider>
            <Router>
              <ScrollToTop />
              <div className='App'>
                <Navbar />
                <main style={{ minHeight: 'calc(100vh - 88px)' }}>
                  <Suspense fallback={<FinanceLoader />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path='/' element={<HomePage />} />
                      <Route path='/home' element={<HomePage />} />
                      <Route path='/loans' element={<HomePage />} />

                      {/* Calculator Routes - Multiple paths for flexibility */}
                      <Route path='/calculator/emi' element={<EMICalculator />} />
                      <Route path='/emi-calculator' element={<EMICalculator />} />
                      <Route path='/calculator/eligibility' element={<EligibilityChecker />} />
                      <Route path='/eligibility-checker' element={<EligibilityChecker />} />

                      {/* Tools and Additional Routes */}
                      <Route path='/apply-loan' element={<LoanApplicationForm />} />
                      <Route path='/support' element={<ContactPage />} />
                      <Route path='/about' element={<AboutUsPage />} />
                      <Route path='/contact' element={<ContactPage />} />

                      {/* Footer Company Links */}
                      <Route path='/aboutus' element={<AboutUsPage />} />
                      <Route path='/careers' element={<CareersPage />} />
                      <Route path='/newsroom' element={<NewsroomPage />} />

                      {/* Footer Product Links */}
                      <Route path='/emicalculator' element={<EMICalculator />} />
                      <Route path='/homeloans' element={<HomeLoansPage />} />
                      <Route path='/applicationtracker' element={<ApplicationsPage />} />
                      <Route path='/loanadvisory' element={<HomePage />} />

                      {/* Footer Security Links */}
                      <Route path='/securitydisclosure' element={<SecurityDisclosurePage />} />
                      <Route path='/loanaggregation' element={<HomePage />} />
                      <Route path='/iso270012022' element={<ISO270012022Page />} />

                      {/* Login Routes - Multiple paths */}
                      <Route path='/login' element={<CustomerLoginPage />} />
                      <Route path='/login/customer' element={<CustomerLoginPage />} />
                      <Route path='/login/broker' element={<BrokerLoginPage />} />
                      <Route path='/login/banker' element={<BankerLoginPage />} />
                      <Route path='/login/lender' element={<LenderLoginPage />} />
                      <Route path='/login/admin' element={<AdminLoginPage />} />

                      {/* Footer Login Links */}
                      <Route path='/admin-login' element={<AdminLoginPage />} />
                      <Route path='/customer-login' element={<CustomerLoginPage />} />
                      <Route path='/broker-login' element={<BrokerLoginPage />} />
                      <Route path='/banker-login' element={<BankerLoginPage />} />
                      <Route path='/lender-login' element={<LenderLoginPage />} />
                      <Route path='/builder-login' element={<BuilderLoginPage />} />

                      {/* Protected Routes - Customer */}
                      <Route
                        path='/dashboard'
                        element={
                          <ProtectedRoute>
                            <CustomerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/dashboard/customer'
                        element={
                          <ProtectedRoute>
                            <CustomerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/customer-dashboard'
                        element={
                          <ProtectedRoute>
                            <CustomerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/applications'
                        element={
                          <ProtectedRoute>
                            <ApplicationsPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/apply'
                        element={
                          <ProtectedRoute>
                            <LoanApplicationForm />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/profile'
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/settings'
                        element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes - Broker */}
                      <Route
                        path='/dashboard/broker'
                        element={
                          <ProtectedRoute>
                            <BrokerDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/broker-dashboard'
                        element={
                          <ProtectedRoute>
                            <BrokerDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes - Banker */}
                      <Route
                        path='/dashboard/banker'
                        element={
                          <ProtectedRoute>
                            <BankerDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/banker-dashboard'
                        element={
                          <ProtectedRoute>
                            <BankerDashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/banker-eligibility-checker'
                        element={
                          <ProtectedRoute>
                            <BankerEligibilityChecker />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes - Builder */}
                      <Route
                        path='/dashboard/builder'
                        element={
                          <ProtectedRoute>
                            <BuilderDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/builder-dashboard'
                        element={
                          <ProtectedRoute>
                            <BuilderDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/builder'
                        element={
                          <ProtectedRoute>
                            <BuilderDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Routes - Admin */}
                      <Route
                        path='/dashboard/admin'
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/admin/dashboard'
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/admin-dashboard'
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/admin/applications'
                        element={
                          <ProtectedRoute requireAdmin={true}>
                            <AdminApplicationsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Legal Pages */}
                      <Route path='/privacypolicy' element={<PrivacyPolicyPage />} />
                      <Route path='/termsofuse' element={<TermsOfUsePage />} />

                      {/* 404 Not Found Route - Show proper error instead of redirecting to HomePage */}
                      <Route
                        path='*'
                        element={
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '60vh',
                              textAlign: 'center',
                              padding: '2rem',
                            }}
                          >
                            <h2 style={{ marginBottom: '1rem', color: '#666' }}>
                              🔍 Page Not Found
                            </h2>
                            <p style={{ marginBottom: '2rem', color: '#888' }}>
                              The page you&apos;re looking for doesn&apos;t exist.
                            </p>
                            <button
                              onClick={() => (window.location.href = '/')}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#1976d2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                              }}
                            >
                              Go to Homepage
                            </button>
                          </div>
                        }
                      />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </AuthProvider>
        </AuthErrorBoundary>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

function App() {
  // Clear cache on app initialization if needed
  useEffect(() => {
    const handleCacheClearing = async () => {
      // Check if this is a fresh deployment (version mismatch)
      const buildVersion = document
        .querySelector('meta[name="build-version"]')
        ?.getAttribute('content');
      const storedVersion = localStorage.getItem('app-version');

      if (buildVersion && storedVersion !== buildVersion) {
        console.log('New deployment detected, clearing cache...');

        // Clear caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        // Clear storage
        sessionStorage.clear();

        // Update stored version
        localStorage.setItem('app-version', buildVersion);

        console.log('Cache cleared for new deployment');
      }
    };

    handleCacheClearing();
  }, []);

  return (
    <ChunkErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CustomThemeProvider>
            <AppContent />
          </CustomThemeProvider>
        </QueryClientProvider>
      </Provider>
      <Analytics />
    </ChunkErrorBoundary>
  );
}

export default App;
