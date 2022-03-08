import { compressToBase64, decompressFromBase64 } from 'lz-string';

const conceptIsSelected = (conceptToTest, selectedConcepts) => {
  const conceptCodesToTest = conceptToTest.coding.map(code => `${code.code}|${code?.system}`);
  const selectedConceptCodes = selectedConcepts.map(condition => condition.coding.map(code => `${code.code}|${code?.system}`));

  for(const concept of selectedConceptCodes) {
    if(conceptCodesToTest.every(c=> concept.includes(c))) {
      return true;
    } 
  }

  return false;
}

class urlSearchObject {
  static getAsBase64(selectedKeywords, selectedConcepts, searchString, searchPage, searchPublisher, searchStatus, searchParameter, lastUpdatedSearchString, 
    lastUpdatedPreset, selectedArtifactTypes) {
    const urlSearchObj = {
      selectedKeywords: selectedKeywords,
      selectedConcepts: selectedConcepts,
      searchString: searchString,
      searchPage: searchPage,
      searchPublisher: searchPublisher,
      searchStatus: searchStatus,
      searchParameter: searchParameter,
      lastUpdatedSearchString: lastUpdatedPreset === 'Custom' ? lastUpdatedSearchString : '',
      lastUpdatedPreset: lastUpdatedPreset,
      selectedArtifactTypes: selectedArtifactTypes
    }

    return compressToBase64(JSON.stringify(urlSearchObj));
  }

  static convertFromBase64(base64SearchString) {
    return JSON.parse(decompressFromBase64(base64SearchString));
  }
}

const getXMonthsAgo = (numMonths) => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth() - numMonths,
    new Date().getDate()).toLocaleDateString('en-CA')
}

const dateStringFromPreset = (numMonths) => {
  const dateString = getXMonthsAgo(numMonths);
  return `ge${dateString}`;
}

export { conceptIsSelected, urlSearchObject, dateStringFromPreset };