import React from 'react';
import SearchConcepts from './SearchConcepts';
import { mount } from 'enzyme';
import { concepts } from '../fixtures/concepts';

it('renders without crashing', () => {
  mount(<SearchConcepts selectedConcepts={concepts} />);
});
