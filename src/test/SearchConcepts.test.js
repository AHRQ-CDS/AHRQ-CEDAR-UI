import React from 'react';
import { render } from '@testing-library/react';
import SearchConcepts from '../components/SearchConcepts';
import { concepts } from '../../fixtures/concepts';

it('renders without crashing', () => {
  render(<SearchConcepts selectedConcepts={concepts} />);
});
