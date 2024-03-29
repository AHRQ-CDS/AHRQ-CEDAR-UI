import _ from 'lodash'
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Icon, Container, Grid, Segment } from 'semantic-ui-react';

import AhrqHeader from './AhrqHeader';
import SortBy from './SortBy';
import DateFilters from './DateFilters';
import ArtifactType from './ArtifactType';
import Conditions from './Conditions';
import ContentSearchStrings from './ContentSearchStrings';
import FreeTextSearch from './FreeTextSearch';
import MeshTreeBrowser from './MeshTreeBrowser';
import Patient from './Patient';
import Publishers from './Publishers';
import { SMART } from './FHIRClientWrapper';
import SearchConcepts from './SearchConcepts';
import SearchKeywords from './SearchKeywords';
import SearchResults from './SearchResults';
import SearchResultsNavigation from './SearchResultsNavigation';
import RelatedSearches from './RelatedSearches';
import Status from './Status';
import TitleSearchStrings from './TitleSearchStrings';
import AhrqFooter from './AhrqFooter';
import { DATE_PRESETS } from '../utils/constants';
import { urlSearchObject, dateStringFromPreset } from '../utils/utils';

import '../assets/css/App.css';
import '../assets/css/Print.css';

function App(props) {
  const [patient, setPatient] = useState();
  const [conditions, setConditions] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [contentSearchStrings, setContentSearchStrings] = useState([]);
  const [titleSearchStrings, setTitleSearchStrings] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [searchResults, setSearchResults] = useState({ status: 'none' });
  const [searchPage, setSearchPage] = useState(1);
  const [sortOptions, setSortOptions] = useState([]);
  const [dateFilterType, setDateFilterType] = useState('article-date');
  const [dateFilterPreset, setDateFilterPreset] = useState('Any time');
  const [dateFilterSearchString, setDateFilterSearchString] = useState('');
  const [showDateFilterCustomDate, setShowDateFilterCustomDate] = useState(false);
  const [customDatePrefix, setCustomDatePrefix] = useState('ge');
  const [customDateError, setCustomDateError] = useState(false);
  const [customDateInput, setCustomDateInput] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedArtifactTypes, setSelectedArtifactTypes] = useState([]);
  const [searchStatus, setSearchStatus] = useState(['Active', 'Unknown']);
  const [searchPublisher, setSearchPublisher] = useState([]);
  const [isMobileDrawer, setIsMobileDrawer] = useState(true)

  // TODO: The cedar_ui app allows the user to change the count of results per page,
  // but cedar_smart does not. Is this something that we want to support?
  // const [searchCount, setSearchCount] = useState(10);

  // TODO: Related to above. Currently, have a constant here in lieu of supporting a user-selected
  // number of page results returned (e.g., 10, 20, etc.)
  const SEARCH_COUNT = 10;
  const HEADER_TEXT = props.smart === true ? 'CEDAR SMART Demonstration User Interface' : 'CEDAR Demonstration User Interface';
  const BACKGROUND_COLOR = props.smart === true ? '#FFFFFF' : '#F8F8F8';

  // Sets the application states from base64-encoded user-search query parameters if they are in the URL
  useEffect(() => {
    const url = new URLSearchParams(document.location.search);
    const userSearch = url.get("user-search");

    if (userSearch) {
      const userSearchObject = urlSearchObject.convertFromBase64(userSearch);

      for (const [key, value] of Object.entries(userSearchObject)) {
        if (key === 'dateFilterSearchString') {
          // Only "Custom" dates set the dateFilterSearchString to a specific date (e.g., 20211011)
          // All other date presets (e.g., "Within 3 months") are relative to today's date; thus in these cases the dateFilterSearchString must be recomputed
          if(value !== '') {
            // _lastUpdated and article-date have the format {prefix}{dateString}, as in ge2021-11-14. Valid formats are YYYY-MM-DD, YYYY-MM, YYYY
            setCustomDatePrefix(value.substring(0,2));
            setCustomDateInput(value.substring(2, value.length));
            setDateFilterSearchString(value);
          }
        }
        else if (key === 'dateFilterType') {
          setDateFilterType(value);
        }
        else if (key === 'dateFilterPreset') {
          setDateFilterPreset(value);

          if (value === 'Custom') {
            setShowDateFilterCustomDate(true);
          }
          else {
            setShowDateFilterCustomDate(false);
            // Recompute the dateFilterSearchString relative to today's date for "Within 1 month", "Within 3 months", "Within 6 months", "Within 1 year"
            // Set dateFilterSearchString to '' for "Anytime"
            value === "Any time" ? setDateFilterSearchString('') : setDateFilterSearchString(dateStringFromPreset(DATE_PRESETS[value]));
          }
        }
        else if (key === 'sortOptions') {
          setSortOptions(value);
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
        else if (key === 'selectedConcepts') {
          setSelectedConcepts(value);
        }
        else if (key === 'selectedKeywords') {
          setSelectedKeywords(value);
          if (value.length > 0) {
            const terms = value.map((term) => ({ key: `Keyword: ${term}`, text: `Keyword: ${term}`, value: term }))
            setSearchOptions((previousOptions) => previousOptions.concat(terms))
          }
        }
        else if (key === 'contentSearchStrings') {
          setContentSearchStrings(value);
          if (value.length > 0) {
            const terms = value.map((term) => ({ key: `Text: ${term}`, text: `Text: ${term}`, value: term }))
            setSearchOptions((previousOptions) => previousOptions.concat(terms))
          }
        }
        else if (key === 'titleSearchStrings') {
          setTitleSearchStrings(value);
          if (value.length > 0) {
            const terms = value.map((term) => ({ key: `Title: ${term}`, text: `Title: ${term}`, value: term }))
            setSearchOptions((previousOptions) => previousOptions.concat(terms))
          }
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
      const baseUrl= `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
      setSearchResults({ status: 'pending' });
      let searchParams = {}
      let query = new URLSearchParams();

      // If no status is selected, do not perform a search
      if (searchStatus.length === 0) {
        setSearchResults({ status: 'none' });
        return;
      }
      else {
        query.append('artifact-current-state', searchStatus.map(name => name.toLowerCase()).join(','));
      }

      // If no publisher is selected, do not perform a search
      if(searchPublisher.length === 0) {
        setSearchResults({ status: 'none' });
        return;
      }
      else {
        query.append('artifact-publisher', searchPublisher.join(','));
      }

      // If no search terms, do not perform a search
      if(selectedKeywords.length + titleSearchStrings.length + contentSearchStrings.length + selectedConcepts.length === 0) {
        setSearchResults({ status: 'none' });
        window.history.replaceState({}, '', baseUrl);
        return;
      }

      if (selectedKeywords.length > 0) {
        const keywordString = selectedKeywords.length > 1 ? `(${selectedKeywords.map(k => `(${k})`).join(' AND ')})` : selectedKeywords;
        query.append('classification:text', keywordString);
      }

      if (titleSearchStrings.length > 0) {
        for(const value of titleSearchStrings) {
          query.append('title:contains', value);
        }
      }

      if (contentSearchStrings.length > 0) {
        const contentString = contentSearchStrings.length > 1 ? `(${contentSearchStrings.map(k => `(${k})`).join(' AND ')})` : contentSearchStrings;
        query.append('_content', contentString);
      }

      if (dateFilterSearchString.length > 0) {
        query.append(dateFilterType, dateFilterSearchString);
      }

      if (sortOptions.length > 0) {
        const sortOptionString = sortOptions.join(',')
        query.append('_sort', sortOptionString);
      }

      if (selectedArtifactTypes.length > 0) {
       query.append('artifact-type', selectedArtifactTypes.join(','));
      }

      if (selectedConcepts.length > 0) {
        searchParams['classification'] = selectedConcepts.map(concept => (
          concept.coding.map(code => code.system ? `${code.system}|${code.code}` : code.code)
        ))

        for(const value of searchParams['classification']) {
          query.append('classification', value);
        }
      }

      // TODO: allow the user to change the count of results per page?
      query.append('_count', SEARCH_COUNT);
      query.append('page', searchPage);

      /*
        Notes:
        - By default a fetch() request timeouts at the time indicated by the browser. In Chrome,
          a network request times out in 300 seconds, while Firefox will time out in 90 seconds.
          Should we consider using fetchWithTimeout() instead so that we can establish a shorter
          time out window?
        - We set the HTTP From header so that it can be logged with the request to allow us to
          differentiate between use of our demo UI and other API usage.
      */
      const response = await fetch(`../api/fhir/Citation?${query.toString()}`, {
        headers: {
          'From': 'cedar-demo@cds.ahrq.gov'
        }
      });
      const json = await response.json();
      // TODO: need to see if search is still relevant (e.g. long running search might come after other items clicked
      // idea: for each search, increment a "most recent search" counter and don't set search results if the counter has moved on from this search
      setSearchResults({ status: 'complete', data: json });

      let url = new URL(baseUrl);
      url.searchParams.set("user-search", urlSearchObject.getAsBase64(
          selectedKeywords, selectedConcepts, contentSearchStrings, titleSearchStrings, searchPage, searchPublisher, searchStatus, dateFilterSearchString,
          dateFilterType, sortOptions, dateFilterPreset, selectedArtifactTypes));
      window.history.replaceState({}, '', url);
    };

    cedarSearch();

  }, [selectedKeywords, selectedConcepts, searchPage, searchPublisher, searchStatus, dateFilterSearchString, dateFilterType, sortOptions, dateFilterPreset,
    selectedArtifactTypes, contentSearchStrings, titleSearchStrings]);

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
      // Handle query update
      setSelectedKeywords((previousSelectedKeywords) => {
        if (previousSelectedKeywords.includes(keyword)) {
          return previousSelectedKeywords.filter(k => k !== keyword);
        } else {
          return previousSelectedKeywords.concat(keyword);
        }
      });

      // Handle search UI update
      const previousKeywords = searchOptions.filter(option => option.key.includes('Keywords:'))
      const target = `Keywords: ${keyword}`
      setSearchOptions((previousOptions) => {
        // Check if predicate (matchesProperty in this case) returns truthy for any element of the collection
        // see https://lodash.com/docs/4.17.15#some
        if (_.some(previousKeywords, _.matchesProperty('value', target))) {
          return previousOptions.filter(option => option.value !== target);
        } else {
          return previousOptions.concat({key: target, text: target, value: target, original: keyword});
        }
      })
      setSearchPage(1);
    }, [searchOptions]);

  return (
    <>
      <a href="#main-content" id="a11y-nav">Skip to main content</a>
      <AhrqHeader headerText={HEADER_TEXT} />
      <div className="search-bar no-print" id="main-content">
        <p className="description">
          This demonstration UI uses the CEDAR API and lets you to explore its capabilities. Enter a search term to get started.
        </p>
        <FreeTextSearch
          searchOptions={searchOptions}
          setContentSearchStrings={setContentSearchStrings}
          setSearchOptions={setSearchOptions}
          setSearchPage={setSearchPage}
          setSelectedKeywords={setSelectedKeywords}
          setTitleSearchStrings={setTitleSearchStrings}
        />
        <div className='drawer-toggle-wrapper'>
          <Button onClick={() => setIsMobileDrawer(!isMobileDrawer)} id='mobile-drawer-toggle'>
            <Icon name='sidebar'/>
            Search Controls
          </Button>
        </div>
      </div>
      <SearchResultsNavigation searchResults={searchResults} bgColor={BACKGROUND_COLOR} searchPage={searchPage} setSearchPage={setSearchPage} />
      <Container fluid className='App' style={{'backgroundColor': BACKGROUND_COLOR}}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={5} className='no-print' id='search-controls'>
              <div className={isMobileDrawer ? 'mobile-drawer' : 'mobile-drawer open'}>
                {props.smart && (<Patient patient={patient} />)}
                <Button icon='x' size='large' color='red' onClick={() => setIsMobileDrawer(!isMobileDrawer)} floated='right' id='mobile-drawer-close' aria-label='Close Mobile Drawer'/>
                <Segment>
                  <ContentSearchStrings contentSearchStrings={contentSearchStrings} setContentSearchStrings={setContentSearchStrings} setSearchOptions={setSearchOptions}/>
                  <SearchKeywords handleKeywordClick={handleKeywordClick} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords} setSearchPage={setSearchPage}/>
                  <SearchConcepts selectedConcepts={selectedConcepts} setSelectedConcepts={setSelectedConcepts} setSearchPage={setSearchPage}/>
                  <TitleSearchStrings titleSearchStrings={titleSearchStrings} setTitleSearchStrings={setTitleSearchStrings} setSearchOptions={setSearchOptions}/>

                  <h3>Sort and Filter</h3>
                  <SortBy sortOptions={sortOptions} setSortOptions={setSortOptions} />

                  <DateFilters
                    setDateFilterSearchString={setDateFilterSearchString}
                    dateFilterPreset={dateFilterPreset}
                    setDateFilterType={setDateFilterType}
                    dateFilterType={dateFilterType}
                    setDateFilterPreset={setDateFilterPreset}
                    customDateInput={customDateInput}
                    setCustomDateInput={setCustomDateInput}
                    showDateFilterCustomDate={showDateFilterCustomDate}
                    setShowDateFilterCustomDate={setShowDateFilterCustomDate}
                    customDatePrefix={customDatePrefix}
                    setCustomDatePrefix={setCustomDatePrefix}
                    customDateError={customDateError}
                    setCustomDateError={setCustomDateError}
                  />

                  <ArtifactType selectedArtifactTypes={selectedArtifactTypes} setSelectedArtifactTypes={setSelectedArtifactTypes} />

                  <Status searchStatus={searchStatus} setSearchStatus={setSearchStatus} setSearchPage={setSearchPage} />

                  <Publishers searchPublisher={searchPublisher} setSearchPublisher={setSearchPublisher} setSearchPage={setSearchPage} />

                  {!props.smart && (<MeshTreeBrowser handleConceptSelect={handleConceptSelect} selectedConcepts={selectedConcepts} /> )}

                  {props.smart && (
                  <Conditions conditions={conditions}
                              handleConceptSelect={handleConceptSelect}
                              handleKeywordClick={handleKeywordClick}
                              selectedConcepts={selectedConcepts}
                              selectedKeywords={selectedKeywords}
                  />
                  )}
                </Segment>
              </div>
            </Grid.Column>
            <Grid.Column width={11} className='section-to-print' id='search-results'>
              <SearchResults searchResults={searchResults}
                             page={searchPage}
                             onKeywordClick={handleKeywordClick}
                             onConceptClick={handleConceptSelect}
                             selectedConcepts={selectedConcepts}
                             selectedKeywords={selectedKeywords}
                             activeTabIndex={activeTabIndex}
                             setActiveTabIndex={setActiveTabIndex}
              />
              <RelatedSearches searchResults={searchResults}
                               contentSearchStrings={contentSearchStrings}
                               setContentSearchStrings={setContentSearchStrings}
                               selectedKeywords={selectedKeywords}
                               setSelectedKeywords={setSelectedKeywords}
                               setSelectedConcepts={setSelectedConcepts}
                               setSearchStatus={setSearchStatus}
                               setSearchOptions={setSearchOptions}
                               setTitleSearchStrings={setTitleSearchStrings}
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
