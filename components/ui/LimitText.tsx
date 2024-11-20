'use client'

import React from 'react';

interface Props {
  text: string;
  length: number;
  fontSize: number;
}

const LimitText: React.FC<Props> = ({ text, length, fontSize }) => {
  const truncatedText = text.length > length ? `${text.substring(0, length)}...` : text;

  return (
    <p style={{fontSize: fontSize, lineHeight: 1}}>{truncatedText}</p>
  );
};

export default LimitText;