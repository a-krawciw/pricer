import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


test("add to history", () => {
  render(<App />)
  const price_area = screen.getByTestId("price_box");
});

test('renders History', () => {
  render(<App />);
  const linkElement = screen.getByText("History:");
  expect(linkElement).toBeInTheDocument();
});

