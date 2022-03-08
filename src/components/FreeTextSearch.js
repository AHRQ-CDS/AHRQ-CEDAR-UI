import React from 'react';
import { Form } from 'semantic-ui-react';

function FreeTextSearch({searchParameter, searchInput, setSearchParameter, setSearchInput, setSearchString, setSearchPage}) {
  const SEARCH_TYPES = {
    '_content': 'Text',
    'title:contains': 'Title',
    'classification:text': 'Keywords'
  }

  const updateSearchString = (event) => {
    event.preventDefault();
    setSearchString(searchInput);
    setSearchPage(1);
  };

  const searchTypeOptions = () => {
    let options = []
    for (const [search_api_key, search_api_display_text] of Object.entries(SEARCH_TYPES)) {
        options.push({
          key: search_api_key,
          text: search_api_display_text,
          value: search_api_key,
        })
    }
    return options
  }

  return (
    <>
      <h4>Search By</h4>
      <Form onSubmit={updateSearchString}>
        <Form.Group>
          <Form.Select
            selection
            name="type"
            options={searchTypeOptions()}
            onChange={(e, data) => setSearchParameter(data.value)}
            width={5}
            style={{minWidth:"8em"}}
            value={searchParameter}
          />
          <Form.Input placeholder='Search terms...' action={{ primary: true, icon: 'search' }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}  width={11}/>
        </Form.Group>
      </Form>
    </>
  )
}

export default FreeTextSearch;