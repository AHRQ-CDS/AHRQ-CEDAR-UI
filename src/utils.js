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
