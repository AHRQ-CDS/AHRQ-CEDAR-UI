import React from 'react';
import FreeTextSearch from '../components/FreeTextSearch';
import { mount } from 'enzyme';

const options = [
  { key: 'Text: mental health', text: 'Text: mental health', value: 'mental health'},
  { key: 'Keyword: hypertension', text: 'Keyword: hypertension', value: 'hypertension'},
]

it('renders without crashing', () => {
  mount(<FreeTextSearch searchOptions={options} />);
});
