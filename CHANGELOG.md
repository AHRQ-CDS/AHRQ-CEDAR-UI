# Changelog

## v0.7.1 - 2023-02-22

* Fixes issue with related search behavior where search concepts were not correctly cleared
* Fixes styling of CDS footer on mobile browsers

## v0.7.0 - 2023-01-05

* Adds support for displaying related searches that a user can click on
* Styles interface to display nicely on mobile devices
* Displays descriptions of source repositories
* Flags external links with icon and adds a popup
* Updates dependencies

## v0.6.0 - 2022-10-03

* Adds validation for user-supplied dates
* Updates URLs to use relative references
* Updates title and adds a brief description

## v0.5.0 - 2022-07-05

* Supports showing differences in quality of evidence and strength of recommendations when showing artifact changes
* Refactors code to modularize the search controls and improve organization
* Adds a "Select All" button to Status and Publisher filters
* Adds support for deleted (retracted) artifacts
* Adds support for selecting artifact sort order preferences
* Updates styles to reflect AHRQ visual design
* Provides additional visibility into search result order
* Adds search result CSV download capability
* Fixes issue with selected publishers not being preserved in the URL
* Supports more complex searches by allowing users to combine multiple string-based searches
* Expands date filtering functionality to include searching on published-on date
* Adds contribution guide, code of conduct and terms and conditions

## v0.4.0 - 2022-02-17

* Allows users to see the historical changes of an artifact
* Aligns status checkbox behavior with publisher checkbox behavior
* Fixes an issue with lastUpdated query parameter not being saved in searches

## v0.3.1 - 2022-01-06

* Fixes a bug with paths when deployed

## v0.3.0 - 2022-01-04

* Supports search by knowledge-artifact-type
* Prevents the active tab on an artifact card from being reset to keyword when a concept is clicked
* Makes searches sharable via URL
* Adds UMLS MTH as a supported code system
* Consolidates handling of concepts across MeSH tree, Conditions and Artifacts

## v0.2.0 - 2022-11-05

* Fixes code system used for MeSH searches
* Distinguishes concepts assigned by CEDAR from keywords assigned by the source repository
* Improves searches when searching based on FHIR Conditions
* Expands the information shown for repositories and artifacts
* Fixes bug with certain keywords returning no artifacts

## v0.1.0 - 2022-10-14

* Initial version of CEDAR UI
