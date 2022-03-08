import React from 'react';
import Patient from '../components/Patient';
import { mount } from 'enzyme';
import patient from '../../fixtures/patient';

it('renders without crashing', () => {
  mount(<Patient patient={patient} />);
});