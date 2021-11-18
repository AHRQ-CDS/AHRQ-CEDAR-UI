import React from 'react';
import Conditons from './Conditions';
import { mount } from 'enzyme';
import conditons from '../fixtures/conditions';

it('renders without crashing', () => {
  mount(<Conditons conditions={conditons} selectedConcepts={[]} />);
});