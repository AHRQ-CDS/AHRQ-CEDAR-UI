import React from 'react';
import { render } from '@testing-library/react';
import ContentSearchStrings from '../components/ContentSearchStrings';

const terms = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const setContentSearchStrings = () => void 0;

it('renders without crashing', () => {
  render(<ContentSearchStrings contentSearchStrings={terms} setContentSearchStrings={setContentSearchStrings}/>);
});
