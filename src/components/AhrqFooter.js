import React from 'react';

import '../assets/css/Ahrq.css'

import LinkWrapper from './LinkWrapper';
import cds_connect_logo from '../assets/img/cdsconnect-circle-logo.png';
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
                        <LinkWrapper href="https://cds.ahrq.gov">CDS Home</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/cdsconnect">CDS Connect</LinkWrapper>
                      </div>
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov/evaluation">Evaluation</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/resources">Resources</LinkWrapper>
                      </div>
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov/disclaimer">Disclaimer for CDS Connect</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/overview">Overview</LinkWrapper>
                      </div>
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov">Learning Network</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/funding-opportunities">Funding Opportunities</LinkWrapper>
                      </div>
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov/contact-us">Contact Us</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/privacy">Privacy Statement</LinkWrapper>
                      </div>
                    </div>
                    <div className="footer-mobile">
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov">CDS Home</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/cdsconnect">CDS Connect</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/evaluation">Evaluation</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/resources">Resources</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/disclaimer">Disclaimer for CDS Connect</LinkWrapper>
                      </div>
                      <div>
                        <LinkWrapper href="https://cds.ahrq.gov/overview">Overview</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov">Learning Network</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/funding-opportunities">Funding Opportunities</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/contact-us">Contact Us</LinkWrapper>
                        <LinkWrapper href="https://cds.ahrq.gov/privacy">Privacy Statement</LinkWrapper>
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
          <div id="footer1">
            <div className="row">
              <div className="col-md-12 side-row-margins">
                <div className="f1-div-width div-float init-pad">
                  <h3>Connect With Us</h3>
                  <LinkWrapper href="http://www.facebook.com/ahrq.gov" target="_blank" rel="noreferrer"><img src={facebook_icon} height="35" alt="Facebook" /></LinkWrapper>
                  <LinkWrapper href="https://twitter.com/ahrqnews" target="_blank" rel="noreferrer"><img src={twitter_icon} className="img-spacing" height="35" alt="Twitter" /></LinkWrapper>
                  <LinkWrapper href="http://www.youtube.com/user/AHRQHealthTV" target="_blank" rel="noreferrer"><img src={youtube_icon} className="img-spacing" height="35" alt="You Tube" /></LinkWrapper>
                  <LinkWrapper href="http://www.linkedin.com/company/agency-for-healthcare-research-and-quality" target="_blank" rel="noreferrer"><img src={linkedin_icon} className="img-spacing" height="35" alt="LinkedIn" /></LinkWrapper>
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
                      <LinkWrapper href="https://www.ahrq.gov/cpi/about/careers/index.html" target="_blank" rel="noreferrer">Careers</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/contact/index.html" target="_blank" rel="noreferrer">Contact Us</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/topics/informacion-en-espanol/index.html" target="_blank" rel="noreferrer">Español</LinkWrapper>
                    </li>
                    <li className="last">
                      <LinkWrapper href="https://info.ahrq.gov/" target="_blank" rel="noreferrer">FAQs</LinkWrapper>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul className="clearfix">
                    <li className="first">
                      <LinkWrapper href="https://www.ahrq.gov/policy/electronic/accessibility/index.html" target="_blank" rel="noreferrer">Accessibility</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/policy/electronic/disclaimers/index.html" target="_blank" rel="noreferrer">Disclaimers</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/policy/eeo/index.html" target="_blank" rel="noreferrer">EEO</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/policy/electronic/about/policyix.html" target="_blank" rel="noreferrer">Electronic Policies</LinkWrapper>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul>
                    <li><LinkWrapper href="https://www.ahrq.gov/policy/foia/index.html" target="_blank" rel="noreferrer">FOIA</LinkWrapper></li>
                    <li><LinkWrapper href="http://www.hhs.gov/web/governance/strategy.html" target="_blank" rel="noreferrer">HHS Digital Strategy</LinkWrapper></li>
                    <li><LinkWrapper href="https://www.hhs.gov/civil-rights/for-individuals/nondiscrimination/index.html" target="_blank" rel="noreferrer">HHS Nondiscrimination Notice</LinkWrapper></li>
                    <li><LinkWrapper href="https://oig.hhs.gov/" target="_blank" rel="noreferrer">Inspector General</LinkWrapper></li>
                  </ul>
                </div>
                <div className="left-div div-width-partial">
                  <ul>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/policy/electronic/plain-writing/index.html" target="_blank" rel="noreferrer">Plain Writing Act</LinkWrapper>
                    </li>
                    <li>
                      <LinkWrapper href="https://www.ahrq.gov/policy/electronic/privacy/index.html" target="_blank" rel="noreferrer">Privacy Policy</LinkWrapper>
                    </li>
                    <li className="last">
                      <LinkWrapper href="http://www.hhs.gov/plugins.html" target="_blank" rel="noreferrer">Viewers &amp; Players</LinkWrapper>
                    </li>
                  </ul>
                </div>
                <div className="left-div div-width-full footer-border">
                  <ul>
                    <li><LinkWrapper href="http://www.hhs.gov/" target="_blank" rel="noreferrer">U.S. Department of Health &amp; Human Services</LinkWrapper></li>
                    <li><LinkWrapper href="http://www.whitehouse.gov/" target="_blank" rel="noreferrer">The White House</LinkWrapper></li>
                    <li><LinkWrapper href="http://www.usa.gov/" target="_blank" rel="noreferrer">USA.gov</LinkWrapper></li>
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