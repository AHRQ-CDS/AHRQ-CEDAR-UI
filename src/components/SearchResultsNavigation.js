import React, { useCallback } from 'react';
import { Button, Grid, Icon, Pagination } from 'semantic-ui-react';

function SearchResultsNavigation({ searchResults, bgColor, searchPage, setSearchPage }) {
  const getDownloadUrl = () => {
    const searchURL = new URL(searchResults.data.link.find(e => e.relation === 'self')?.url);
    let downloadAllQueryParams = new URLSearchParams(searchURL.search);
    downloadAllQueryParams.delete('_count');
    downloadAllQueryParams.delete('page');
    return '../api/csv?' + downloadAllQueryParams.toString();
  }


  // Memoize this handler so we don't re-render the search results on every overall re-render
  const handlePageChange = useCallback(
    (event, data) => {
      setSearchPage(data.activePage);
    },
    [setSearchPage]
  );

  return (
    <Grid style={{'backgroundColor': bgColor}} className='no-print search-results-navigation'>
      <Grid.Column width={5}></Grid.Column>
      <Grid.Column width={6} className='search-results-count'>
        {searchResults?.status === 'complete' && (
          <>
            <span>{searchResults.data.total} Search Results
              {searchResults.data.total > 0 && (
                <span>
                  <Button size='small' className='download-button' as='a' href={getDownloadUrl()}>
                  <Icon name='download'/>Download</Button>
                </span>
              )}
            </span>
          </>
        )}
        
        {searchResults?.status === 'none' && (
          <span>No Search Results</span>
        )}
      </Grid.Column>
      <Grid.Column width={5}>
        {searchResults?.status === 'complete' && searchResults.data.total > 10 && (
          <Pagination totalPages={Math.ceil(searchResults.data.total / 10)} activePage={searchPage} onPageChange={handlePageChange} pointing secondary />
        )}
      </Grid.Column>
  </Grid>
  )
}

export default SearchResultsNavigation;