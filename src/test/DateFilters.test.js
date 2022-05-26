import React from 'react';
import DateFilters from '../components/DateFilters';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<DateFilters />);
});
