import React from 'react';

const formatParagraph = (text, condense) => {
  if (text) {
    let formattedText = text;
    if (condense) formattedText = text.replace(/\n\n/g, '\n');
    return formattedText.split('\n').reduce((acc, item, key, arr) => {
      if (key < arr.length && key > 0) {
        return [...acc, <br key={key} />, item];
      }
      return [...acc, item];
    }, []);
  }
  return text;
};

const getAmbitionsLinkingSentence = (ambitions) => {
  return (
    <>
      {' '}
      {ambitions[0].prefix === ambitions[1].prefix
        ? 'ou'
        : `${ambitions[1].prefix || ambitions[1].prefix}`}{' '}
    </>
  );
};

export { formatParagraph, getAmbitionsLinkingSentence };
