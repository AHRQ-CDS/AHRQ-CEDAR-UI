import React from 'react';
import SearchResultTags from './SearchResultTags';
import { mount } from 'enzyme';
import concepts from '../fixtures/concepts';

const keywords = ['acute disease', 'acute myocardial infarction', 'arrhythmia, sinus', 'arrhythmias, cardiac']
const onKeywordClick = () => void 0;;

it('renders without crashing', () => {
  mount(<SearchResultTags keywords={keywords} concepts={concepts} onKeywordClick={onKeywordClick}/>);
});