import React, { useState, useEffect, useCallback } from 'react';
import { SMART } from './FHIRClientWrapper';
import Patient from './Patient';
import Conditions from './Conditions';
import SearchResults from './SearchResults';
import { Container, Grid, Segment, Menu, Input, Label, Icon } from 'semantic-ui-react';
import './App.css';

function App(props) {

  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [conditionSearchString, setConditionSearchString] = useState('');
  const [additionalSearchInput, setAdditionalSearchInput] = useState('');
  const [additionalSearchString, setAdditionalSearchString] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [searchResults, setSearchResults] = useState({ status: 'none' });
  const [searchPage, setSearchPage] = useState(1);

  useEffect(() => {

    // If we're running in a SMART on FHIR context, load the patient and all resources
    if (props.smart) {
      SMART.load().then(([user, patient, conditions]) => {
        // TODO: Remove user if we don't need it?
        setPatient(patient);
        setConditions(conditions);
      });
    }

  }, [props.smart]);

  useEffect(() => {

    const cedarSearch = async () => {
      setSearchResults({ status: 'pending' });
      let searchString = conditionSearchString;
      if (selectedKeywords.length > 0) {
        if (searchString.length > 0) {
          searchString += ' AND ';
        }
        searchString += `(${selectedKeywords.map(k => `"${k}"`).join(' AND ')})`;
      }
      if (additionalSearchString.length > 0) {
        if (searchString.length > 0) {
          searchString += ' AND ';
        }
        searchString += `(${additionalSearchString})`;
      }
      console.log("Search string: " + searchString);
      if (searchString.length > 0) {
        const response = await fetch(`/api/fhir/Citation?_content=${searchString}&artifact-current-state=active&_count=10&page=${searchPage}`);
        const json = await response.json();
        // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
        // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
        setSearchResults({ status: 'complete', data: json });
      } else {
        setSearchResults({ status: 'none' });
      }
    };

    cedarSearch();

  }, [conditionSearchString, selectedKeywords, additionalSearchString, searchPage]);

  const handleConditionsChange = (conditionNames) => {
    // TODO: parenthisis handling is a temporary workaround for conditions like "Acute bronchitis (disorder)"
    // TODO: punctuation handling is a temporary workaround for conditions like "Alzheimer's"
    const newConditionSearchString = conditionNames.map(s => `"${s.replace(/ *\([^)]+\)/, '').replace(/[^\w\s]+/, '')}"`).join(' AND ');
    if (newConditionSearchString !== conditionSearchString) {
      setConditionSearchString(newConditionSearchString);
      setSearchPage(1);
    }
    // If the conditions are changed, whatever is in the additional filter input should be incorporated into search as well
    if (additionalSearchInput !== additionalSearchString) {
      setAdditionalSearchString(additionalSearchInput);
      setSearchPage(1);
    }
  };

  const updateAdditionalSearchInput = (event) => {
    setAdditionalSearchInput(event.target.value);
  };

  const updateAdditionalSearchString = (event) => {
    event.preventDefault();
    setAdditionalSearchString(additionalSearchInput);
    setSearchPage(1);
  };

  // Memoize this handler so we don't re-render the search results on every overall re-render
  const handleKeywordClick = useCallback(
    (keyword) => {
      setSelectedKeywords((previousSelectedKeywords) => {
        if (previousSelectedKeywords.includes(keyword)) {
          return previousSelectedKeywords.filter(k => k !== keyword);
        } else {
          return previousSelectedKeywords.concat(keyword);
        }
      });
      setSearchPage(1);
    },
    []
  );

  const handlePageChange = (event, data) => {
    setSearchPage(data.activePage);
  };

  return (
    <React.Fragment>

      <Menu color='blue' inverted attached>
        <Menu.Item header><h2>CEDAR SMART Demonstration</h2></Menu.Item>
      </Menu>

      <Container fluid className='App'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
              <Segment>
                <Patient patient={patient} />
              </Segment>
              <Segment>
                <h4>Additional Filters</h4>
                <form onSubmit={updateAdditionalSearchString}>
                  <Input fluid placeholder='Search filter...' action={{ primary: true, icon: 'search' }}
                         value={additionalSearchInput} onChange={updateAdditionalSearchInput} />
                </form>
                {selectedKeywords.length > 0 && <h5>Additional Search Keywords</h5>}
                {selectedKeywords.map(k => <p key={k}><Label color='blue'><Icon name='delete' onClick={() => handleKeywordClick(k)}/> {k}</Label></p>)}
              </Segment>
              <Segment>
                <h4>Conditions</h4>
                <Conditions conditions={conditions} onChange={handleConditionsChange}/>
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>
              <SearchResults searchResults={searchResults} page={searchPage} onPageChange={handlePageChange} onKeywordClick={handleKeywordClick} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    </React.Fragment>
  );
}

export default App;
