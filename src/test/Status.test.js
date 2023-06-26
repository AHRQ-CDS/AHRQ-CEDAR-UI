import React from 'react';
import { render } from '@testing-library/react';
import Status from '../components/Status';

const searchStatus = ['active']

it('renders without crashing', () => {
  render(<Status searchStatus={searchStatus} />);
});