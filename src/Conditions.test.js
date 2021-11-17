import React from 'react';
import Conditons from './Conditions';
import { mount } from 'enzyme';
import conditons from '../fixtures/conditions';

const conceptIsSelected = (concept) => void 0;

it('renders without crashing', () => {
  mount(<Conditons conditions={conditons} conceptIsSelected={conceptIsSelected} />);
});