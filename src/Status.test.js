import React from 'react';
import Status from './Status';
import { mount } from 'enzyme';

const searchStatus = ['active']

it('renders without crashing', () => {
  mount(<Status searchStatus={searchStatus} />);
});