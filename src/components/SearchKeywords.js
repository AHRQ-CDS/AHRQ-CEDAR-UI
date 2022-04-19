import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

function SearchKeywords({ handleKeywordClick, selectedKeywords }) {
  if (selectedKeywords.length === 0) {
    return null;
  }
  else {
    return (
      <>
        <h3>Keywords</h3>
        {selectedKeywords.map(k => <div className='search-tags' key={k}><Label color='blue'><Icon name='delete' onClick={() => handleKeywordClick(k)}/> {k}</Label></div>)}
      </>
    )
  }
}

export default SearchKeywords;