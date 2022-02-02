import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SMART } from './FHIRClientWrapper';
import Patient from './Patient';
import Conditions from './Conditions';
import ConceptCodingPopup from './ConceptCodingPopup';
import SearchResults from './SearchResults';
import MeshTree from './MeshTree';
import MeshTreeNode from './MeshTreeNode';
import ArtifactType from './ArtifactType';
import { Container, Grid, Segment, Menu, Label, Icon, List, Form, Button, Message, Popup } from 'semantic-ui-react';
import urlSearchObject from './utils'

import './App.css';
import _ from 'lodash';

function App(props) {

  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchString, setSearchString] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [searchResults, setSearchResults] = useState({ status: 'none' });
  const [searchPage, setSearchPage] = useState(1);
  const [searchParameter, setSearchParameter] = useState('_content');
  const [meshRoots, setMeshRoots] = useState([]);
  const [meshNodeExpanded, setMeshNodeExpanded] = useState(new Map());
  const [lastUpdatedSearchString, setLastUpdatedSearchString] = useState('');
  const [showLastUpdatedCustomDate, setShowLastUpdatedCustomDate] = useState(false);
  const [customDatePrefix, setCustomDatePrefix] = useState('ge');
  const [customDateError, setcustomDateError] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [allArtifactTypes, setAllArtifactTypes] = useState([]);
  const [selectedArtifactTypes, setSelectedArtifactTypes] = useState([]);

  /* TODO: The cedar_ui app allows the user to change the count of results per page,
   but cedar_smart does not. Is this something that we want to support?

   const [searchCount, setSearchCount] = useState(10);*/
   
   const [searchStatus, setSearchStatus] = useState([]);
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

  const [lastUpdatedPreset, setLastUpdatedPreset] = useState('Any time') 

  const LAST_UPDATED_PRESETS = useMemo(() => ({
      "Any time": "",
      "Within 1 month": 1,
      "Within 3 months": 3,
      "Within 6 months": 6,
      "Within 1 year": 12,
      "Custom": "",
    }), []
  );

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

  const setLastUpdatedStates = useCallback(
    (lastUpdatedPreset) => {
      // Clear the Custom date input text when the user changes the 'Artifact Last Updated' radio 
      setCustomDateInput('');
      switch(lastUpdatedPreset) {
        case "Within 1 month":
        case "Within 3 months":
        case "Within 6 months":
        case "Within 1 year":
          const timeInMonths = LAST_UPDATED_PRESETS[lastUpdatedPreset];
          const dateString = getXMonthsAgo(timeInMonths);
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
    },[LAST_UPDATED_PRESETS]
  ); 

  useEffect(() => {
    const url = new URLSearchParams(document.location.search);
    const userSearch = url.get("user-search");

    if(userSearch) {
      const userSearchObject = urlSearchObject.convertFromBase64(userSearch);

      for(const [key, value] of Object.entries(userSearchObject)) {
        if(key === 'lastUpdatedSearchString') {
          // Only 'Custom' dates set the lastUpdated search string to a specific date (e.g., 20211011)
          // All other date presets (e.g., 'Within 3 months') are relative to today's date; thus in these cases the lastUpdated search string must be re-computed
          if(value !== '') {
            setShowLastUpdatedCustomDate(true);
            setLastUpdatedSearchString(value);
            setCustomDatePrefix(value.substring(0,2));
            setCustomDateInput(value.substring(2, value.length));
          }
        }
        else if(key === 'lastUpdatedPreset') {
          setLastUpdatedPreset(value);
          if(value !== 'Custom') {
            setLastUpdatedStates(value);
          }
        }
        else if(key === 'searchParameter') {
          setSearchParameter(value);
        }
        else if(key === 'searchPage') {
          setSearchPage(value);
        }
        else if(key === 'searchPublisher') {
          setSearchPublisher(value);
        }
        else if(key === 'searchStatus') {
          setSearchStatus(value);
        }
        else if(key === 'searchString') {
          setSearchString(value);
          setSearchInput(value);
        }
        else if(key === 'selectedConcepts') {
          setSelectedConcepts(value);
        }
        else if(key === 'selectedKeywords') {
          setSelectedKeywords(value);
        }
        else if(key === 'selectedArtifactTypes') {
          setSelectedArtifactTypes(value);
        }
      }
    } 
  }, [setLastUpdatedStates])

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
      let searchParams = {}
      let query = new URLSearchParams();
      let anySearchTerms = false;

      let textSearchString = '';
      let keywordSearchString = '';
      let titleSearchString = '';
      let selectedConceptCodes = [];

      if (selectedKeywords.length > 0) {
        keywordSearchString = `(${selectedKeywords.map(k => `"${k}"`).join(' AND ')})`;
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
            textSearchString = searchString;
        }
      }

      if(selectedConcepts.length > 0) {
        selectedConceptCodes = selectedConcepts.map(concept => (
          concept.coding.map(code => code.system ? `${code.system}|${code.code}` : code.code)
        ))
      }

      // TODO: allow the user to change the count of results per page?
      query.append('_count', SEARCH_COUNT);
      query.append('page', searchPage);

      // Return all possible statuses by default if user hasn't filtered by any yet
      if(searchStatus.length === 0) {
        query.append('artifact-current-state', ["active", "retired", "draft", "unknown"].join(','));
      }
      else if(searchStatus.length > 0) { // Regular filtering
        query.append('artifact-current-state', searchStatus.map(name => name.toLowerCase()).join(','));
      }

      if(searchPublisher.length > 0) {
        query.append('artifact-publisher', searchPublisher.join(','));
      }

      if(lastUpdatedSearchString.length > 0) {
        query.append('_lastUpdated', lastUpdatedSearchString);
      }

      searchParams['classification:text'] = keywordSearchString;
      searchParams['_content'] = textSearchString;
      searchParams['title:contains'] = titleSearchString;
      searchParams['classification'] = selectedConceptCodes;
      if(selectedArtifactTypes.length > 0) {
        searchParams['artifact-type'] = selectedArtifactTypes.join(',');
      }

      // TODO: Setting a flag here, anySearchTerms, and checking for it below before making a request to the API seems less than ideal.
      // Essentially, we only want to make a request if the user has interacted with any of the search filters in the UI (searchParams object), i.e.,
      // artifact keywords, artifact concepts, free-text search, condition search (SMART on FHIR app), MeSH search via MeSH browser, and
      // at least one artifact status has been selected.
      for (const [queryParamKey, queryParamValue] of Object.entries(searchParams)) {
        if(queryParamValue.length > 0) {
          anySearchTerms = true;
          if(Array.isArray(queryParamValue)) {
            for(const value of queryParamValue) {
              query.append(queryParamKey, value);
            }
          }
          else {
            query.append(queryParamKey, queryParamValue);
          }
        }
      }

      /* Note: By default a fetch() request timeouts at the time indicated by the browser. In Chrome,
         a network request times out in 300 seconds, while Firefox will time out in 90 seconds.
         Should we consider using fetchWithTimeout() instead so that we can establish a shorter time out window? */
      let baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      let url = new URL(baseUrl);
      if (anySearchTerms) {
        const response = await fetch(`/api/fhir/Citation?${query.toString()}`);
        const json = await response.json();
        // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
        // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
        setSearchResults({ status: 'complete', data: json });

        const urlSearchObj = urlSearchObject.getAsBase64(selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, 
                                                    searchParameter, lastUpdatedSearchString, lastUpdatedPreset, selectedArtifactTypes);

        url.searchParams.set("user-search", urlSearchObj);
        window.history.replaceState({}, '', url);
      } else {
        setSearchResults({ status: 'none' });
        window.history.replaceState({}, '', baseUrl);
      }
    };

    cedarSearch();

  }, [selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, searchParameter, lastUpdatedSearchString, lastUpdatedPreset, selectedArtifactTypes]);

  useEffect(() => {
    getAllPublishers();
    getMeshRoots();
    getAllArtifactTypes();
  }, []);

  const getMeshRoots = async () => {
    const response = await fetch('/api/fhir/CodeSystem/$get-mesh-children');
    const json = await response.json();
    const data = (Object.entries(json.parameter) || []).map(([k, value]) =>
      ({  name: value.valueCoding.display,
          treeNumber: value.valueCoding.extension[0].valueCode,
          meshCode: null,
          system: value.valueCoding.system,
          isGlobalRoot: true,
          hasChildren: value.valueCoding.extension[1].valueBoolean,
          directArtifacts: value.valueCoding.extension[2].valueUnsignedInt,
          indirectArtifacts: value.valueCoding.extension[3].valueUnsignedInt
      }));
    setMeshRoots(data);
  }

  const updateSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const updateCustomDateInput = (event) => {
    setCustomDateInput(event.target.value);
  }

  const updateSearchString = (event) => {
    event.preventDefault();
    setSearchString(searchInput);
    setSearchPage(1);
  };

  const handleLastUpdatedChange = (event) => {
    const {target} = event;
    const lastUpdatedPreset = target.value;
    setLastUpdatedPreset(lastUpdatedPreset);
    setLastUpdatedStates(lastUpdatedPreset);
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

  const handleLastUpdatedCustomPrefixChange = (event, data) => {
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
  const handleConceptRemove = useCallback(
    (concept) => {
      setSelectedConcepts(selectedConcepts.filter(c => c !== concept));
      setSearchPage(1);
    },
    [selectedConcepts]
  );

  // Memoize this handler so we don't re-render on every overall re-render
  const handleConceptSelect = useCallback(
    // This method handles selection of a concept, including checking to see if the codes in that concept are a
    // subset of the codes from an already-selected concept
    // 
    // Example: hypertension, with codes = [SNOMED-CT: 38341003] is a subset of hypertensive disease, with codes = [MeSH: D006973, SNOMED-CT: 38341003, 
    // SNOMED-CT (ESP): 38341003, MeSH (ESP): D006973]
    (newlySelectedConcept) => {
      const newlySelectedConceptCodes = newlySelectedConcept.coding.map(code => `${code.code}|${code?.system}`);
      const previouslySelectedConceptCodes = selectedConcepts.map(condition => condition.coding.map(code => `${code.code}|${code?.system}`));

      // Look through each previously selected concept
      for (const [index, concept] of previouslySelectedConceptCodes.entries()) {
        if (newlySelectedConceptCodes.every(c => concept.includes(c))) {
          // This concept's codes are a subset of a previously selected concept, so we don't need to do anything
          return;
        } else if (concept.every(c => newlySelectedConceptCodes.includes(c))) {
          // This concept's codes are a superset of a previously selected concept, so we can replace that concept
          // Use functional updates as per https://reactjs.org/docs/hooks-reference.html#functional-updates
          setSelectedConcepts(prevSelectedConcepts => [...prevSelectedConcepts.slice(0, index), ...prevSelectedConcepts.slice(index + 1)]);
        }
      }

      setSelectedConcepts(prevSelectedConcepts => [...prevSelectedConcepts, newlySelectedConcept]);
      setSearchPage(1);
    },
    [selectedConcepts]
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

  const getAllArtifactTypes = async () => {
    const response = await fetch('/api/fhir/Citation/$get-artifact-types');
    const json = await response.json();

    const data = (json.parameter|| []).map((parameter) => ({ key: parameter.valueCoding.display, text: parameter.valueCoding.display, value: parameter.valueCoding.display }))
    const sorted_data = _.orderBy(data, ['key'])
    setAllArtifactTypes(sorted_data);
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
    if (event.target.checked && !searchStatus.includes(event.target.name)) {
      setSearchStatus([ ...searchStatus, event.target.name]);
      setSearchPage(1);
    }
    else if (!event.target.checked && searchStatus.includes(event.target.name)) {
      const status = searchStatus.filter(item => item !== event.target.name);
      setSearchStatus(status);
      setSearchPage(1);
    }
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
                      onChange={handleSearchTypeChange}
                      width={5}
                      style={{minWidth:"8em"}}
                      value={searchParameter}
                    />

                    <Form.Input placeholder='Search terms...' action={{ primary: true, icon: 'search' }}
                           value={searchInput} onChange={updateSearchInput}  width={11}/>
                  </Form.Group>
                </Form>

                <h4>Artifact Last Updated</h4>

                <Form error onSubmit={updateCustomDate}>
                  <Form.Group grouped>
                    {Object.keys(LAST_UPDATED_PRESETS).map((key) => (
                      <Form.Field
                        control='input'
                        type='radio'
                        name='lastUpdatedRadio'
                        className='normal-weight'
                        label={key}
                        key={key}
                        value={key}
                        data={LAST_UPDATED_PRESETS[key]}
                        onChange={handleLastUpdatedChange}
                        checked={lastUpdatedPreset === key ? true : false}
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
                        value={customDatePrefix}
                        width={5}
                        style={{minWidth:"10em"}}
                        onChange={handleLastUpdatedCustomPrefixChange}
                      />
                      <Form.Input
                        type='text'
                        name='customDate'
                        placeholder='Custom date...'
                        value={customDateInput}
                        onChange={updateCustomDateInput}
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
                {selectedKeywords.map(k => <div className='search-tags' key={k}><Label color='blue'><Icon name='delete' onClick={() => handleKeywordClick(k)}/> {k}</Label></div>)}


                {selectedConcepts.length > 0 && <h5>Additional Search Concepts</h5>}
                {selectedConcepts.map(concept => 
                  <div className='search-tags' key={concept.text}>
                    <Popup trigger={<Label color='green'><Icon name='delete' onClick={() => handleConceptRemove(concept)}/> {concept.text}</Label>} 
                           flowing 
                           hoverable
                    >
                      <h4>Concept: {concept.text}</h4>
                      <ConceptCodingPopup concept={concept}/>
                    </Popup>
                  </div>
                )}

                <h4>Artifact Type</h4>
                <ArtifactType selectedArtifactTypes={selectedArtifactTypes} 
                              setSelectedArtifactTypes={setSelectedArtifactTypes} 
                              allArtifactTypes={allArtifactTypes}
                />

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
                                                setMeshNodeExpanded={setMeshNodeExpanded}
                                                key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "root"}
                                                handleConceptSelect={handleConceptSelect}
                                                selectedConcepts={selectedConcepts}
                                  />
                                  <MeshTree
                                    meshNodeExpanded={meshNodeExpanded}
                                    setMeshNodeExpanded={setMeshNodeExpanded}
                                    key={meshNodeExpanded.get(element.treeNumber) + element.treeNumber + "tree"}
                                    treeNum={element.treeNumber}
                                    handleConceptSelect={handleConceptSelect}
                                    selectedConcepts={selectedConcepts}
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
                              checked={searchStatus.includes(name)}
                              onChange={handleStatusChange}
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
                              checked={searchPublisher.includes(publisher.id)}
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
                  <Conditions conditions={conditions}
                              handleConceptSelect={handleConceptSelect}
                              handleKeywordClick={handleKeywordClick}
                              selectedConcepts={selectedConcepts}
                              selectedKeywords={selectedKeywords}
                  />
                </Segment>
              )}

            </Grid.Column>
            <Grid.Column width={11}>
              <SearchResults searchResults={searchResults}
                             page={searchPage}
                             onPageChange={handlePageChange}
                             onKeywordClick={handleKeywordClick}
                             onConceptClick={handleConceptSelect}
                             selectedConcepts={selectedConcepts}
                             selectedKeywords={selectedKeywords}
                             activeTabIndex={activeTabIndex}
                             setActiveTabIndex={setActiveTabIndex}
                             />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>

    </React.Fragment>
  );
}

export default App;
