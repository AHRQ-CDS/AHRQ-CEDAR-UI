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
  static getAsBase64(selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, searchParameter, lastUpdatedSearchString, lastUpdatedPreset) {
    const urlSearchObj = {
      selectedKeywords: selectedKeywords,
      selectedConcepts: selectedConcepts,
      searchString: searchString,
      searchPage: searchPage,
      searchPublisher: searchPublisher,
      searchStatus: searchStatus,
      searchParameter: searchParameter,
      lastUpdatedSearchString: lastUpdatedPreset === 'Custom' ? lastUpdatedSearchString : '',
      lastUpdatedPreset: lastUpdatedPreset
    }

    return compressToBase64(JSON.stringify(urlSearchObj));
  }

  static convertFromBase64(base64SearchString) {
    return JSON.parse(decompressFromBase64(base64SearchString));
  }
}