import React from 'react';
import { render } from '@testing-library/react';
import Conditons from '../components/Conditions';
import conditons from '../../fixtures/conditions';

it('renders without crashing', () => {
  render(<Conditons conditions={conditons} selectedConcepts={[]} selectedKeywords={[]} />);
});