import React from 'react';
import { render } from '@testing-library/react';
import FreeTextSearch from '../components/FreeTextSearch';

const options = [
  { key: 'Text: mental health', text: 'Text: mental health', value: 'mental health'},
  { key: 'Keyword: hypertension', text: 'Keyword: hypertension', value: 'hypertension'},
]

it('renders without crashing', () => {
  render(<FreeTextSearch searchOptions={options} />);
});
