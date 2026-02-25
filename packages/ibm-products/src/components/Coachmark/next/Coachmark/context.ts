/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, RefObject } from 'react';
import { pkg } from '../../../../settings';

interface CoachmarkContextType {
  onClose?: () => void;
  open?: boolean;
  floating?: boolean;
  contentId?: string;
  labelId?: string;
  setOpen: (value: boolean) => void;
  align?: string;
  triggerRef?: RefObject<HTMLElement>;
  position?: { x: number; y: number };
  contentRef?: HTMLElement | null;
  setContentRef?: (ref: HTMLElement | null) => void;
}

export const CoachmarkContext = createContext<CoachmarkContextType>({
  open: false,
  floating: false,
  contentId: undefined,
  labelId: undefined,
  setOpen: () => {},
});

export const blockClass = `${pkg.prefix}--coachmark__next`;
