import React, { memo } from 'react';
import { Loader } from 'semantic-ui-react';
import SearchResult from './SearchResult';

function SearchResults({ searchResults, onKeywordClick, onConceptClick, selectedKeywords, selectedConcepts, activeTabIndex, setActiveTabIndex }) {
  if (searchResults?.status === 'complete') {
    return (
        <React.Fragment>
          {searchResults.data.entry && 
            searchResults.data.entry.map(e => 
              <SearchResult key={e.resource.id} 
                            resource={e.resource} 
                            onKeywordClick={onKeywordClick} 
                            onConceptClick={onConceptClick}
                            selectedConcepts={selectedConcepts}
                            selectedKeywords={selectedKeywords}
                            activeTabIndex={activeTabIndex}
                            setActiveTabIndex={setActiveTabIndex}
              />
            )
          }
        </React.Fragment>
    );
  } else if (searchResults?.status === 'pending') {
    return <div><Loader active content='Loading' /></div>;
  }
  else {
    return null;
  }
}

// Use memo so that we only re-render when search results change
export default memo(SearchResults);
