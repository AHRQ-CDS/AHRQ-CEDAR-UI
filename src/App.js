import React, { useState, useEffect, useCallback } from 'react';
import { SMART } from './FHIRClientWrapper';
import Patient from './Patient';
import Conditions from './Conditions';
import SearchResults from './SearchResults';
import { Container, Grid, Segment, Menu, Input, Label, Icon, List, Form } from 'semantic-ui-react';
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
  const [searchParameter, setSearchParameter] = useState('_content');
  const [searchCount, setSearchCount] = useState(10);

  const [searchStatus, setSearchStatus] = useState({
    Active: true,
    Retired: false,
    Draft: false,
    Unknown: false
  });
  const [allPublishers, setAllPublishers] = useState([]);
  const [searchPublisher, setSearchPublisher] = useState([]);

  const STATUS = [
    "Active", "Retired", "Draft", "Unknown"
  ];

  const SEARCH_TYPES = {
    '_content': 'Text',
    'title:contains': 'Title',
    'classification:text': 'Keywords'
  }

  const HEADER_TEXT = props.smart === true ? 'CEDAR SMART Demonstration' : 'CEDAR Standalone Demonstration'
  const SEARCH_BOX_TEXT = props.smart === true? 'Additional Filters' : 'Filters'

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

      const status = Object.keys(searchStatus).filter(name => searchStatus[name]).map(name => name.toLowerCase());
      let query = new URLSearchParams();
      query.append(searchParameter, searchString);
      query.append('_count', searchCount);
      query.append('page', searchPage);
      query.append('artifact-current-state', status.join(','))

      if (searchPublisher.length > 0) {
        query.append('artifact-publisher', searchPublisher.join(','));
      }

      console.log(query.toString());

      if (searchString.length > 0) {
        const response = await fetch(`/api/fhir/Citation?${query.toString()}`);
        const json = await response.json();
        // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
        // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
        setSearchResults({ status: 'complete', data: json });
      } else {
        setSearchResults({ status: 'none' });
      }
    };

    cedarSearch();

  }, [conditionSearchString, selectedKeywords, additionalSearchString, searchPage, searchPublisher, searchStatus]);

  useEffect(() => {
    if (allPublishers.length === 0) {
      getAllPublishers();
    }
    // eslint-disable-next-line
  }, []);

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

  const getAllPublishers = async () => {
    const response = await fetch(`/api/fhir/Organization`);
    const json = await response.json();

    const data = (json.entry || []).map((entry) => ({ id: entry.resource.id, name: entry.resource.name}))
    setAllPublishers(data);
  };

  const handlePublisherChange = (event) => {
    if (event.checked && !searchPublisher.includes(event.name)) {
      setSearchPublisher([ ...searchPublisher, event.name]);
      setSearchPage(1);
    }
    else if (!event.checked && searchPublisher.includes(event.name)) {
      const publisher = searchPublisher.filter(item => item !== event.name);
      setSearchPublisher(publisher);
      setSearchPage(1);
    }
  }

  const handleStatusChange = (event) => {
    setSearchStatus({ ...searchStatus, [event.name]: event.checked });
    setSearchPage(1);
  };

  // Handle changes to the type of search
  const handleSearchTypeChange = (event) => {
    setSearchParameter(event.target.value);
  };

  function searchTypeOptions() {
    let options = []
    for(const [search_api_key, search_api_display_text] of Object.entries(SEARCH_TYPES)) {
        options.push({
          key: search_api_key,
          text: search_api_display_text,
          value: search_api_key,
        })
    }
    console.log(options)
    return options
  }

  return (
    <React.Fragment>

      <Menu color='blue' inverted attached>
        <Menu.Item header><h2>{HEADER_TEXT}</h2></Menu.Item>
      </Menu>

      <Container fluid className='App'>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
            {props.smart && (
                <Segment>
                  <Patient patient={patient} />
                </Segment>
            )}
              <Segment>
                <h4>{SEARCH_BOX_TEXT}</h4>

                <h4>Search Type</h4>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <Form.Select
                      fluid
                      selection
                      name="type"
                      options={searchTypeOptions()}
                      defaultValue='_content'
                      onChange={handleSearchTypeChange}
                    />
                  </Form.Field>
                  <form onSubmit={updateAdditionalSearchString}>
                    <Input fluid placeholder='Search filter...' action={{ primary: true, icon: 'search' }}
                           value={additionalSearchInput} onChange={updateAdditionalSearchInput} />
                  </form>
                </Form.Group>

                {selectedKeywords.length > 0 && <h5>Additional Search Keywords</h5>}
                {selectedKeywords.map(k => <p key={k}><Label color='blue'><Icon name='delete' onClick={() => handleKeywordClick(k)}/> {k}</Label></p>)}

                <h4>Status</h4>
                <List>
                {STATUS.map((name) => (
                  <List.Item key={name}>
                    <div class="ui checkbox">
                    <input type="checkbox"
                              checked={searchStatus[name]}
                              onChange={event=>{handleStatusChange(event.target)}}
                              name={name}
                    />
                    <label>{name}</label>
                    </div>
                  </List.Item>
                ))}
                </List>

                <h4>Publishers</h4>
                <List>
                  {allPublishers.map((publisher) => (
                    <List.Item key={publisher.id}>
                      <div class="ui checkbox">
                      <input type="checkbox"
                            checked={searchPublisher.includes[publisher.id]}
                            onChange={event=>{handlePublisherChange(event.target)}}
                            name={publisher.name} 
                      />
                      <label>{publisher.name}</label>
                      </div>
                    </List.Item>
                  ))}
                </List>
              </Segment>
              
              {props.smart && (
                <Segment>
                  <h4>Conditions</h4>
                  <Conditions conditions={conditions} onChange={handleConditionsChange}/>
                </Segment>
              )}

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
