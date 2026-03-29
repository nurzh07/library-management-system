import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './Home';

const theme = createTheme({ palette: { mode: 'dark' } });

describe('Home page', () => {
  it('renders main heading', () => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      </ThemeProvider>
    );
    expect(screen.getByText(/цифрлық кітапхана/i)).toBeInTheDocument();
  });
});
