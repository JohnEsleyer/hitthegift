'use client'

import React from 'react';

interface Props {
  text: string;
  length: number;
}

const TextElement: React.FC<Props> = ({ text, length }) => {
  const truncatedText = text.length > length ? `${text.substring(0, length)}...` : text;

  return (
    <span>{truncatedText}</span>
  );
};


const MyComponent = () => {
    return (
      <div>
        <TextElement text="Hello World" length={8} /> {/* Output: Hello W... */}
        <TextElement text="Short Text" length={10} /> {/* Output: Short Text */}
      </div>
    );
  };

export default MyComponent;