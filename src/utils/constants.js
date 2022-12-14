const CODE_SYSTEMS = {
  "http://www.nlm.nih.gov/research/umls/mth": "UMLS MTH",
  "http://hl7.org/fhir/sid/icd-10-cm": "ICD-10-CM",
  "http://www.nlm.nih.gov/research/umls/medlineplus": "Medline Plus",
  "http://terminology.hl7.org/CodeSystem/MSH": "MeSH",
  "http://www.nlm.nih.gov/research/umls/mshspa": "MeSH (ESP)",
  "http://snomed.info/sct": "SNOMED-CT",
  "http://snomed.info/sct/449081005": "SNOMED-CT (ESP)",
  "http://www.nlm.nih.gov/research/umls/rxnorm": "RxNorm",
};

const STATUS = [
  "Active", "Archived", "Draft", "Unknown", "Retracted"
];

const DATE_PRESETS = {
  "Any time": "",
  "Within 1 month": 1,
  "Within 3 months": 3,
  "Within 6 months": 6,
  "Within 1 year": 12,
  "Custom": "",
};

// API Currently doesn't allow changing sort order
const SORT_BY_OPTIONS = {
  "Relevance": "_score",
  "Status": "artifact-current-state",
  "Publish Date": "article-date",
  "Strength of Recommendation": "strength-of-recommendation",
  "Quality of Evidence": "quality-of-evidence",
};

export { CODE_SYSTEMS, STATUS, DATE_PRESETS, SORT_BY_OPTIONS };
