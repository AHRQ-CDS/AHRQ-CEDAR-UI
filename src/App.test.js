import { render, screen } from '@testing-library/react';
import App from './App';

const PATIENT_HEADER = 'Patient';
const CONDITIONS_HEADER = 'Conditions';
const SEARCH_HEADER = 'Search By';
const STATUS_HEADER = 'Status';
const PUBLISHERS_HEADER = 'Publishers';

test('it shows the correct SMART UI when in the SMART context', () => {
  render(<App smart/>);
  const headerText = screen.getByText(/CEDAR SMART Demonstration/i);
  expect(headerText).toBeInTheDocument();

  const patientText = screen.getByText(PATIENT_HEADER);
  expect(patientText).toBeInTheDocument();

  const conditionsText = screen.getByText(CONDITIONS_HEADER);
  expect(conditionsText).toBeInTheDocument();

  const searchText = screen.getByText(SEARCH_HEADER);
  expect(searchText).toBeInTheDocument;

  const statusText = screen.getByText(STATUS_HEADER);
  expect(statusText).toBeInTheDocument;

  const publishersText = screen.getByText(PUBLISHERS_HEADER);
  expect(publishersText).toBeInTheDocument;
});

test('it shows the correct standalone UI when in the standalone context', () => {
  render(<App standalone/>);
  const headerText = screen.getByText(/CEDAR Standalone Demonstration/i);
  expect(headerText).toBeInTheDocument();

  const patientText = screen.queryByText(PATIENT_HEADER);
  expect(patientText).not.toBeInTheDocument();

  const conditionsText = screen.queryByText(CONDITIONS_HEADER);
  expect(conditionsText).not.toBeInTheDocument();

  const searchText = screen.getByText(SEARCH_HEADER);
  expect(searchText).toBeInTheDocument;

  const statusText = screen.getByText(STATUS_HEADER);
  expect(statusText).toBeInTheDocument;

  const publishersText = screen.getByText(PUBLISHERS_HEADER);
  expect(publishersText).toBeInTheDocument;
});
