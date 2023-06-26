import React from 'react';
import { render } from '@testing-library/react';
import Patient from '../components/Patient';
import patient from '../../fixtures/patient';

it('renders without crashing', () => {
  render(<Patient patient={patient} />);
});