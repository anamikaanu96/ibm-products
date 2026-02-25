/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
// Import portions of React that are needed.
import React, {
  FC,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
  RefObject,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { useIsomorphicEffect } from '../../../../global/js/hooks';

// Other standard imports.
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getDevtoolsProps } from '../../../../global/js/utils/devtools';
import { CoachmarkContext, blockClass } from './context';
import { Popover, PopoverContent, NewPopoverAlignment } from '@carbon/react';
import { Header, HeaderProps } from './Header';
import { Content, ContentProps } from './Content';
import { PopoverTriggerWithRef } from './PopoverTriggerWithRef';

// The block part of our conventional BEM class names (blockClass__E--M).

const componentName = 'Coachmark';

// NOTE: the component SCSS is not imported here: it is rolled up separately.

// Default values can be included here and then assigned to the prop params,
// e.g. prop = defaults.prop,
// This gathers default values together neatly and ensures non-primitive
// values are initialized early to avoid react making unnecessary re-renders.
// Note that default values are not required for props that are 'required',
// nor for props where the component can apply undefined values reasonably.
// Default values should be provided when the component needs to make a choice
// or assumption when a prop is not supplied.

export interface CoachmarkPropsNext {
  /**
   * The trigger element or ref to an existing element.
   * - ReactElement: Coachmark will render and manage the trigger
   * - RefObject: Coachmark will attach to an existing element in the DOM
   */
  trigger: ReactElement | RefObject<HTMLElement>;
  /**
   * Provide the contents of the Coachmark (typically Coachmark.Content).
   */
  children: ReactNode;
  /**
   * Provide an optional class to be applied to the containing node.
   */
  className?: string;
  /**
   * Specifies whether the component is currently open.
   */
  open?: boolean;
  /**
   * Function to call when the close button is clicked.
   */
  onClose?: () => void;
  /**
   * Where to render the Coachmark relative to its target.
   */
  align?: NewPopoverAlignment;
  /**
   * Fine tune the position of the target in pixels. Applies only to Beacons.
   */
  position?: { x: number; y: number };
  /**
   * Specifies whether the component is floating or not.
   */
  floating?: boolean;
}

// Define the type for Coachmark, extending it to include Trigger and Content
export type CoachmarkComponent = ForwardRefExoticComponent<
  CoachmarkPropsNext & RefAttributes<HTMLDivElement>
> & {
  Header: FC<HeaderProps>;
  Content: FC<ContentProps>;
};

/**
 * Coachmarks are used to call out specific functionality or concepts
 * within the UI that may not be intuitive but are important for the
 * user to gain understanding of the product's main value and discover new use cases.
 */
