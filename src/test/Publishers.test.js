import React from 'react';
import { render } from '@testing-library/react';
import Publishers from '../components/Publishers';

it('renders without crashing', () => {
  render(<Publishers />);
});
