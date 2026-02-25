/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { forwardRef, RefObject, useRef } from 'react';
import { useIsomorphicEffect } from '../../../../global/js/hooks';
import { useMergedRefs } from '../../../../global/js/hooks/useMergedRefs';
import { autoUpdate } from '@floating-ui/react';
interface PopoverTriggerWithRefProps {
  /**
   * Reference to the target element to sync position with
   */
  targetRef: RefObject<HTMLElement>;
  /**
   * Whether the coachmark is open
   */
  open: boolean;
}
/**
 * PopoverTriggerWithRef is an invisible element that syncs its position
 * with an external trigger element. This allows Popover to position correctly
 * relative to a trigger that exists outside the Popover component tree.
 *
 * The proxy is properly hidden from assistive technology using multiple techniques:
 * - aria-hidden="true"
 * - tabIndex={-1}
 * - CSS clip techniques
 * - opacity: 0
 * - pointerEvents: none
 */
export const PopoverTriggerWithRef = forwardRef<
  HTMLSpanElement,
  PopoverTriggerWithRefProps
>(({ targetRef, open }, popoverRef) => {
  const proxyRef = useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRefs([popoverRef, proxyRef]);
  useIsomorphicEffect(() => {
    if (!targetRef.current || !proxyRef.current || !open) {
      return;
    }
    const target = targetRef.current;
    const proxy = proxyRef.current;
    const syncPosition = () => {
      const rect = target.getBoundingClientRect();
      Object.assign(proxy.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      });
    };
    // Initial sync
    syncPosition();
    // Keep synced on scroll/resize
    const cleanup = autoUpdate(target, proxy, syncPosition);
    return cleanup;
  }, [targetRef, open]);
  return (
    <span
      ref={mergedRef}
      // Properly hidden from accessibility tree
      aria-hidden="true"
      // Not in tab order
      tabIndex={-1}
      // Ignore all pointer events
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        opacity: 0,
        // Additional hiding techniques for screen readers
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    />
  );
});
PopoverTriggerWithRef.displayName = 'PopoverTriggerWithRef';
