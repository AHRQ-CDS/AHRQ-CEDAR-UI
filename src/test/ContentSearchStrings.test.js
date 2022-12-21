import React from 'react';
import ContentSearchStrings from '../components/ContentSearchStrings';
import { mount } from 'enzyme';

const terms = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const setContentSearchStrings = () => void 0;

it('renders without crashing', () => {
  mount(<ContentSearchStrings contentSearchStrings={terms} setContentSearchStrings={setContentSearchStrings}/>);
});
