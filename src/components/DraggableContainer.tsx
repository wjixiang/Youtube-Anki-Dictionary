import React, { useState, useRef, useEffect } from 'react';  
import ReactDOM from 'react-dom';  

interface DraggableContainerProps {  
  children: React.ReactNode;  
}  

const DraggableContainer: React.FC<DraggableContainerProps> = ({ children }) => {  
  const [isDragging, setIsDragging] = useState(false);  
  const [position, setPosition] = useState({ x: 50, y: 50 });  
  const [offset, setOffset] = useState({ x: 0, y: 0 });  
  const containerRef = useRef<HTMLDivElement>(null);  

  const handleMouseDown = (e: React.MouseEvent) => {  
    if (containerRef.current) {  
      const rect = containerRef.current.getBoundingClientRect();  
      setOffset({  
        x: e.clientX - rect.left,  
        y: e.clientY - rect.top  
      });  
      setIsDragging(true);  
    }  
  };  

  const handleMouseMove = (e: MouseEvent) => {  
    if (isDragging) {  
      setPosition({  
        x: e.clientX - offset.x,  
        y: e.clientY - offset.y  
      });  
    }  
  };  

  const handleMouseUp = () => {  
    setIsDragging(false);  
  };  

  useEffect(() => {  
    if (isDragging) {  
      window.addEventListener('mousemove', handleMouseMove);  
      window.addEventListener('mouseup', handleMouseUp);  
    }  

    return () => {  
      window.removeEventListener('mousemove', handleMouseMove);  
      window.removeEventListener('mouseup', handleMouseUp);  
    };  
  }, [isDragging]);  

  return (  
    <div  
      ref={containerRef}  
      style={{  
        position: 'fixed',  
        left: `${position.x}px`,  
        top: `${position.y}px`,  
        zIndex: 9999,  
        // backgroundColor: 'white',  
        // border: '1px solid #ccc',  
        // borderRadius: '8px',  
        padding: '10px',  
        // boxShadow: '0 4px 6px rgba(0,0,0,0.1)',  
        cursor: isDragging ? 'grabbing' : 'grab',  
        userSelect: 'none',  
        // maxWidth: '500px',  
        // maxHeight: '200px',  
        // overflow: 'auto'  
      }}  
      onMouseDown={handleMouseDown}  
    >  
      <div   
        style={{  
          height: '20px',   
          marginBottom: '10px',  
          backgroundColor: '#f0f0f0',  
          borderRadius: '4px'  
        }}  
      >  
        拖动区域  
      </div>  
      {children}  
    </div>  
  );  
};  

export default DraggableContainer