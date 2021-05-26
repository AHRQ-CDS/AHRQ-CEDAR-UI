import React, { memo } from 'react';
import SearchResult from './SearchResult';

function SearchResults(props) {
  if (props.searchResults) {
    return (
        <React.Fragment>
          <h4>{props.searchResults.total} Search Results</h4>
          {props.searchResults.entry && props.searchResults.entry.map(e => <SearchResult key={e.resource.id} resource={e.resource} />)}
        </React.Fragment>
    );
  }
  return <div>No search results</div>;
}

// Use memo so that we only re-render when search results change
export default memo(SearchResults);
