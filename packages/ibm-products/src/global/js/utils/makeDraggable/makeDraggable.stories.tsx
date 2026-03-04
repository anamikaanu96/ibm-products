/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useRef, useState } from 'react';
import { makeDraggable } from './makeDraggable';
import './_storybook-styles.scss';
import mdx from './makeDraggable.mdx';
import { Button, Popover, PopoverContent } from '@carbon/react';
import { Close, Draggable } from '@carbon/react/icons';

// Note: This story is referenced in Core Carbon. Please ensure that any alterations or removals are reflected in Core Carbon as well.

export default {
  title: 'Utilities/makeDraggable',
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
  tags: ['autodocs'],
};

const DraggableDiv = () => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement && headerRef.current && dragRef.current) {
      // Set initial transform with translate to test cumulative positioning
      dialogElement.style.transform = 'translate(50px, 30px)';

      const draggable = makeDraggable({
        el: dialogElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      const onDragStart = () => {
        if (dialogElement) {
          dialogElement.classList.add('is-dragging');
          dialogElement.setAttribute(
            'aria-label',
            'Picked up the draggable Dialog'
          );
        }
      };

      const onDragEnd = () => {
        if (dialogElement) {
          dialogElement.classList.remove('is-dragging');
          dialogElement.setAttribute(
            'aria-label',
            'draggable Dialog was dropped'
          );
        }
      };

      dialogElement.addEventListener('dragstart', onDragStart);
      dialogElement.addEventListener('dragend', onDragEnd);

      // Clean up attached event listeners
      return () => {
        if (dialogElement) {
          dialogElement.removeEventListener('dragstart', onDragStart);
          dialogElement.removeEventListener('dragend', onDragEnd);
        }
        draggable.cleanup(); // Call the cleanup function from makeDraggable
      };
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogRef.current, headerRef.current, dragRef.current]);

  return (
    <div className="mt-10 flex justify-center">
      <div ref={dialogRef} className="draggable__div">
        <div ref={headerRef} className="draggable__div-header">
          <header ref={headerRef} className={`div-header`}>
            <Button
              kind="ghost"
              ref={dragRef}
              className="drag-icon-div"
              aria-describedby="drag-instructions"
            >
              <Draggable />
            </Button>
            <span id="drag-instructions" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
          </header>
        </div>
        <div className="draggable__div-body">
          <p>This server has 150 GB of block storage remaining.</p>
        </div>
      </div>
    </div>
  );
};

