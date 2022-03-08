import React from 'react';
import SearchResultHistoryModal from '../components/SearchResultHistoryModal';
import { mount } from 'enzyme';
import resource from '../../fixtures/searchResult';

it('renders without crashing', () => {
  mount(<SearchResultHistoryModal resource={resource} />);
});