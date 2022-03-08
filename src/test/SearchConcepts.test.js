import React from 'react';
import SearchConcepts from '../components/SearchConcepts';
import { mount } from 'enzyme';
import { concepts } from '../../fixtures/concepts';

it('renders without crashing', () => {
  mount(<SearchConcepts selectedConcepts={concepts} />);
});
