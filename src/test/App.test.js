import { render, screen } from '@testing-library/react';
import App from '../components/App';

const PATIENT_HEADER = 'Patient';
const CONDITIONS_HEADER = 'Conditions';
const STATUS_TEST_ID = 'status-header'; // distinguish between element we care about and other text instances
const PUBLISHERS_HEADER = 'Publishers';

jest.mock('fhirclient', () => ({
    oauth2: {
        ready: jest.fn(() => Promise.resolve({
            client: {
                request: jest.fn(() => { return { data: null } })
            }
        }))
    }
}));

test('it shows the correct SMART UI when in the SMART context', () => {
  render(<App smart/>);
  const headerText = screen.getByText(/CEDAR SMART Demonstration/i);
  expect(headerText).toBeInTheDocument();

  const patientText = screen.getByText(PATIENT_HEADER);
  expect(patientText).toBeInTheDocument();

  const conditionsText = screen.getByText(CONDITIONS_HEADER);
  expect(conditionsText).toBeInTheDocument();

  const statusText = screen.getByTestId(STATUS_TEST_ID);
  expect(statusText).toBeInTheDocument();

  const publishersText = screen.getByText(PUBLISHERS_HEADER);
  expect(publishersText).toBeInTheDocument();
});

test('it shows the correct standalone UI when in the standalone context', () => {
  render(<App standalone/>);
  const headerText = screen.getByText(/CEDAR Standalone Demonstration/i);
  expect(headerText).toBeInTheDocument();

  const patientText = screen.queryByText(PATIENT_HEADER);
  expect(patientText).not.toBeInTheDocument();

  const conditionsText = screen.queryByText(CONDITIONS_HEADER);
  expect(conditionsText).not.toBeInTheDocument();

  const statusText = screen.getByTestId(STATUS_TEST_ID);
  expect(statusText).toBeInTheDocument();

  const publishersText = screen.getByText(PUBLISHERS_HEADER);
  expect(publishersText).toBeInTheDocument();
});
