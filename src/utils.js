import {compressToBase64, decompressFromBase64} from 'lz-string';

export const conceptIsSelected = (conceptToTest, selectedConcepts) => {
  const conceptCodesToTest = conceptToTest.coding.map(code => `${code.code}|${code?.system}`);
  const selectedConceptCodes = selectedConcepts.map(condition => condition.coding.map(code => `${code.code}|${code?.system}`));

  for(const concept of selectedConceptCodes) {
    if(conceptCodesToTest.every(c=> concept.includes(c))) {
      return true;
    } 
  }

  return false;
}

export default class urlSearchObject {
  constructor(selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, searchParameter, lastUpdatedSearchString, lastUpdatedPreset) {
    this.selectedKeywords = selectedKeywords;
    this.selectedConcepts = selectedConcepts;
    this.searchString = searchString;
    this.searchPage = searchPage;
    this.searchPublisher = searchPublisher;
    this.searchStatus = searchStatus;
    this.searchParameter = searchParameter;
    this.lastUpdatedSearchString = lastUpdatedSearchString;
    this.lastUpdatedPreset = lastUpdatedPreset;
  }

  getAsBase64() {
    const urlSearchObj = {
      selectedKeywords: this.selectedKeywords,
      selectedConcepts: this.selectedConcepts,
      searchString: this.searchString,
      searchPage: this.searchPage,
      searchPublisher: this.searchPublisher,
      searchStatus: this.searchStatus,
      searchParameter: this.searchParameter,
      lastUpdatedSearchString: this.lastUpdatedPreset === 'Custom' ? this.lastUpdatedSearchString : '',
      lastUpdatedPreset: this.lastUpdatedPreset
    }

    return compressToBase64(JSON.stringify(urlSearchObj));
  }

  static convertFromBase64(base64SearchString) {
    return JSON.parse(decompressFromBase64(base64SearchString));
  }
}