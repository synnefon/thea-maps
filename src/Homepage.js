import React from 'react';

import './styles/app.css'

export default function Homepage() {
  const documentURL = 'https://docs.google.com/document/d/1xJC15JRQHmeHfMbCyaEQptm9MpUMLaWVgfWULru4Gro';
  return (
    <iframe 
      className='thea-campaign-doc'
      title="thea campaign homepage"
      src={documentURL}
    />
  );
};
