'use client'

import React from 'react';

interface Props {
  text: string;
  length: number;
  fontSize: number;
  color?: string;
}

const LimitText: React.FC<Props> = ({ text, length, fontSize, color }) => {
  const truncatedText = text.length > length ? `${text.substring(0, length)}...` : text;

  return (
    <p className={`${color && color}`} style={{fontSize: fontSize, lineHeight: 1}}>{truncatedText}</p>
  );
};

export default LimitText;