import React, { memo } from 'react';
import { Pagination, Loader } from 'semantic-ui-react';
import SearchResult from './SearchResult';

function SearchResults({ searchResults, page, onPageChange, onKeywordClick, onConceptClick, selectedKeywords, selectedConcepts, activeTabIndex, setActiveTabIndex }) {
  if (searchResults?.status === 'complete') {
    return (
        <React.Fragment>
          <h4>{searchResults.data.total} Search Results</h4>
          {searchResults.data.total > 10 && <Pagination totalPages={Math.ceil(searchResults.data.total / 10)} activePage={page} onPageChange={onPageChange} />}
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
  } else {
    return <h4>No search results</h4>;
  }
}

// Use memo so that we only re-render when search results change
export default memo(SearchResults);
