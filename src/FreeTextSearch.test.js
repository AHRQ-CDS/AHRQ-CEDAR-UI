import React from 'react';
import FreeTextSearch from './FreeTextSearch';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<FreeTextSearch />);
});