export const Coachmark = forwardRef<HTMLDivElement, CoachmarkPropsNext>(
  (props, ref) => {
    const {
      trigger,
      children,
      className,
      onClose,
      align = 'bottom',
      open = false,
      position = { x: 0, y: 0 },
      floating = false,
      ...rest
    } = props;

    const contentId = useId();
    const labelId = useId();
    const triggerWrapperRef = useRef<HTMLDivElement>(null);

    const [contentRef, setContentRef] = useState<HTMLElement | null>(null);
    const [openState, setOpenState] = useState(false);

    const setOpen = (value: boolean) => {
      if (!value) {
        onClose?.();
      }
      if (open === undefined) {
        setOpenState(value);
      }
    };

    const currentOpen = open ?? openState;

    // Track the last click target to handle external trigger clicks
    const lastClickTargetRef = useRef<EventTarget | null>(null);

    // Determine if trigger is a ref or an element
    const isRefTrigger =
      trigger && typeof trigger === 'object' && 'current' in trigger;
    const triggerRef = isRefTrigger
      ? (trigger as RefObject<HTMLElement>)
      : null;
    const triggerElement = !isRefTrigger ? (trigger as ReactElement) : null;

    // Enhance external trigger with ARIA attributes
    useEffect(() => {
      if (!triggerRef?.current) {
        return;
      }

      const element = triggerRef.current;

      // Store original attributes
      const originalExpanded = element.getAttribute('aria-expanded');
      const originalHaspopup = element.getAttribute('aria-haspopup');
      const originalControls = element.getAttribute('aria-controls');

      // Set ARIA attributes
      element.setAttribute('aria-expanded', String(open));
      element.setAttribute('aria-haspopup', 'dialog');
      if (open) {
        element.setAttribute('aria-controls', contentId);
      }

      // Cleanup: restore original attributes
      return () => {
        if (originalExpanded !== null) {
          element.setAttribute('aria-expanded', originalExpanded);
        } else {
          element.removeAttribute('aria-expanded');
        }
        if (originalHaspopup !== null) {
          element.setAttribute('aria-haspopup', originalHaspopup);
        } else {
          element.removeAttribute('aria-haspopup');
        }
        if (originalControls !== null) {
          element.setAttribute('aria-controls', originalControls);
        } else {
          element.removeAttribute('aria-controls');
        }
      };
    }, [open, contentId, triggerRef]);

    // Focus management - return focus to trigger when closed
    useEffect(() => {
      if (!open && triggerRef?.current) {
        triggerRef.current.focus();
      }
    }, [open, triggerRef]);

    // Capture click events globally to track what was clicked
    useEffect(() => {
      const handleGlobalClick = (e: MouseEvent) => {
        lastClickTargetRef.current = e.target;
      };

      // Use capture phase to get the click before anyone else
      document.addEventListener('click', handleGlobalClick, true);

      return () => {
        document.removeEventListener('click', handleGlobalClick, true);
      };
    }, []);

    // Apply position offset using useIsomorphicEffect
    useIsomorphicEffect(() => {
      const { x = 0, y = 0 } = position ?? {};

      // For external trigger (ref), apply position to the actual trigger element
      if (triggerRef?.current && (x !== 0 || y !== 0)) {
        triggerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      // For inline trigger element, apply to wrapper
      const el = triggerWrapperRef.current;
      if (el && !triggerRef && (x !== 0 || y !== 0)) {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
    }, [position, open, triggerRef]);

    // Prepare trigger element based on type
    let triggerContent: ReactNode = null;
    let handleRequestClose = onClose;

    if (triggerRef) {
      // Custom onRequestClose for external trigger
      handleRequestClose = () => {
        const trigger = triggerRef.current;
        const clickTarget = lastClickTargetRef.current;

        if (trigger && clickTarget && trigger.contains(clickTarget as Node)) {
          return; // Click was on trigger, don't close
        }

        onClose?.();
      };

      triggerContent = (
        <PopoverTriggerWithRef
          ref={triggerWrapperRef}
          targetRef={triggerRef}
          open={open}
        />
      );
    } else if (triggerElement) {
      // Enhanced props with ARIA attributes
      const enhancedProps = {
        'aria-expanded': open,
        'aria-haspopup': 'dialog' as const,
        'aria-controls': open ? contentId : undefined,
      };

      triggerContent = (
        <div ref={triggerWrapperRef}>
          {React.cloneElement(triggerElement, enhancedProps)}
        </div>
      );
    }

    if (!triggerContent) {
      return null;
    }

    return (
      <CoachmarkContext.Provider
        value={{
          open: currentOpen,
          onClose,
          floating,
          contentId,
          labelId,
          setOpen,
          contentRef,
          setContentRef,
        }}
      >
        <Popover
          ref={ref}
          open={open}
          onRequestClose={handleRequestClose}
          align={align}
          autoAlign={true}
          caret={!floating}
          highContrast={true}
          dropShadow={true}
          className={cx(blockClass, className, {
            [`${blockClass}--floating`]: floating,
          })}
          {...rest}
          {...getDevtoolsProps(componentName)}
        >
          {triggerContent}

          <PopoverContent
            ref={setContentRef}
            id={contentId}
            role="dialog"
            aria-modal="false"
            aria-labelledby={labelId}
            className={`${blockClass}--coachmark-content`}
          >
            {children}
          </PopoverContent>
        </Popover>
      </CoachmarkContext.Provider>
    );
  }
) as CoachmarkComponent;

Coachmark.Header = Header;
Coachmark.Content = Content;

// The display name of the component, used by React. Note that displayName
// is used in preference to relying on function.name.
Coachmark.displayName = componentName;

// The types and DocGen commentary for the component props,
// in alphabetical order (for consistency).
// See https://www.npmjs.com/package/prop-types#usage.
Coachmark.propTypes = {
  /**
   * Where to render the Coachmark relative to its target.
   */
  align: PropTypes.string,
  /**
   * Provide the contents of the Coachmark.
   */
  children: PropTypes.node.isRequired,
  /**
   * Provide an optional class to be applied to the containing node.
   */
  className: PropTypes.string,
  /**
   * Specifies whether the component is floating or not.
   */
  floating: PropTypes.bool,
  /**
   * Function to call when the close button is clicked.
   */
  onClose: PropTypes.func,
  /**
   * Specifies whether the component is currently open.
   */
  open: PropTypes.bool,
  /**
   * Fine tune the position of the target in pixels. Applies only to Beacons.
   */
  // @ts-ignore
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  /**
   * The trigger element or ref to an existing element.
   */
  trigger: PropTypes.oneOfType([PropTypes.element, PropTypes.object])
    .isRequired,
};
