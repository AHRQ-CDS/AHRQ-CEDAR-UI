import React from 'react';
import { render } from '@testing-library/react';
import SearchResultHistoryModal from '../components/SearchResultHistoryModal';
import resource from '../../fixtures/searchResult';

it('renders without crashing', () => {
  render(<SearchResultHistoryModal resource={resource} />);
});