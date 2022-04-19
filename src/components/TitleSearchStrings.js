import React from 'react';
import { Icon, Label } from 'semantic-ui-react';

function TitleSearchStrings({ titleSearchStrings, setTitleSearchStrings }) {
  const handleTitleSearchStringRemove = (titleString) => {
    setTitleSearchStrings((previousTitleSearchStrings) => {return previousTitleSearchStrings.filter(t => t !== titleString)});
  }

  if (titleSearchStrings.length === 0) {
    return null;
  }
  else {
    return (
      <>
        <h3>Title Search</h3>
        {titleSearchStrings.map(k => <div className='search-tags' key={k}><Label color='blue'><Icon name='delete' onClick={() => handleTitleSearchStringRemove(k)}/> {k}</Label></div>)}
      </>
    )
  }
}

export default TitleSearchStrings;