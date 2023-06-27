// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configureAxe, toHaveNoViolations } from 'jest-axe';
import server from './mockServiceWorker'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const allowExceptions = true;
const axe = configureAxe({
  runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  rules: {
    // TODO: Fix or find alternative | Semantic-UI-React bug: auto-generated 
    // <Dropdown.Menu> has no aria-label, failing this rule
    "aria-input-field-name": { enabled: !allowExceptions },
    // TODO: Fix or find alternative | Semantic-UI-React seems to be providing
    // role="alert" on dropdowns intentionally to enable screen readers. See:
    // https://github.com/Semantic-Org/Semantic-UI-React/issues/1834
    "aria-required-children": { enabled: !allowExceptions },
  }
})

expect.extend(toHaveNoViolations);
module.exports = axe
