import React, { useState, useEffect, useCallback } from 'react';
import { SMART } from './FHIRClientWrapper';
import Patient from './Patient';
import Conditions from './Conditions';
import SearchResults from './SearchResults';
import MeshTree from './MeshTree';
import MeshTreeNode from './MeshTreeNode';
import { Container, Grid, Segment, Menu, Label, Icon, List, Form, Button, Message } from 'semantic-ui-react';
import './App.css';
import _ from 'lodash';

function App(props) {

  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [conditionSearches, setConditionSearches] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [searchResults, setSearchResults] = useState({ status: 'none' });
  const [searchPage, setSearchPage] = useState(1);
  const [searchParameter, setSearchParameter] = useState('_content');
  const [meshRoots, setMeshRoots] = useState([]);
  const [meshNodeExpanded, setMeshNodeExpanded] = useState(new Map());
  const [meshNodeSelected, setMeshNodeSelected] = useState(new Map());
  const [lastUpdatedSearchString, setLastUpdatedSearchString] = useState('');
  const [showLastUpdatedCustomDate, setShowLastUpdatedCustomDate] = useState(false);
  const [customDatePrefix, setCustomDatePrefix] = useState('ge');
  const [customDateError, setcustomDateError] = useState(false);


  /* TODO: The cedar_ui app allows the user to change the count of results per page,
   but cedar_smart does not. Is this something that we want to support?

   const [searchCount, setSearchCount] = useState(10);*/

  const [searchStatus, setSearchStatus] = useState({
    Active: true,
    Retired: false,
    Draft: false,
    Unknown: false
  });
  const [allPublishers, setAllPublishers] = useState([]);
  const [searchPublisher, setSearchPublisher] = useState([]);

  /* TODO: Related to above. Currently, have a constant here in lieu of supporting a user-selected
   number of page results returned (e.g., 10, 20, etc.) */
  const SEARCH_COUNT = 10;

  const STATUS = [
    "Active", "Retired", "Draft", "Unknown"
  ];

  const SEARCH_TYPES = {
    '_content': 'Text',
    'title:contains': 'Title',
    'classification:text': 'Keywords'
  }

  const LAST_UPDATED_PRESETS = [
    {
      label: "Any time",
      time_in_months: ""
    },
    {
      label: "Within 1 month",
      time_in_months: 1
    },
    {
      label: "Within 3 months",
      time_in_months: 3
    },
    {
      label: "Within 6 months",
      time_in_months: 6
    },
    {
      label: "Within 1 year",
      time_in_months: 12
    },
    {
      label: "Custom",
      time_in_months: ""
    }
  ]

  const LAST_UPDATED_CUSTOM_PREFIXES = [
    {
      key: "eq",
      text: "On",
      value: "eq"
    },
    {
      key: "le",
      text: "On or before",
      value: "le"
    },
    {
      key: "ge",
      text: "On or after",
      value: "ge"
    },
  ]

  const HEADER_TEXT = props.smart === true ? 'CEDAR SMART Demonstration' : 'CEDAR Standalone Demonstration'
  const SEARCH_BOX_TEXT = props.smart === true? 'Additional Filters' : 'Search and Filter'
  const HEADER_COLOR = props.smart === true ? 'blue' : 'grey'
  const BACKGROUND_COLOR = props.smart === true ? '#FFFFFF' : '#F8F8F8'

  const YYYYMMDD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
  const YYYYMM_REGEX = /^\d{4}-\d{2}$/;
  const YYYY_REGEX = /^\d{4}$/;

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
    getMeshRoots();
  }, []);

  useEffect(() => {
    const cedarSearch = async () => {
      setSearchResults({ status: 'pending' });

      let searchParams = {}
      let textSearchString = '';
      let keywordSearchString = '';
      let titleSearchString = '';
      let searchKeywords = selectedKeywords.concat(conditionSearches);

      if (searchKeywords.length > 0) {
        keywordSearchString = `(${searchKeywords.map(k => `"${k}"`).join(' AND ')})`;
      }

      if (searchString.length > 0) {
        switch(searchParameter) {
          case 'classification:text':
            keywordSearchString += keywordSearchString.length > 0 ? ` AND (${searchString})` : searchString;
            break;
          case 'title:contains':
            titleSearchString = searchString;
            break;
          default:
            // default is '_content'
            textSearchString += textSearchString.length > 0 ? ` AND (${searchString})` : searchString;
        }
      }

      let query = new URLSearchParams();
      let anySearchTerms = false;
      const status = Object.keys(searchStatus).filter(name => searchStatus[name]).map(name => name.toLowerCase());

      // TODO: The cedar_ui app allows the user to change the count of results per page, but cedar_smart does not.
      query.append('_count', SEARCH_COUNT);
      query.append('page', searchPage);
      query.append('artifact-current-state', status.join(','));

      if(searchPublisher.length > 0) {
        query.append('artifact-publisher', searchPublisher.join(','));
      }

      if(lastUpdatedSearchString.length > 0) {
        query.append('_lastUpdated', lastUpdatedSearchString);
      }

      let meshCodes = '';
      if(meshNodeSelected.size > 0) {
        meshCodes = [...meshNodeSelected.values()].join(',');
      }

      searchParams['classification:text'] = keywordSearchString;
      searchParams['_content'] = textSearchString;
      searchParams['title:contains'] = titleSearchString;
      searchParams['classification'] = meshCodes;

      for (const [queryParam, queryValue] of Object.entries(searchParams)) {
        if(queryValue.length > 0) {
          anySearchTerms = true;
          query.append(queryParam, queryValue);
        }
      }

      /* Note: By default a fetch() request timeouts at the time indicated by the browser. In Chrome,
         a network request times out in 300 seconds, while Firefox will time out in 90 seconds.
         Should we consider using fetchWithTimeout() instead so that we can establish a shorter time out window? */
      if (anySearchTerms && status.length > 0) {
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

  }, [conditionSearches, selectedKeywords, searchString, searchPage, searchPublisher, searchStatus, searchParameter, meshNodeSelected, lastUpdatedSearchString]);

  useEffect(() => {
    getAllPublishers();
  }, []);

  const getMeshRoots = async () => {
    const response = await fetch('/api/fhir/CodeSystem/$get-mesh-children');
    const json = await response.json();
    const data = (Object.entries(json.parameter) || []).map(([k, value]) =>
      ({  name: value.valueCoding.display,
          treeNumber: value.valueCoding.extension[0].valueCode,
          meshCode: null,
          isGlobalRoot: true,
          hasChildren: value.valueCoding.extension[1].valueBoolean,
          directArtifacts: value.valueCoding.extension[2].valueUnsignedInt,
          indirectArtifacts: value.valueCoding.extension[3].valueUnsignedInt
      }));
    setMeshRoots(data);
  }

  const handleConditionsChange = (conditionNames) => {
    // TODO: parenthisis handling is a temporary workaround for conditions like "Acute bronchitis (disorder)"
    // TODO: punctuation handling is a temporary workaround for conditions like "Alzheimer's"
    const newConditionSearches = conditionNames.map(s => `"${s.replace(/ *\([^)]+\)/, '').replace(/[^\w\s]+/, '')}"`);
    if (newConditionSearches.length !== conditionSearches.length || !(newConditionSearches.every((value, index) => value === conditionSearches[index]))) {
      setConditionSearches(newConditionSearches);
      setSearchPage(1);
    }
  };

  const updateSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const updateSearchString = (event) => {
    event.preventDefault();
    setSearchString(searchInput);
    setSearchPage(1);
  };

  const handleLastUpdatedChange = (event) => {
    const {target} = event;

    switch(target.value) {
      case "Within 1 month":
      case "Within 3 months":
      case "Within 6 months":
      case "Within 1 year":
        const dateString = getXMonthsAgo(target.getAttribute("data"));
        setLastUpdatedSearchString(`ge${dateString}`);
        setShowLastUpdatedCustomDate(false);
        setcustomDateError(false);
        break;
      case "Custom":
        setLastUpdatedSearchString('');
        setShowLastUpdatedCustomDate(true);
        setcustomDateError(false);
        break;
      default:
        setLastUpdatedSearchString('');
        setShowLastUpdatedCustomDate(false);
        setcustomDateError(false);
        break;
    }
  }

  const getXMonthsAgo = (numMonths) => {
    return new Date(
      new Date().getFullYear(),
      new Date().getMonth() - numMonths,
      new Date().getDate()).toLocaleDateString('en-CA')
  }

  const updateCustomDate = (event) => {
    event.preventDefault();

    const {target} = event;

    if(target.customDate.value !== '') {
      if(dateMatchesValidRegex(target.customDate.value) !== null) {
        setLastUpdatedSearchString(`${customDatePrefix}${target.customDate.value}`);
      }
      else {
        setcustomDateError(true);
      }
    }
  }

  const dateMatchesValidRegex = (dateString) => {
    return dateString.match(YYYYMMDD_REGEX) || dateString.match(YYYYMM_REGEX) || dateString.match(YYYY_REGEX);
  }

  const handleDatePrefixChange = (event, data) => {
    setCustomDatePrefix(data.value);
  }

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

  // Memoize this handler so we don't re-render the search results on every overall re-render
  const handlePageChange = useCallback(
    (event, data) => {
      setSearchPage(data.activePage);
    },
    []
  );

  const getAllPublishers = async () => {
    const response = await fetch('/api/fhir/Organization');
    const json = await response.json();

    const data = (json.entry || []).map((entry) => ({ id: entry.resource.id, name: entry.resource.name, alias: entry.resource.alias[0] }))
    const sorted_data = _.orderBy(data, ['alias'])
    setAllPublishers(sorted_data);
  };

  const handlePublisherChange = (event) => {
    if (event.target.checked && !searchPublisher.includes(event.target.value)) {
      setSearchPublisher([ ...searchPublisher, event.target.value]);
      setSearchPage(1);
    }
    else if (!event.target.checked && searchPublisher.includes(event.target.value)) {
      const publisher = searchPublisher.filter(item => item !== event.target.value);
      setSearchPublisher(publisher);
      setSearchPage(1);
    }
  }

  const handleStatusChange = (event) => {
    setSearchStatus({ ...searchStatus, [event.name]: event.checked });
    setSearchPage(1);
  };

  // Handle changes to the type of search
  const handleSearchTypeChange = (event, data) => {
    setSearchParameter(data.value);
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
    return options
  }

  return (
    <React.Fragment>

      <Menu color={HEADER_COLOR} inverted attached>
        <Menu.Item header><h2>{HEADER_TEXT}</h2></Menu.Item>
      </Menu>

      <Container fluid className='App' style={{'backgroundColor': BACKGROUND_COLOR}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
            {props.smart && (
                <Segment>
                  <Patient patient={patient} />
                </Segment>
            )}
              <Segment>
                <h3>{SEARCH_BOX_TEXT}</h3>

                <h4>Search By</h4>

                <Form onSubmit={updateSearchString}>
                  <Form.Group>
                    <Form.Select
                      selection
                      name="type"
                      options={searchTypeOptions()}
                      defaultValue='_content'
                      onChange={handleSearchTypeChange}
                      width={5}
                      style={{minWidth:"8em"}}
                    />

                    <Form.Input placeholder='Search terms...' action={{ primary: true, icon: 'search' }}
                           value={searchInput} onChange={updateSearchInput}  width={11}/>
                  </Form.Group>
                </Form>

                <h4>Artifact Last Updated</h4>

                <Form error onSubmit={updateCustomDate}>
                  <Form.Group grouped>
                    {LAST_UPDATED_PRESETS.map((item) => (
                      <Form.Field
                        control='input'
                        type='radio'
                        name='lastUpdatedRadio'
                        className='normal-weight'
                        label={item.label}
                        key={item.label}
                        value={item.label}
                        data={item.time_in_months}
                        onChange={handleLastUpdatedChange}
                        defaultChecked={item.label === 'Any time' ? true : false}
                      />
                    ))}
                  </Form.Group>
                  { showLastUpdatedCustomDate &&
                    <>
                    <Form.Group>
                      <Form.Select
                        selection
                        name="type"
                        options={LAST_UPDATED_CUSTOM_PREFIXES}
                        defaultValue='ge'
                        width={5}
                        style={{minWidth:"10em"}}
                        onChange={handleDatePrefixChange}
                      />
                      <Form.Input
                        type='text'
                        name='customDate'
                        placeholder='Custom date...'
                        width={7}
                      />
                      <Button primary type="submit">Apply Date</Button>
                    </Form.Group>
                      {customDateError ? <Message error content='Date format is invalid. Format as YYYY-MM-DD, YYYY-MM, or YYYY.'/>
                                       : <small class="helper">*Format custom date as YYYY-MM-DD, YYYY-MM, or YYYY.</small>
                      }
                    </>
                  }
                </Form>

                {selectedKeywords.length > 0 && <h5>Additional Search Keywords</h5>}
                {selectedKeywords.map(k => <p key={k}><Label color='blue'><Icon name='delete' onClick={() => handleKeywordClick(k)}/> {k}</Label></p>)}

                {!props.smart && meshRoots && (
                  <React.Fragment>
                    <h4>Browse By</h4>
                      {meshRoots.map((element, i) => (
                          <List key={element.treeNumber + i}>
                            { (element.indirectArtifacts > 0) &&
                              <List.Item key={element.treeNumber}>
                                <React.Fragment>
                                  <MeshTreeNode element={element}
                                                meshNodeExpanded={meshNodeExpanded}
                                                meshNodeSelected={meshNodeSelected}
                                                setMeshNodeSelected={setMeshNodeSelected}
                                                setMeshNodeExpanded={setMeshNodeExpanded}
                                                key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "root"}/>
                                  <MeshTree
                                    meshNodeExpanded={meshNodeExpanded}
                                    meshNodeSelected={meshNodeSelected}
                                    setMeshNodeExpanded={setMeshNodeExpanded}
                                    setMeshNodeSelected={setMeshNodeSelected}
                                    key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "tree"}
                                    treeNum={element.treeNumber}
                                  />
                                </React.Fragment>
                              </List.Item>
                            }
                          </List>
                        )
                      )
                    }
                  </React.Fragment>
                )}

                <h4>Status</h4>
                <List>
                {STATUS.map((name) => (
                  <List.Item key={name}>
                    <div className="ui checkbox">
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
                      <div className="ui checkbox">
                        <input type="checkbox"
                              checked={searchPublisher.includes[publisher.id]}
                              onChange={handlePublisherChange}
                              name={publisher.alias}
                              value={publisher.id}
                        />
                        <label>
                          <span data-tooltip={publisher.name} data-position="right center">{publisher.alias}</span>
                        </label>
                      </div>
                    </List.Item>
                  ))}
                </List>
              </Segment>

              {props.smart && (
                <Segment>
                  <h3>Conditions</h3>
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
