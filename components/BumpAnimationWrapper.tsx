import React, { useState, useCallback, useEffect, useRef } from 'react';

const BumpAnimationWrapper = ({ children, className = '', style = {} }) => {
    const [isBumping, setIsBumping] = useState(false);
    const timeoutRef = useRef(null);
  
    const handleClick = useCallback((e) => {
      e.stopPropagation();
      setIsBumping(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsBumping(false);
      }, 300);
      if (children.props.onClick) {
        children.props.onClick(e);
      }
    }, [children]);
  
    const childWithClick = React.cloneElement(children, {
      onClick: handleClick,
    });
  
    useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes bumpAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @-webkit-keyframes bumpAnimation {
          0% { -webkit-transform: scale(1); }
          50% { -webkit-transform: scale(1.2); }
          100% { -webkit-transform: scale(1); }
        }
        .bump-wrapper {
          display: inline-block;
        }
        .bumping {
          -webkit-animation: bumpAnimation 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
          animation: bumpAnimation 0.3s cubic-bezier(0.17, 0.89, 0.32, 1.49);
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }, []);
  
    return (
      <div
        className={`bump-wrapper ${isBumping ? 'bumping' : ''} ${className}`}
        style={{
          display: 'inline-block',
          ...style,
        }}
      >
        {childWithClick}
      </div>
    );
  };

export default BumpAnimationWrapper;