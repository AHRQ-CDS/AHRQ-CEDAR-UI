import React from 'react';
import Status from '../components/Status';
import { mount } from 'enzyme';

const searchStatus = ['active']

it('renders without crashing', () => {
  mount(<Status searchStatus={searchStatus} />);
});