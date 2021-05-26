import React, { useState, useEffect } from 'react';
import { SMART } from './FHIRClientWrapper';
import Patient from './Patient';
import Conditions from './Conditions';
import SearchResults from './SearchResults';
import { Container, Grid, Segment, Menu, Input } from 'semantic-ui-react';
import './App.css';

function App(props) {

  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [conditionSearchString, setConditionSearchString] = useState('');
  const [additionalSearchInput, setAdditionalSearchInput] = useState('');
  const [additionalSearchString, setAdditionalSearchString] = useState('');
  const [searchResults, setSearchResults] = useState();

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
      let searchString = conditionSearchString;
      if (additionalSearchString.length > 0) {
        if (searchString.length > 0) {
          searchString += ' AND ';
        }
        searchString += `(${additionalSearchString})`;
      }
      console.log("Search string: " + searchString);
      if (searchString.length > 0) {
        const response = await fetch(`http://127.0.0.1:4567/fhir/Citation?_content=${searchString}&artifact-current-state=active`);
        const json = await response.json();
        // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
        // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
        setSearchResults(json);
      } else {
        setSearchResults(null);
      }
    };

    cedarSearch();

  }, [conditionSearchString, additionalSearchString]);

  const handleConditionsChange = (conditionNames) => {
    // TODO: parenthisis handling is a temporary workaround for conditions like "Acute bronchitis (disorder)"
    // TODO: punctuation handling is a temporary workaround for conditions like "Alzheimer's"
    const newConditionSearchString = conditionNames.map(s => `"${s.replace(/ *\([^)]+\)/, '').replace(/[^\w\s]+/, '')}"`).join(' AND ');
    if (newConditionSearchString !== conditionSearchString) {
      setConditionSearchString(newConditionSearchString);
    }
    // If the conditions are changed, whatever is in the additional filter input should be incorporated into search as well
    if (additionalSearchInput !== additionalSearchString) {
      setAdditionalSearchString(additionalSearchInput);
    }
  };

  const updateAdditionalSearchInput = (event) => {
    setAdditionalSearchInput(event.target.value);
  };

  const updateAdditionalSearchString = (event) => {
    event.preventDefault();
    setAdditionalSearchString(additionalSearchInput);
  };

  return (
    <div className="App">
      <Menu color='blue' inverted attached>
        <Menu.Item header><h2>CEDAR SMART Demonstration</h2></Menu.Item>
      </Menu>

      <Container fluid>
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
              </Segment>
              <Segment>
                <h4>Conditions</h4>
                <Conditions conditions={conditions} onChange={handleConditionsChange}/>
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>
              <Segment>
                <SearchResults searchResults={searchResults} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    </div>
  );
}

export default App;
