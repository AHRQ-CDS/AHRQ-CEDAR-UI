import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react'
import exit_icon from '../assets/img/exit_disclaimer_blue.png';

function ExternalLinkModal({link, open, setOpen}) {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>Exit Notification and Disclaimer</Modal.Header>
      <Modal.Content>
        <p>Notice to users upon leaving this Federal Government Web site and entering a non-Federal Web site:</p>
        <ul>
          <li>This notice means that you are leaving this Federal Government Web site and entering a non-Federal Web site.</li>
          <li>This external link provides additional information that is consistent with the intended purpose of a Federal site.</li>
          <li>Linking to a non-Federal site does not constitute an endorsement by the Department of Health and Human Services (HHS) or any of its employees of the sponsors or the information and products presented on the site.</li>
          <li>HHS cannot attest to the accuracy of information provided by this link.</li>
          <li>You will be subject to the destination site's privacy policy when you follow the link.</li>
        </ul>
      </Modal.Content>
      <Modal.Actions>
        <Button content='Cancel' onClick={() => setOpen(false)}/>
        <Button
          content='Continue'
          color='blue'
          onClick={ () => window.location.href = link }
        />
      </Modal.Actions>
    </Modal>
  )
}

function LinkWrapper({href, children, ...rest}) {
  const [open, setOpen] = useState(false)

  // include window.location as base url in order to handle relative urls like '../'
  const hostname = new URL(href, window.location).hostname

  const handleClick = (e) => {
    e.preventDefault()
    setOpen(true)
  }

  // Show link+icon if link leads away from federal site (not current site or .gov or .mil)
  if (hostname !== window.location.hostname && !hostname.match(/\.gov$|\.mil$/)) {
    return (
      <>
        <a className="externalLink" href={href} {...rest} onClick={handleClick}>
          {children ?? href}
        </a>
        <span> </span>  {/* Include space between external link & icon */}
        <img className="leavingSiteImage" alt="external link icon" src={exit_icon} />
        <ExternalLinkModal link={href} open={open} setOpen={setOpen}/>
      </>
    )
  }
  // otherwise show regular link
  else {
    return (
      <a href={href} {...rest}>{children ?? href}</a>
    );
  }
}

export default LinkWrapper;
