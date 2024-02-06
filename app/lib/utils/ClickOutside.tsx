// Based on https://medium.com/@shkim04/react-how-to-detect-click-outside-a-component-984fe2e003e8
// & https://dev.to/rashed_iqbal/how-to-handle-outside-clicks-in-react-with-typescript-4lmc 

import { useRef, useEffect, RefObject, CSSProperties } from 'react';

export default function ClickOutside({ children, exceptionRef, onClick, className,style }:{children:React.ReactNode , exceptionRef?:RefObject<any>, onClick: () => void, className?: string,style?:CSSProperties}) {
  const wrapperRef = useRef<any>();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);
    
    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, []);

  const handleClickListener = (event: MouseEvent) => {
    let clickedInside;
    if(exceptionRef) {
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
  
  return (
    <div ref={wrapperRef} style={style} className={`${className || ''}`}>
      {children}
    </div>
  );
};
