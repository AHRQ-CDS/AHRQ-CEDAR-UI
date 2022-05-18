import React, { useState } from 'react';
import { Form, Icon, Popup } from 'semantic-ui-react';
import FreeTextSearchPopup from './FreeTextSearchPopup';

function FreeTextSearch({searchInput, setContentSearchStrings, setSearchInput, setSearchPage, setSelectedKeywords, setTitleSearchStrings}) {
  
  const SEARCH_TYPES = [
    { key: 'text', value: 'Text', text: 'Text' },
    { key: 'title', value: 'Title', text: 'Title' },
    { key: 'keywords', value: 'Keywords', text: 'Keywords' }
  ]

  const [searchType, setSearchType] = useState(SEARCH_TYPES[0].value);

  const updateSearchString = (event) => {
    event.preventDefault();
    setSearchInput('');
    setSearchPage(1);

    switch(searchType) {
      case 'Keywords':
        setSelectedKeywords((previousSelectedKeywords) => {
          if(previousSelectedKeywords.includes(searchInput)) {
            return previousSelectedKeywords;
          }
          else {
            return previousSelectedKeywords.concat(searchInput);
          }
        });
        break;
      case 'Title':
        setTitleSearchStrings((previousTitleSearchStrings) => {
          if (previousTitleSearchStrings.includes(searchInput)) {
            return previousTitleSearchStrings;
          }
          else {
            return previousTitleSearchStrings.concat(searchInput);
          }
        });
        break;
      // Default is Text'
      default:
        setContentSearchStrings((previousContentSearchStrings) => {
          if (previousContentSearchStrings.includes(searchInput)) {
            return previousContentSearchStrings;
          }
          else {
            return previousContentSearchStrings.concat(searchInput);
          }
        });
    }
  };

  return (
    <>
      <div className="search-wrapper">
        <Form onSubmit={updateSearchString} size='big' className="search-form">
          <Form.Group>
            <Popup trigger={<Icon name='question circle' size='large' className='advanced-search-options cursor-pointer'/>} flowing hoverable>
              <FreeTextSearchPopup searchType={searchType}/>
            </Popup>
            <Form.Select
              selection
              name="type"
              options={SEARCH_TYPES}
              value={searchType}
              width={5}
              onChange={(e, data) => setSearchType(data.value)}
            />
            <Form.Input placeholder='Search terms...' action={{ icon: 'search' }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} width={11}/>
          </Form.Group>
        </Form>
      </div>
    </>
  )
}

export default FreeTextSearch;