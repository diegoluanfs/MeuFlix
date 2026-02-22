import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders MeuFlix login page when not authenticated', () => {
  render(<App />);
  expect(screen.getByText(/MeuFlix/i)).toBeInTheDocument();
});
