import {AllHTMLAttributes, MutableRefObject, useRef} from 'react';
import {getOffset} from './getOffset';

interface UseDrag1DProps {
  containerRef: MutableRefObject<HTMLElement>,
  reverse?: boolean,
  orientation?: 'horizontal' | 'vertical',
  onHover?: (hovered: boolean) => void,
  onDrag?: (dragging: boolean) => void,
  onPositionChange?: (position: number) => void,
  onIncrement?: () => void,
  onDecrement?: () => void,
  onIncrementToMax?: () => void,
  onDecrementToMin?: () => void,
  onCollapseToggle?: () => void
}

// created for splitview, this should be reusable for things like sliders/dials
// It also handles keyboard events on the target allowing for increment/decrement by a given stepsize as well as minifying/maximizing and toggling between minified and previous size
// It can also take a 'reverse' param to say if we should measure from the right/bottom instead of the top/left
// It can also handle either a vertical or horizontal movement, but not both at the same time

export function useDrag1D({containerRef, reverse, orientation, onHover, onDrag, onPositionChange, onIncrement, onDecrement, onIncrementToMax, onDecrementToMin, onCollapseToggle}: UseDrag1DProps): AllHTMLAttributes<HTMLElement> {
  let getPosition = (e) => orientation === 'horizontal' ? e.clientX : e.clientY;
  let getNextOffset = (e) => {
    let containerOffset = getOffset(containerRef.current, reverse, orientation);
    let mouseOffset = getPosition(e);
    let nextOffset = reverse ? containerOffset - mouseOffset : mouseOffset - containerOffset;
    return nextOffset;
  };
  let dragging = useRef(false);
  let prevPosition = useRef(0);

  let onMouseDragged = (e) => {
    e.preventDefault();
    let nextOffset = getNextOffset(e);
    if (!dragging.current) {
      dragging.current = true;
      if (onDrag) {
        onDrag(true);
      }
      if (onPositionChange) {
        onPositionChange(nextOffset);
      }
    }
    if (prevPosition.current === nextOffset) {
      return;
    }
    prevPosition.current = nextOffset;
    if (onPositionChange) {
      onPositionChange(nextOffset);
    }
  };

  let onMouseUp = (e) => {
    dragging.current = false;
    let nextOffset = getNextOffset(e);
    if (onDrag) {
      onDrag(false);
    }
    if (onPositionChange) {
      onPositionChange(nextOffset);
    }
    window.removeEventListener('mouseup', onMouseUp, false);
    window.removeEventListener('mousemove', onMouseDragged, false);
  };

  let onMouseDown = () => {
    window.addEventListener('mousemove', onMouseDragged, false);
    window.addEventListener('mouseup', onMouseUp, false);
  };

  let onMouseEnter = () => {
    if (onHover) {
      onHover(true);
    }
  };

  let onMouseOut = () => {
    if (onHover) {
      onHover(false);
    }
  };

  let onKeyDown = (e) => {
    e.preventDefault();
    switch (e.key) {
      case 'Left':
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          if (onDecrement && !reverse) {
            onDecrement();
          } else if (onIncrement && reverse) {
            onIncrement();
          }
        }
        break;
      case 'Up':
      case 'ArrowUp':
        if (orientation === 'vertical') {
          if (onDecrement && !reverse) {
            onDecrement();
          } else if (onIncrement && reverse) {
            onIncrement();
          }
        }
        break;
      case 'Right':
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          if (onIncrement && !reverse) {
            onIncrement();
          } else if (onDecrement && reverse) {
            onDecrement();
          }
        }
        break;
      case 'Down':
      case 'ArrowDown':
        if (orientation === 'vertical') {
          if (onIncrement && !reverse) {
            onIncrement();
          } else if (onDecrement && reverse) {
            onDecrement();
          }
        }
        break;
      case 'Home':
        if (onDecrementToMin) {
          onDecrementToMin();
        }
        break;
      case 'End':
        if (onIncrementToMax) {
          onIncrementToMax();
        }
        break;
      case 'Enter':
        if (onCollapseToggle) {
          onCollapseToggle();
        }
        break;
    }
  };

  return {onMouseDown, onMouseEnter, onMouseOut, onKeyDown};
}