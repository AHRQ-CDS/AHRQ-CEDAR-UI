import React, { useCallback, useEffect, useState } from 'react';
import { Container, Grid, Segment } from 'semantic-ui-react';

import AhrqHeader from './AhrqHeader';
import SortBy from './SortBy';
import ArtifactLastUpdated from './ArtifactLastUpdated';
import ArtifactType from './ArtifactType';
import Conditions from './Conditions';
import FreeTextSearch from './FreeTextSearch';
import MeshTreeBrowser from './MeshTreeBrowser';
import Patient from './Patient';
import Publishers from './Publishers';
import { SMART } from './FHIRClientWrapper';
import SearchConcepts from './SearchConcepts';
import SearchKeywords from './SearchKeywords';
import SearchResults from './SearchResults';
import Status from './Status';
import AhrqFooter from './AhrqFooter';
import { LAST_UPDATED_PRESETS } from '../utils/constants';
import { urlSearchObject, dateStringFromPreset } from '../utils/utils';

import '../assets/css/App.css';

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
  const [sortByPreset, setSortByPreset] = useState('Default');
  const [lastUpdatedPreset, setLastUpdatedPreset] = useState('Any time');
  const [lastUpdatedSearchString, setLastUpdatedSearchString] = useState('');
  const [showLastUpdatedCustomDate, setShowLastUpdatedCustomDate] = useState(false);
  const [customDatePrefix, setCustomDatePrefix] = useState('ge');
  const [customDateError, setCustomDateError] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedArtifactTypes, setSelectedArtifactTypes] = useState([]);
  const [searchStatus, setSearchStatus] = useState(['Active', 'Unknown']);
  const [searchPublisher, setSearchPublisher] = useState([]);

  // TODO: The cedar_ui app allows the user to change the count of results per page,
  // but cedar_smart does not. Is this something that we want to support?
  // const [searchCount, setSearchCount] = useState(10);

  // TODO: Related to above. Currently, have a constant here in lieu of supporting a user-selected
  // number of page results returned (e.g., 10, 20, etc.)
  const SEARCH_COUNT = 10;
  const HEADER_TEXT = props.smart === true ? 'CEDAR SMART Demonstration' : 'CEDAR Standalone Demonstration'
  const SEARCH_BOX_TEXT = props.smart === true ? 'Additional Filters' : 'Search, Sort and Filter'
  const BACKGROUND_COLOR = props.smart === true ? '#FFFFFF' : '#F8F8F8'

  // Sets the application states from base64-encoded user-search query parameters if they are in the URL
  useEffect(() => {
    const url = new URLSearchParams(document.location.search);
    const userSearch = url.get("user-search");

    if (userSearch) {
      const userSearchObject = urlSearchObject.convertFromBase64(userSearch);

      for (const [key, value] of Object.entries(userSearchObject)) {
        if(key === 'lastUpdatedSearchString') {
          // Only "Custom" dates set the lastUpdated search string to a specific date (e.g., 20211011)
          // All other date presets (e.g., "Within 3 months") are relative to today's date; thus in these cases the lastUpdated search string must be recomputed
          if(value !== '') {
            // _lastUpdated has the format prefixDateString, as in ge2021-11-14. Possible date string formats are YYYY-MM-DD, YYYY-MM, YYYY
            setCustomDatePrefix(value.substring(0,2));
            setCustomDateInput(value.substring(2, value.length));
            setLastUpdatedSearchString(value);
          }
        }
        else if (key === 'lastUpdatedPreset') {
          setLastUpdatedPreset(value);

          if (value === 'Custom') {
            setShowLastUpdatedCustomDate(true);
          }
          else {
            setShowLastUpdatedCustomDate(false);
            // Recompute the lastUpdated search string relative to today's date for "Within 1 month", "Within 3 months", "Within 6 months", "Within 1 year"
            // Set the lastUpdated search string to '' for "Anytime"
            value === "Any time" ? setLastUpdatedSearchString('') : setLastUpdatedSearchString(dateStringFromPreset(LAST_UPDATED_PRESETS[value]));
          }
        }
        else if (key === 'sortByPreset') {
          setSortByPreset(value);
        }
        else if (key === 'searchParameter') {
          setSearchParameter(value);
        }
        else if (key === 'searchPage') {
          setSearchPage(value);
        }
        else if (key === 'searchPublisher') {
          setSearchPublisher(value);
        }
        else if (key === 'searchStatus') {
          setSearchStatus(value);
        }
        else if (key === 'searchString') {
          setSearchString(value);
          setSearchInput(value);
        }
        else if (key === 'selectedConcepts') {
          setSelectedConcepts(value);
        }
        else if (key === 'selectedKeywords') {
          setSelectedKeywords(value);
        }
        else if (key === 'selectedArtifactTypes') {
          setSelectedArtifactTypes(value);
        }
      }
    } 
  }, [])

  useEffect(() => {
    // If we're running in a SMART on FHIR context, load the patient and all resources
    if (props.smart) {
      SMART.load().then(([, patient, conditions]) => {
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

      // If no status is selected, do not perform a search
      if(searchStatus.length === 0) {
        setSearchResults({ status: 'none' });
        return
      }
      else if(searchStatus.length > 0) {
        query.append('artifact-current-state', searchStatus.map(name => name.toLowerCase()).join(','));
      }

      // If no publisher is selected, do not perform a search
      if(searchPublisher.length === 0) {
        setSearchResults({ status: 'none' });
        return
      }
      else if(searchPublisher.length > 0) {
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

      /* 
        Note: By default a fetch() request timeouts at the time indicated by the browser. In Chrome,
         a network request times out in 300 seconds, while Firefox will time out in 90 seconds.
         Should we consider using fetchWithTimeout() instead so that we can establish a shorter time out window? 
      */
      let baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      let url = new URL(baseUrl);
      if (anySearchTerms) {
        const response = await fetch(`/api/fhir/Citation?${query.toString()}`);
        const json = await response.json();
        // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
        // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
        setSearchResults({ status: 'complete', data: json });

        const urlSearchObj = urlSearchObject.getAsBase64(selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, 
                                                    searchParameter, lastUpdatedSearchString, sortByPreset, lastUpdatedPreset, selectedArtifactTypes);

        url.searchParams.set("user-search", urlSearchObj);
        window.history.replaceState({}, '', url);
      } else {
        setSearchResults({ status: 'none' });
        window.history.replaceState({}, '', baseUrl);
      }
    };

    cedarSearch();

  }, [selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, searchParameter, lastUpdatedSearchString, sortByPreset, lastUpdatedPreset, selectedArtifactTypes]);

  /* 
    This method handles selection of a concept, including checking to see if the codes in that concept are a subset of the codes from an already-selected concept
    Example: hypertension, with codes = [SNOMED-CT: 38341003], is a subset of hypertensive disease, with codes = [MeSH: D006973, SNOMED-CT: 38341003, 
    SNOMED-CT (ESP): 38341003, MeSH (ESP): D006973]

    This handler is also memoized so we don't re-render on every overall re-render
  */
  const handleConceptSelect = useCallback(
    (newlySelectedConcept) => {
      const newlySelectedConceptCodes = newlySelectedConcept.coding.map(code => `${code.code}|${code?.system}`);
      const previouslySelectedConceptCodes = selectedConcepts.map(condition => condition.coding.map(code => `${code.code}|${code?.system}`));

      // Look through each previously selected concept
      for (const [index, concept] of previouslySelectedConceptCodes.entries()) {
        if (newlySelectedConceptCodes.every(c => concept.includes(c))) {
          // This concept's codes are a subset of a previously selected concept, so we don't need to do anything
          return;
        } else if (concept.every(c => newlySelectedConceptCodes.includes(c))) {
          /* 
            This concept's codes are a superset of a previously selected concept, so we can replace that concept
            Use functional updates as per https://reactjs.org/docs/hooks-reference.html#functional-updates 
          */
          setSelectedConcepts(prevSelectedConcepts => [...prevSelectedConcepts.slice(0, index), ...prevSelectedConcepts.slice(index + 1)]);
        }
      }

      setSelectedConcepts(prevSelectedConcepts => [...prevSelectedConcepts, newlySelectedConcept]);
      setSearchPage(1);
    },
    [selectedConcepts]
  );

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

  return (
    <>
      <AhrqHeader headerText={HEADER_TEXT} />
      <Container fluid className='App' style={{'backgroundColor': BACKGROUND_COLOR}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5}>
              {props.smart && (<Patient patient={patient} />)}
              <Segment>
                <h3>{SEARCH_BOX_TEXT}</h3>
                <FreeTextSearch searchParameter={searchParameter}
                                searchInput={searchInput}
                                setSearchParameter={setSearchParameter}
                                setSearchInput={setSearchInput}
                                setSearchString={setSearchString}
                                setSearchPage={setSearchPage}
                />

                <SortBy sortByPreset={sortByPreset} setSortByPreset={setSortByPreset} />

                <ArtifactLastUpdated setLastUpdatedSearchString={setLastUpdatedSearchString}
                                     lastUpdatedPreset={lastUpdatedPreset}
                                     setLastUpdatedPreset={setLastUpdatedPreset}
                                     customDateInput={customDateInput}
                                     setCustomDateInput={setCustomDateInput}
                                     showLastUpdatedCustomDate={showLastUpdatedCustomDate}
                                     setShowLastUpdatedCustomDate={setShowLastUpdatedCustomDate}
                                     customDatePrefix={customDatePrefix}
                                     setCustomDatePrefix={setCustomDatePrefix}
                                     customDateError={customDateError}
                                     setCustomDateError={setCustomDateError}                
                />

                <SearchKeywords handleKeywordClick={handleKeywordClick} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} setSearchPage={setSearchPage} />

                <SearchConcepts selectedConcepts={selectedConcepts} setSelectedConcepts={setSelectedConcepts} setSearchPage={setSearchPage} />

                <ArtifactType selectedArtifactTypes={selectedArtifactTypes} setSelectedArtifactTypes={setSelectedArtifactTypes} />

                {!props.smart && (<MeshTreeBrowser handleConceptSelect={handleConceptSelect} selectedConcepts={selectedConcepts} /> )}

                <Status searchStatus={searchStatus} setSearchStatus={setSearchStatus} setSearchPage={setSearchPage} />

                <Publishers searchPublisher={searchPublisher} setSearchPublisher={setSearchPublisher} setSearchPage={setSearchPage} />

                {props.smart && (
                <Conditions conditions={conditions}
                            handleConceptSelect={handleConceptSelect}
                            handleKeywordClick={handleKeywordClick}
                            selectedConcepts={selectedConcepts}
                            selectedKeywords={selectedKeywords}
                />
                )}
              </Segment>
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
      <AhrqFooter />
    </>
  );
}

export default App;
