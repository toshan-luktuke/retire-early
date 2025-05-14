import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RetirementForm from './RetirementForm';

// Reset fetch mocks before each test
beforeEach(() => {
  jest.spyOn(global, 'fetch').mockClear();
});

test('renders form fields and submit button', () => {
  render(<RetirementForm />);
  expect(screen.getByLabelText(/Annual Income/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Annual Expenses/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Annual Cash Flows/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Annual Liabilities/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Portfolio Current Value/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Equity Allocation/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Fixed Income Allocation/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Other Allocation/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Goal Amount/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Goal Years/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Calculate/i })).toBeInTheDocument();
});

test('submits form and renders chart on successful API response', async () => {
  // Prepare a fake response from API
  const fakeResponse = {
    message: "Form submitted successfully",
    data: {
      simulation: {
        probability: 0.5, // returned in 0-1 scale; should render as 50%
        avg_yearly_networth: [100, 200, 300]
      }
    }
  };

  // Mock fetch to resolve with fake response
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => fakeResponse,
  } as Response);

  render(<RetirementForm />);

  // Fill in the form data. Note: allocations are entered as whole numbers.
  fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '213' } });
  fireEvent.change(screen.getByLabelText(/Annual Expenses/i), { target: { value: '23130' } });
  fireEvent.change(screen.getByLabelText(/Annual Cash Flows/i), { target: { value: '564' } });
  fireEvent.change(screen.getByLabelText(/Annual Liabilities/i), { target: { value: '231230' } });
  fireEvent.change(screen.getByLabelText(/Portfolio Current Value/i), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText(/Equity Allocation/i), { target: { value: '20' } }); // UI input in 100% format
  fireEvent.change(screen.getByLabelText(/Fixed Income Allocation/i), { target: { value: '60' } });
  fireEvent.change(screen.getByLabelText(/Other Allocation/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/Goal Amount/i), { target: { value: '342789' } });
  fireEvent.change(screen.getByLabelText(/Goal Years/i), { target: { value: '10' } });

  // Click the Calculate button to submit the form
  fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));

  // Wait for the loading indicator to disappear (i.e. API processing finishes)
  await waitFor(() => {
    expect(screen.queryByText(/Calculating data... please wait/i)).not.toBeInTheDocument();
  });

  // Check that the probability is rendered as 50% (0.5 * 100)
  expect(screen.getByText(/50%/i)).toBeInTheDocument();

  // Check that the chart labels (Year 1, Year 2, Year 3) are rendered
  expect(screen.getByText('Year 1')).toBeInTheDocument();
  expect(screen.getByText('Year 2')).toBeInTheDocument();
  expect(screen.getByText('Year 3')).toBeInTheDocument();
});

test('logs error to console on API failure', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  // Mock fetch to return a failure.
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  } as Response);

  render(<RetirementForm />);

  // Fill required inputs minimally.
  fireEvent.change(screen.getByLabelText(/Annual Income/i), { target: { value: '213' } });
  fireEvent.change(screen.getByLabelText(/Annual Expenses/i), { target: { value: '23130' } });
  fireEvent.change(screen.getByLabelText(/Annual Cash Flows/i), { target: { value: '564' } });
  fireEvent.change(screen.getByLabelText(/Annual Liabilities/i), { target: { value: '231230' } });
  fireEvent.change(screen.getByLabelText(/Portfolio Current Value/i), { target: { value: '0' } });
  fireEvent.change(screen.getByLabelText(/Equity Allocation/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/Fixed Income Allocation/i), { target: { value: '60' } });
  fireEvent.change(screen.getByLabelText(/Other Allocation/i), { target: { value: '20' } });
  fireEvent.change(screen.getByLabelText(/Goal Amount/i), { target: { value: '342789' } });
  fireEvent.change(screen.getByLabelText(/Goal Years/i), { target: { value: '10' } });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));

  // Ensure that an error is logged to the console.
  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  consoleErrorSpy.mockRestore();
});