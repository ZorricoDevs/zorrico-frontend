import React from 'react';
import { render, RenderOptions, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Mock theme for testing
const mockTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Mock auth context
export const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  updateProfile: jest.fn(),
};

// Mock theme context
export const mockThemeContext = {
  isDarkMode: false,
  toggleTheme: jest.fn(),
};

// All the providers wrapper
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Router>
      <ThemeProvider theme={mockTheme}>
        {children}
      </ThemeProvider>
    </Router>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Custom render with authentication
export const renderWithAuth = (
  ui: React.ReactElement,
  authState: Partial<typeof mockAuthContext> = {},
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Mock AuthContext.Provider here
    return (
      <AllTheProviders>
        {children}
      </AllTheProviders>
    );
  };

  return render(ui, { wrapper: AuthWrapper, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render, userEvent };

// Test data factories
export const createMockUser = (overrides: any = {}) => ({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: 'user',
  profile: {
    isEmailVerified: true,
    isPhoneVerified: false,
    kycStatus: 'pending',
  },
  ...overrides,
});

export const createMockLoan = (overrides: any = {}) => ({
  id: '1',
  loanType: 'home',
  principal: 1000000,
  interestRate: 8.5,
  tenure: 240,
  processingFee: 10000,
  lender: 'Test Bank',
  isActive: true,
  ...overrides,
});

export const createMockApplication = (overrides: any = {}) => ({
  id: '1',
  userId: '1',
  loanId: '1',
  requestedAmount: 800000,
  status: 'pending',
  documents: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Mock API responses
export const mockApiResponse = (data: any, success: boolean = true) => ({
  data: success ? data : null,
  error: success ? null : data,
  loading: false,
});

// Mock fetch responses
export const mockFetchSuccess = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
    status: 200,
    statusText: 'OK',
  });
};

export const mockFetchError = (error: string, status: number = 400) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error }),
    status,
    statusText: 'Error',
  });
};

// Form testing utilities
export const fillForm = async (formData: Record<string, string>) => {
  for (const [name, value] of Object.entries(formData)) {
    const field = screen.getByRole('textbox', { name: new RegExp(name, 'i') }) ||
                  screen.getByLabelText(new RegExp(name, 'i'));
    await userEvent.clear(field);
    await userEvent.type(field, value);
  }
};

export const submitForm = async (buttonText: string = 'submit') => {
  const submitButton = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
  await userEvent.click(submitButton);
};

// Navigation testing utilities
export const expectNavigation = async (expectedPath: string) => {
  await waitFor(() => {
    expect(window.location.pathname).toBe(expectedPath);
  });
};

// Error boundary testing
export const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Local storage testing utilities
export const setLocalStorage = (key: string, value: any) => {
  const mockValue = typeof value === 'string' ? value : JSON.stringify(value);
  (window.localStorage.setItem as jest.Mock).mockImplementation((k, v) => {
    if (k === key) return mockValue;
  });
  (window.localStorage.getItem as jest.Mock).mockImplementation((k) => {
    if (k === key) return mockValue;
    return null;
  });
};

export const clearLocalStorage = () => {
  (window.localStorage.clear as jest.Mock).mockClear();
  (window.localStorage.getItem as jest.Mock).mockClear();
  (window.localStorage.setItem as jest.Mock).mockClear();
};

// Async testing utilities
export const waitForLoadingToFinish = () => {
  return waitFor(() => {
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
};

export const waitForErrorToAppear = (errorText?: string) => {
  return waitFor(() => {
    const errorElement = errorText
      ? screen.getByText(errorText)
      : screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
  });
};

// Table testing utilities
export const getTableData = (tableTestId: string = 'data-table') => {
  const table = screen.getByTestId(tableTestId);
  const rows = table.querySelectorAll('tbody tr');

  return Array.from(rows).map(row => {
    const cells = row.querySelectorAll('td');
    return Array.from(cells).map(cell => cell.textContent?.trim() || '');
  });
};

// Modal testing utilities
export const expectModalToBeOpen = (modalTitle?: string) => {
  const modal = modalTitle
    ? screen.getByRole('dialog', { name: modalTitle })
    : screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();
};

export const expectModalToBeClosed = () => {
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
};

// Notification testing utilities
export const expectNotification = (message: string, type?: 'success' | 'error' | 'warning' | 'info') => {
  const notification = screen.getByText(message);
  expect(notification).toBeInTheDocument();

  if (type) {
    expect(notification.closest('.MuiAlert-root')).toHaveClass(`MuiAlert-${type}`);
  }
};

// Accessibility testing utilities
export const expectElementToHaveAriaLabel = (element: HTMLElement, expectedLabel: string) => {
  expect(element).toHaveAttribute('aria-label', expectedLabel);
};

export const expectElementToBeAccessible = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'button') {
    expect(element).toHaveAttribute('type');
  }

  if (tagName === 'input') {
    expect(element).toHaveAttribute('type');
    // Should have associated label
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      expect(label).toBeInTheDocument();
    }
  }

  if (tagName === 'img') {
    expect(element).toHaveAttribute('alt');
  }
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitFor(() => {
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
  const end = performance.now();
  return end - start;
};

// Custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attribute: string, value?: string): R;
    }
  }
}

// Component testing helper
export const testComponent = (
  Component: React.ComponentType<any>,
  props: any = {},
  testName: string = Component.displayName || Component.name
) => {
  describe(testName, () => {
    it('renders without crashing', () => {
      expect(() => render(<Component {...props} />)).not.toThrow();
    });

    it('matches snapshot', () => {
      const { container } = render(<Component {...props} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
};

export default {
  render: customRender,
  renderWithAuth,
  userEvent,
  createMockUser,
  createMockLoan,
  createMockApplication,
  mockApiResponse,
  mockFetchSuccess,
  mockFetchError,
  fillForm,
  submitForm,
  expectNavigation,
  setLocalStorage,
  clearLocalStorage,
  waitForLoadingToFinish,
  waitForErrorToAppear,
  getTableData,
  expectModalToBeOpen,
  expectModalToBeClosed,
  expectNotification,
  expectElementToHaveAriaLabel,
  expectElementToBeAccessible,
  measureRenderTime,
  testComponent,
  ThrowError,
};
