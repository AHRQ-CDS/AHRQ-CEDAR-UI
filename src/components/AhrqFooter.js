import React from 'react';

import '../assets/css/Ahrq.css'

import cds_connect_logo from '../assets/img/cdsconnect-circle-logo.png';
import chevron_circle_up from '../assets/img/chevron-circle-up-solid.png';
import facebook_icon from '../assets/img/facebook-f-brands.png';
import linkedin_icon from '../assets/img/linkedin-in-brands.png';
import twitter_icon from '../assets/img/twitter-brands.png';
import youtube_icon from '../assets/img/youtube-brands.png';

export default function AhrqFooter() {
  return (
    <>
      <section> 
        <footer className="footer cds-footer">
          <div className="region region-footer">
            <section id="block-sitefooterblock" className="block block-footer block-site-footer-block clearfix">
              <footer className="cds-footer">
                <div className="cds-footer__container">
                  <div className="cds-footer__column">
                    <div className="cds-footer__header">
                      <img src={cds_connect_logo} height="35" alt="CDS Connect" /> Clinical Decision Support (CDS)
                    </div>
                    <div className="footer-wide">
                      <div>
                        <a href="https://cds.ahrq.gov">CDS Home</a>
                        <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect</a>
                      </div>
                      <div>
                        <a href="https://cds.ahrq.gov/evaluation">Evaluation</a>
                        <a href="https://cds.ahrq.gov/resources">Resources</a>
                      </div>
                      <div>
                        <a href="https://cds.ahrq.gov/disclaimer">Disclaimer for CDS Connect</a>
                        <a href="https://cds.ahrq.gov/overview">Overview</a>
                      </div>
                      <div>
                        <a href="https://cds.ahrq.gov">Learning Network</a>
                        <a href="https://cds.ahrq.gov/funding-opportunities">Funding Opportunities</a>
                      </div>
                      <div>
                        <a href="https://cds.ahrq.gov/contact-us">Contact Us</a>
                        <a href="https://cds.ahrq.gov/privacy">Privacy Statement</a>
                      </div>
                    </div>
                    <div className="footer-mobile">
                      <div>
                        <a href="https://cds.ahrq.gov">CDS Home</a>
                        <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect</a>
                        <a href="https://cds.ahrq.gov/evaluation">Evaluation</a>
                        <a href="https://cds.ahrq.gov/resources">Resources</a>
                        <a href="https://cds.ahrq.gov/disclaimer">Disclaimer for CDS Connect</a>
                      </div>
                      <div>
                        <a href="https://cds.ahrq.gov/overview">Overview</a>
                        <a href="https://cds.ahrq.gov">Learning Network</a>
                        <a href="https://cds.ahrq.gov/funding-opportunities">Funding Opportunities</a>
                        <a href="https://cds.ahrq.gov/contact-us">Contact Us</a>
                        <a href="https://cds.ahrq.gov/privacy">Privacy Statement</a>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </section>
          </div>
        </footer>
      </section>
      <div className="ahrq">
        <footer className="site-footer" role="contentinfo">       
          <div className="row row-side-margins hide-on-desktop">
            <div className="col-sm-12" id="top-button-container">
              <button id="top-button">Back to Top</button>
                <img alt="Go back to top" height="25" src={chevron_circle_up} width="25" />
            </div>
          </div>
          <div id="footer1">
            <div className="row">
              <div className="col-md-12 side-row-margins">
                <div className="f1-div-width div-float init-pad">
                  <h3>Connect With Us</h3>
                  <a href="http://www.facebook.com/ahrq.gov" target="_blank" rel="noreferrer"><img src={facebook_icon} height="35" alt="Facebook" /></a>
                  <a href="https://twitter.com/ahrqnews" target="_blank" rel="noreferrer"><img src={twitter_icon} className="img-spacing" height="35" alt="Twitter" /></a>
                  <a href="http://www.youtube.com/user/AHRQHealthTV" target="_blank" rel="noreferrer"><img src={youtube_icon} className="img-spacing" height="35" alt="You Tube" /></a>
                  <a href="http://www.linkedin.com/company/agency-for-healthcare-research-and-quality" target="_blank" rel="noreferrer"><img src={linkedin_icon} className="img-spacing" height="35" alt="LinkedIn" /></a>
                </div>
                <div className="f1-div-width div-float">
                  <h3 className="header-mobile-top-spacing">Sign up for Email Updates</h3>
                  <p className="primary-small email">
                    To sign up for updates or to access your subscriber preferences, please enter your email address below.
                  </p>
                  <form id="GD-snippet-form" action="https://subscriptions.ahrq.gov/accounts/USAHRQ/subscribers/qualify" acceptCharset="UTF-8" method="post">
                    <input name="utf8" type="hidden" value="✓" />
                    <input type="hidden" name="authenticity_token" value="y9/sIPG+wf/QL20R4sTfazeOp4MyAOwD9ZszmZKWH0PZjGUt2JIEhyyE6dPCNgLP+WZWUcH1NjJVivzbrc8wmg==" />
                    <div role="search">
                      <label className="usa-sr-only" htmlFor="email">Search</label>
                      <input className="usa-input email-input" id="email" type="text" name="email" />
                      <input className="usa-button email-update-button" type="submit" name="commit" value="Sign Up" />
                    </div>
                  </form>
                </div>
                <div className="f1-div-width div-float">
                  <address>
                    <h3 className="header-mobile-top-spacing">Agency for Healthcare Research and Quality</h3>
                    <p className="primary-regular">5600 Fishers Lane<br />
                      Rockville, MD 20857<br />
                      Telephone: (301) 427-1364</p>
                  </address>
                </div>
              </div>
            </div>
          </div>
          <div id="footer2">
            <div className="row">
              <div className="col-md-12 side-row-margins init-pad">
                <div className="left-div div-width-partial left-margin">
                  <ul className="clearfix">
                    <li className="first">
                      <a href="https://www.ahrq.gov/cpi/about/careers/index.html" target="_blank" rel="noreferrer">Careers</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/contact/index.html" target="_blank" rel="noreferrer">Contact Us</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/topics/informacion-en-espanol/index.html" target="_blank" rel="noreferrer">Español</a>
                    </li>
                    <li className="last">
                      <a href="https://info.ahrq.gov/" target="_blank" rel="noreferrer">FAQs</a>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul className="clearfix">
                    <li className="first">
                      <a href="https://www.ahrq.gov/policy/electronic/accessibility/index.html" target="_blank" rel="noreferrer">Accessibility</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/policy/electronic/disclaimers/index.html" target="_blank" rel="noreferrer">Disclaimers</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/policy/eeo/index.html" target="_blank" rel="noreferrer">EEO</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/policy/electronic/about/policyix.html" target="_blank" rel="noreferrer">Electronic Policies</a>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul>
                    <li><a href="https://www.ahrq.gov/policy/foia/index.html" target="_blank" rel="noreferrer">FOIA</a></li>
                    <li><a href="http://www.hhs.gov/web/governance/strategy.html" target="_blank" rel="noreferrer">HHS Digital Strategy</a></li>
                    <li><a href="https://www.hhs.gov/civil-rights/for-individuals/nondiscrimination/index.html" target="_blank" rel="noreferrer">HHS Nondiscrimination Notice</a></li>
                    <li><a href="https://oig.hhs.gov/" target="_blank" rel="noreferrer">Inspector General</a></li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul>
                    <li>
                      <a href="https://www.ahrq.gov/policy/electronic/plain-writing/index.html" target="_blank" rel="noreferrer">Plain Writing Act</a>
                    </li>
                    <li>
                      <a href="https://www.ahrq.gov/policy/electronic/privacy/index.html" target="_blank" rel="noreferrer">Privacy Policy</a>
                    </li>
                    <li className="last">
                      <a href="http://www.hhs.gov/plugins.html" target="_blank" rel="noreferrer">Viewers &amp; Players</a>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-full footer-border">
                  <ul>
                    <li><a href="http://www.hhs.gov/" target="_blank" rel="noreferrer">U.S. Department of Health &amp; Human Services</a></li>
                    <li><a href="http://www.whitehouse.gov/" target="_blank" rel="noreferrer">The White House</a></li>
                    <li><a href="http://www.usa.gov/" target="_blank" rel="noreferrer">USA.gov</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}