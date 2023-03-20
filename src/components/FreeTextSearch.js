import _ from 'lodash';
import React, { useState } from 'react';
import { Form, Icon, Popup } from 'semantic-ui-react';
import FreeTextSearchPopup from './FreeTextSearchPopup';

function FreeTextSearch({searchOptions, setContentSearchStrings, setSearchOptions, setSearchPage, setSelectedKeywords, setTitleSearchStrings}) {
  const SEARCH_TYPES = [
    { key: 'text', value: 'Text', text: 'Text' },
    { key: 'title', value: 'Title', text: 'Title' },
    { key: 'keywords', value: 'Keywords', text: 'Keywords' }
  ]
  const [searchType, setSearchType] = useState(SEARCH_TYPES[0].value);

  const updateSearchQuery = (e, { value }) => {
    setSearchPage(1);

    const option = `${searchType}: ${value}`
    setSearchOptions((previousOptions) => ([...previousOptions, { key: option, text: option, value: option, original: value }]))

    switch(searchType) {
      case 'Keywords':
        setSelectedKeywords((previousSelectedKeywords) => {
          if(previousSelectedKeywords.includes(value)) {
            return previousSelectedKeywords;
          }
          else {
            return previousSelectedKeywords.concat(value);
          }
        });
        break;
      case 'Title':
        setTitleSearchStrings((previousTitleSearchStrings) => {
          if (previousTitleSearchStrings.includes(value)) {
            return previousTitleSearchStrings;
          }
          else {
            return previousTitleSearchStrings.concat(value);
          }
        });
        break;
      // Default is Text
      default:
        setContentSearchStrings((previousContentSearchStrings) => {
          if (previousContentSearchStrings.includes(value)) {
            return previousContentSearchStrings;
          }
          else {
            return previousContentSearchStrings.concat(value);
          }
        });
    }
  };

  const handleClearAll = () => {
    setContentSearchStrings([])
    setTitleSearchStrings([])
    setSelectedKeywords([])
    setSearchOptions([])
  }

  // value passed to setCurrentValues is an array of strings. Each
  // currentValues item (local format) corresponds to the value prop of a searchOption item (global/App format)
  // const handleChange = (e, { value }) => setCurrentValues(value)

  // we need removed labels to update the search accordingly. use:
  // https://react.semantic-ui.com/modules/dropdown/#usage-multiple-custom-label
  // note: onRemove prop works, but is undocumented. Adapt from source handleLabelRemove
  // ref: https://github.com/Semantic-Org/Semantic-UI-React/blob/master/src/modules/Dropdown/Dropdown.js
  const renderCustomLabel = (label) => ({
    content: `${label.text}`,
    onRemove: (e, data) => {
      e.stopPropagation() // prevent focusing search input on click

      // Target the correct search type and value to update search query performed
      const target = data.value.split(': ')[1]  // everything after ': ' present in each label
      if (data.content.includes('Keyword')) {
        setSelectedKeywords((previousSelectedKeywords) => {
          return previousSelectedKeywords.filter(k => k !== target)
        });
      }
      if (data.content.includes('Title')) {
        setTitleSearchStrings((previousTitleSearchStrings) => {
          return previousTitleSearchStrings.filter(t => t !== target)
        });
      }
      if (data.content.includes('Text')) {
        setContentSearchStrings((previousContentSearchStrings) => {
          return previousContentSearchStrings.filter(c => c !== target)
        });
      }

      // Update UI render
      setSearchOptions((previousOptions) => {
        return previousOptions.filter(option => option.value !== data.value);
      });
    }
  })


  return (
    <>
      <div className="search-wrapper">
        <Form size='big' className="search-form">
          <Form.Group>
            <Popup trigger={<Icon name='question circle' size='large' className='advanced-search-options cursor-pointer'/>} flowing hoverable>
              <FreeTextSearchPopup searchType={searchType}/>
            </Popup>
            <Form.Select
              selection
              name="type"
              options={SEARCH_TYPES}
              value={searchType}
              width={7}
              onChange={(e, data) => setSearchType(data.value)}
            />
            <Form.Dropdown
              options={searchOptions}
              placeholder='Search terms...'
              search
              selection
              fluid
              multiple
              allowAdditions
              icon={null}
              width={11}
              value={_.map(searchOptions, 'value')}
              onAddItem={updateSearchQuery}
              renderLabel={renderCustomLabel}
              className="multisearch-input"
            />
            { searchOptions.length > 0
              ?
              <Icon name='delete' size='large' onClick={handleClearAll} className='advanced-search-options cursor-pointer' />
              :
              <Icon name='search' size='large' className='advanced-search-options cursor-pointer'/>
            }
          </Form.Group>
        </Form>
      </div>
    </>
  )
}

export default FreeTextSearch;