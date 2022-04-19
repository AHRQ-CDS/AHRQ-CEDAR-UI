import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

function ContentSearchStrings({ contentSearchStrings, setContentSearchStrings }) {
  const handleContentSearchStringRemove = (contentString) => {
    setContentSearchStrings((previousContentSearchStrings) => {return previousContentSearchStrings.filter(c => c !== contentString)});
  }

  if (contentSearchStrings.length === 0) {
    return null;
  }
  else {
    return (
      <>
        <h3>Text Search</h3>
        {contentSearchStrings.map(k => <span className='search-tags' key={k}><Label color='blue'><Icon name='delete' onClick={() => handleContentSearchStringRemove(k)}/> {k}</Label></span>)}
      </>
    )
  }
}

export default ContentSearchStrings;