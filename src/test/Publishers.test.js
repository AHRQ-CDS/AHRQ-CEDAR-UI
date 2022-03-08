import React from 'react';
import Publishers from '../components/Publishers';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Publishers />);
});
