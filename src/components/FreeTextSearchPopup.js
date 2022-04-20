import React from 'react';

function FreeTextSearchPopup({ searchType }) {
  if(searchType === "Text" || searchType === "Keywords") {
    return (
      <span>Use AND, OR, NOT and parentheses to combine multiple terms, as in ((hypertension OR hypotension) AND afib). <br />
        Enclose search terms in quotes to search for artifacts with the quoted words close together in their text, such as "patient safety."​</span>
    )
  }
  else {
    return (
    <span>Use commas to search for multiple titles.</span>
    )
  }
}

export default FreeTextSearchPopup;