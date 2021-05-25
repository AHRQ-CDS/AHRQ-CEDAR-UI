import SearchResult from './SearchResult';

function SearchResults(props) {
  if (props.searchResults) {
    return (
        <div>
          <h4>{props.searchResults.total} Search Results</h4>
          {props.searchResults.entry && props.searchResults.entry.map(e => <SearchResult key={e.resource.id} resource={e.resource} />)}
        </div>
    );
  }
  return <div>No search results</div>;
}

export default SearchResults;
