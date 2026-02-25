/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState, useRef } from 'react';
import { Coachmark } from '.';
import mdx from './Coachmark.mdx';
import styles from './_storybook-styles.scss?inline';
import { Button, Theme } from '@carbon/react';
import { CoachmarkBeacon } from './CoachmarkBeacon';
import { Crossroads } from '@carbon/react/icons';

export default {
  title: 'Preview/Onboarding/Coachmark',
  component: Coachmark,
  tags: ['autodocs', 'Onboarding'],
  argTypes: {
    children: {
      control: { type: null },
    },
    onClose: {
      control: { type: null },
    },
    align: {
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-bottom',
        'left-top',
        'right',
        'right-bottom',
        'right-top',
      ],
      control: { type: 'select' },
    },
    className: {
      control: { type: null },
    },
  },
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
  },
};

/**
 * TODO: Declare template(s) for one or more scenarios.
 */

//fetching theme
function useCarbonTheme() {
  const [themeValue, setThemeValue] = useState(() =>
    document.documentElement.getAttribute('data-carbon-theme')
  );

  useEffect(() => {
    const target = document.documentElement;

    // function to read the current theme
    const readTheme = () => {
      const newTheme = target.getAttribute('data-carbon-theme');
      setThemeValue((prev) => (prev !== newTheme ? newTheme : prev));
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-carbon-theme'
        ) {
          readTheme();
        }
      }
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ['data-carbon-theme'],
    });

    //fallback - check readTheme in every 200ms
    const interval = setInterval(readTheme, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return themeValue;
}

//Tooltip variant
const TooltipTemplate = ({ ...args }, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const carbonTheme = sbDocs ? useCarbonTheme() : 'white';
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBeaconClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <Theme theme={carbonTheme}>
      <main>
        <Coachmark
          position={{ x: 151, y: 155 }}
          open={isOpen}
          onClose={handleClose}
          trigger={
            <CoachmarkBeacon
              label="Show information"
              buttonProps={{ onClick: handleBeaconClick }}
            />
          }
          {...args}
        >
          <Coachmark.Header closeIconDescription="Close" />
          <Coachmark.Content>
            <h2>Hello World</h2>
            <p>this is a description test</p>
            <Button size="sm">Done</Button>
          </Coachmark.Content>
        </Coachmark>
      </main>
    </Theme>
  );
};

//Floating variant
const FloatingTemplate = ({ ...args }, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const carbonTheme = sbDocs ? useCarbonTheme() : 'white';
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  return (
    <Theme theme={carbonTheme}>
      <main>
        <Coachmark
          open={isOpen}
          onClose={handleClose}
          floating={true}
          position={{ x: 151, y: 155 }}
          trigger={
            <Button
              kind="tertiary"
              size="md"
              label="Show information"
              renderIcon={Crossroads}
              onClick={handleButtonClick}
            >
              Show information
            </Button>
          }
          {...args}
        >
          <Coachmark.Header
            closeIconDescription="Close"
            dragIconDescription="Drag"
          />
          <Coachmark.Content>
            <h2>Hello World</h2>
            <p>this is a description test</p>
            <Button size="sm">Done</Button>
          </Coachmark.Content>
        </Coachmark>
      </main>
    </Theme>
  );
};

// External trigger using ref
const ExternalTriggerTemplate = ({ ...args }, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const carbonTheme = sbDocs ? useCarbonTheme() : 'white';
  const [isOpen, setIsOpen] = useState(true);
  const buttonRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <Theme theme={carbonTheme}>
      <Button
        kind="tertiary"
        size="md"
        label="Show information"
        renderIcon={Crossroads}
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        Show information
      </Button>

      <Coachmark
        open={isOpen}
        onClose={handleClose}
        trigger={buttonRef}
        position={{ x: 151, y: 155 }}
        {...args}
      >
        <Coachmark.Header closeIconDescription="Close" />
        <Coachmark.Content>
          <h2>Hello World</h2>
          <p>this is a description test</p>
          <Button size="sm">Done</Button>
        </Coachmark.Content>
      </Coachmark>
    </Theme>
  );
};

/**
 * TODO: Declare one or more stories, generally one per design scenario.
 * NB no need for a 'Playground' because all stories have all controls anyway.
 */
export const Tooltip = TooltipTemplate.bind({});
Tooltip.args = {
  align: 'top',
};

export const Floating = FloatingTemplate.bind({});

export const ExternalTrigger = ExternalTriggerTemplate.bind({});
ExternalTrigger.args = {
  align: 'top',
};
Floating.args = {
  align: 'bottom',
};
