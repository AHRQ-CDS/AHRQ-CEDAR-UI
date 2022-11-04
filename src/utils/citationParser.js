import _ from 'lodash';
import strip from 'strip-markdown';
import { remark } from 'remark';

export default class citationParser {
  static getUrl(resource) {
    return resource?.citedArtifact?.webLocation?.[0]?.url;
  }

  static getTextDescription(description) {
    let textDescription = '';
    remark().use(strip).process(description, (err, file) => textDescription = String(file));
    return textDescription;
  }

  static getStatus(resource) {
    return resource.citedArtifact?.currentState[0].coding[0].code;
  }

  static getKeywordsAndConcepts(resource) {
    // TODO: We may want to handle MeSH keywords separately at some point
    let keywords = [];
    let concepts = [];

    for (const classification of resource.citedArtifact?.classification || []) {
      if(classification.type.coding[0].code === "keyword") {
        for (const classifier of classification.classifier || []) {
          if (classifier.text) {
            const text = classifier.text.toLowerCase();

            classifier.coding !== undefined ? concepts.push({text: text, coding: classifier.coding}) : keywords.push(text);
          }
        }
      }
    }
    // Sort the lists
    // NOTE: When keying by classifier.text, there should not be duplicate concepts, unless UMLS uses the same name for multiple concepts.
    // concepts = _.uniqBy(concepts, 'text');
    return { 'keywords': _.uniq(keywords).sort(), 'concepts': _.orderBy(concepts, ['text'], ['asc']) };
  }

  static getQualifiers(resource) {
    let qualityOfEvidenceStatement = '';
    let qualityOfEvidenceCode = '';
    let strengthOfRecommendationStatement = '';
    let strengthOfRecommendationCode = '';

    for (const extension of resource.citedArtifact?.extension || []) {
      if (extension.url === 'http://cedar.arhq.gov/StructureDefinition/extension-strength-of-recommendation') {
        strengthOfRecommendationStatement = extension.valueCodeableConcept.text;
        strengthOfRecommendationCode = extension.valueCodeableConcept.coding[0].display;
      } else if (extension.url === 'http://cedar.arhq.gov/StructureDefinition/extension-quality-of-evidence') {
        qualityOfEvidenceStatement = extension.valueCodeableConcept.text;
        qualityOfEvidenceCode = extension.valueCodeableConcept.coding[0].display;
      }
    }

    return {
      'qualityOfEvidenceStatement': qualityOfEvidenceStatement,
      'qualityOfEvidenceCode': qualityOfEvidenceCode,
      'strengthOfRecommendationStatement': strengthOfRecommendationStatement,
      'strengthOfRecommendationCode': strengthOfRecommendationCode
    };
  }
}
