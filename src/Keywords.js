import React from 'react';
import { Button } from 'semantic-ui-react';

function Keywords({ keywords, onKeywordClick }) {
  if(keywords.length !== 0){
    return (
    <>
      <h4>Keywords</h4>
       {keywords.map(k => <Button basic compact size='mini' key={k} onClick={() => onKeywordClick(k)}>{k}</Button>)}
    </>
    )
  }
  else {
    return (<h4>No Keywords Assigned</h4>)
  }
}

export default Keywords;