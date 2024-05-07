// Wrapper component that triggers event when user clicks outside its reference element.

import { useRef, useEffect, RefObject, CSSProperties } from 'react';

export default function ClickOutside({ children, exceptionRef, onClick, className, style }: { children: React.ReactNode, exceptionRef?: RefObject<any>, onClick: () => void, className?: string, style?: CSSProperties }) {
  const wrapperRef = useRef<any>();

  useEffect(() => {
    const handleClickListener = (event: MouseEvent) => {
      let clickedInside;
      if (exceptionRef) {
        clickedInside = (wrapperRef && wrapperRef.current.contains(event.target)) || exceptionRef.current === event.target || exceptionRef.current && exceptionRef.current.contains(event.target);
      }
      else {
        clickedInside = (wrapperRef && wrapperRef.current.contains(event.target));
      }

      if (clickedInside) return;
      else {
        onClick()
      };
    }

    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  });

  return (
    <div ref={wrapperRef} style={style} className={`${className || ''}`}>
      {children}
    </div>
  );
};
