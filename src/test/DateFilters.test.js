import React from 'react';
import { render } from '@testing-library/react';
import DateFilters from '../components/DateFilters';

it('renders without crashing', () => {
  render(<DateFilters />);
});