const DraggablePopoverTemplate = () => {
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current && headerRef.current && dragRef.current) {
      const dragContainer = dialogRef.current.querySelector('.cds--popover');
      const dragStyleContainer = dialogRef.current.querySelector(
        '.cds--popover-content'
      );
      if (dragContainer instanceof HTMLElement) {
        dragContainer.style.transform = 'none';
        dragContainer.style.left = '0px';
        dragContainer.style.top = '0px';
        const draggable = makeDraggable({
          el: dragContainer,
          dragHandle: headerRef.current,
          focusableDragHandle: dragRef.current,
        });

        const onDragStart = () => {
          if (dragContainer && dragStyleContainer) {
            dragStyleContainer.classList.add('is-dragging');
            dragStyleContainer.setAttribute(
              'aria-label',
              'Picked up the draggable popover'
            );
          }
        };

        const onDragEnd = () => {
          if (dragContainer && dragStyleContainer) {
            dragStyleContainer.classList.remove('is-dragging');
            dragStyleContainer.setAttribute(
              'aria-label',
              'draggable popover was dropped'
            );
          }
        };

        dragContainer.addEventListener('dragstart', onDragStart);
        dragContainer.addEventListener('dragend', onDragEnd);

        //Clean up attached event listeners
        return () => {
          dragContainer.removeEventListener('dragstart', onDragStart);
          dragContainer.removeEventListener('dragend', onDragEnd);
          draggable.cleanup(); // Call the cleanup function from makeDraggable
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dialogRef.current, dragRef.current]);
  return (
    <div className="mt-10 flex justify-center">
      <Popover open={isOpen} caret={false} ref={dialogRef} className="popover">
        <Button
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Toggle
        </Button>

        <PopoverContent className="popover-content">
          <header ref={headerRef} className={`popover-header popover-title`}>
            <Button
              kind="ghost"
              ref={dragRef}
              className="drag-icon"
              onClick={() => console.log('clicked')}
              aria-describedby="drag-instructions"
            >
              <Draggable />
            </Button>
            <span id="drag-instructions" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
            <Button
              kind="ghost"
              onClick={() => setIsOpen(false)}
              className="close-icon"
            >
              <Close />
            </Button>
          </header>
          <p className="heading"> Available storage</p>
          <p className="popover-details">
            This server has 150 GB of block storage remaining.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const DraggableCustomDiv = DraggableDiv.bind({});

const DraggableWithTransformsTemplate = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const boxElement = boxRef.current;
    if (boxElement && headerRef.current && dragRef.current) {
      // Set initial transform with scale and rotate
      boxElement.style.transform = 'scale(1.2) rotate(5deg)';

      const draggable = makeDraggable({
        el: boxElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      const onDragStart = () => {
        if (boxElement) {
          boxElement.classList.add('is-dragging');
          boxElement.setAttribute(
            'aria-label',
            'Picked up the draggable box with transforms'
          );
        }
      };

      const onDragEnd = () => {
        if (boxElement) {
          boxElement.classList.remove('is-dragging');
          boxElement.setAttribute(
            'aria-label',
            'Draggable box with transforms was dropped'
          );
        }
      };

      boxElement.addEventListener('dragstart', onDragStart);
      boxElement.addEventListener('dragend', onDragEnd);

      return () => {
        boxElement.removeEventListener('dragstart', onDragStart);
        boxElement.removeEventListener('dragend', onDragEnd);
        draggable.cleanup();
      };
    }
  }, []);

  return (
    <div className="mt-10 flex justify-center">
      <div
        ref={boxRef}
        className="draggable-box"
        style={{
          position: 'absolute',
          width: '300px',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          border: '2px solid #0f62fe',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <header
          ref={headerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
          }}
        >
          <Button
            kind="ghost"
            ref={dragRef}
            className="drag-icon"
            aria-describedby="drag-instructions-transforms"
            size="sm"
          >
            <Draggable />
          </Button>
          <span id="drag-instructions-transforms" className="sr-only">
            To pick up the draggable item, press Enter. While dragging, use the
            arrow keys to move the item. Press Enter again to leave the item in
            its new position.
          </span>
          <h3 style={{ margin: 0, fontSize: '16px' }}>
            Draggable with Transforms
          </h3>
        </header>
        <div style={{ padding: '8px' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Initial transforms:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>scale(1.2) - 120% size</li>
            <li>rotate(5deg) - slight rotation</li>
          </ul>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#525252' }}>
            Drag this box around. The scale and rotation should be preserved
            while dragging!
          </p>
        </div>
      </div>
    </div>
  );
};

export const DraggableWithTransforms = DraggableWithTransformsTemplate.bind({});
export const DraggablePopover = DraggablePopoverTemplate.bind({});

// Story to validate class-based transforms are preserved
const ClassBasedTransformsTemplate = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const boxElement = boxRef.current;
    if (boxElement && headerRef.current && dragRef.current) {
      const draggable = makeDraggable({
        el: boxElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      return () => {
        draggable.cleanup();
      };
    }
  }, []);

  return (
    <div className="mt-10 flex justify-center">
      <style>{`
        .scaled-rotated-box {
          transform: scale(1.3) rotate(-10deg);
          transition: box-shadow 0.2s;
        }
        .scaled-rotated-box.is-dragging {
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
      `}</style>
      <div
        ref={boxRef}
        className="draggable-box scaled-rotated-box"
        style={{
          position: 'absolute',
          width: '320px',
          padding: '20px',
          backgroundColor: '#e8daff',
          border: '2px solid #8a3ffc',
          borderRadius: '8px',
        }}
      >
        <header
          ref={headerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            padding: '8px',
            backgroundColor: '#d4bbff',
            borderRadius: '4px',
            cursor: 'move',
          }}
        >
          <Button
            kind="ghost"
            ref={dragRef}
            aria-describedby="drag-instructions-class"
            size="sm"
          >
            <Draggable />
          </Button>
          <span id="drag-instructions-class" className="sr-only">
            To pick up the draggable item, press Enter. While dragging, use the
            arrow keys to move the item. Press Enter again to leave the item in
            its new position.
          </span>
          <h3 style={{ margin: 0, fontSize: '16px', flex: 1 }}>
            Class-Based Transforms
          </h3>
        </header>
        <div style={{ padding: '8px' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>CSS Class transforms:</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>scale(1.3) - from CSS class</li>
            <li>rotate(-10deg) - from CSS class</li>
          </ul>
          <p style={{ marginTop: '12px', fontSize: '14px', color: '#525252' }}>
            ✅ Validates: Class-based transforms are preserved during drag
          </p>
        </div>
      </div>
    </div>
  );
};

// Story to validate external repositioning doesn't cause jumps
const ExternalRepositioningTemplate = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);
  const draggableRef = useRef<{ cleanup: () => void; init: () => void } | null>(
    null
  );
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const boxElement = boxRef.current;
    if (boxElement && headerRef.current && dragRef.current) {
      draggableRef.current = makeDraggable({
        el: boxElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      return () => {
        draggableRef.current?.cleanup();
      };
    }
  }, []);

  const moveToRandomPosition = () => {
    const x = Math.floor(Math.random() * 200) - 100;
    const y = Math.floor(Math.random() * 200) - 100;
    setPosition({ x, y });

    if (boxRef.current) {
      // External repositioning via inline style
      boxRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
    }
  };

  return (
    <div className="mt-10 flex justify-center">
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
          }}
        >
          <Button onClick={moveToRandomPosition} size="sm">
            Move to Random Position
          </Button>
          <p style={{ fontSize: '12px', marginTop: '8px', color: '#525252' }}>
            Current: translate({position.x}px, {position.y}px)
          </p>
        </div>

        <div
          ref={boxRef}
          className="draggable-box"
          style={{
            position: 'absolute',
            width: '300px',
            padding: '20px',
            backgroundColor: '#d0e2ff',
            border: '2px solid #0043ce',
            borderRadius: '8px',
            transform: 'scale(1.1)',
          }}
        >
          <header
            ref={headerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              padding: '8px',
              backgroundColor: '#a6c8ff',
              borderRadius: '4px',
              cursor: 'move',
            }}
          >
            <Button
              kind="ghost"
              ref={dragRef}
              aria-describedby="drag-instructions-reposition"
              size="sm"
            >
              <Draggable />
            </Button>
            <span id="drag-instructions-reposition" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
            <h3 style={{ margin: 0, fontSize: '16px', flex: 1 }}>
              External Repositioning
            </h3>
          </header>
          <div style={{ padding: '8px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              1. Drag the box to a position
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              2. Click Move to Random Position (external repositioning)
            </p>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              3. Try dragging again
            </p>
            <p
              style={{ marginTop: '12px', fontSize: '14px', color: '#525252' }}
            >
              ✅ Validates: No position jump when dragging after external move
              (syncTransformState() is called automatically on drag start)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Story to validate no double translation with matrix transforms
const MatrixTransformTemplate = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<HTMLButtonElement | null>(null);
  const [transformInfo, setTransformInfo] = useState('');

  useEffect(() => {
    const boxElement = boxRef.current;
    if (boxElement && headerRef.current && dragRef.current) {
      // Set initial matrix transform with translation
      boxElement.style.transform = 'matrix(1.2, 0.2, -0.2, 1.2, 50, 30)';

      const updateTransformInfo = () => {
        if (boxElement) {
          const computed = window.getComputedStyle(boxElement);
          setTransformInfo(computed.transform);
        }
      };

      updateTransformInfo();

      const draggable = makeDraggable({
        el: boxElement,
        dragHandle: headerRef.current,
        focusableDragHandle: dragRef.current,
      });

      const onDragEnd = () => {
        updateTransformInfo();
      };

      boxElement.addEventListener('dragend', onDragEnd);

      return () => {
        boxElement.removeEventListener('dragend', onDragEnd);
        draggable.cleanup();
      };
    }
  }, []);

  return (
    <div className="mt-10 flex justify-center">
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 10,
            maxWidth: '300px',
            padding: '12px',
            backgroundColor: '#f4f4f4',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <strong>Current transform:</strong>
          <div style={{ marginTop: '4px', wordBreak: 'break-all' }}>
            {transformInfo}
          </div>
        </div>

        <div
          ref={boxRef}
          className="draggable-box"
          style={{
            position: 'absolute',
            width: '300px',
            padding: '20px',
            backgroundColor: '#ffd6e8',
            border: '2px solid #d12765',
            borderRadius: '8px',
          }}
        >
          <header
            ref={headerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              padding: '8px',
              backgroundColor: '#ffafd2',
              borderRadius: '4px',
              cursor: 'move',
            }}
          >
            <Button
              kind="ghost"
              ref={dragRef}
              aria-describedby="drag-instructions-matrix"
              size="sm"
            >
              <Draggable />
            </Button>
            <span id="drag-instructions-matrix" className="sr-only">
              To pick up the draggable item, press Enter. While dragging, use
              the arrow keys to move the item. Press Enter again to leave the
              item in its new position.
            </span>
            <h3 style={{ margin: 0, fontSize: '16px', flex: 1 }}>
              Matrix Transform
            </h3>
          </header>
          <div style={{ padding: '8px' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Initial matrix:</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
              <li>Scale: 1.2</li>
              <li>Skew: 0.2</li>
              <li>Translate: (50px, 30px)</li>
            </ul>
            <p
              style={{ marginTop: '12px', fontSize: '14px', color: '#525252' }}
            >
              ✅ Validates: Translation is not doubled when dragging (uses
              matrix multiplication)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClassBasedTransforms = ClassBasedTransformsTemplate.bind({});

export const ExternalRepositioning = ExternalRepositioningTemplate.bind({});

export const MatrixTransform = MatrixTransformTemplate.bind({});
