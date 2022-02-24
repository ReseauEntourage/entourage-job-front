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

const addSpaceToPrefixIfNeeded = (prefix) => {
  if (!prefix) return '';
  return prefix.includes("'") ? prefix : `${prefix} `;
};

const buildBusinessLineForSentence = ({ label, prefix }) => {
  const separator = 'et ';
  if (Array.isArray(prefix)) {
    let mutatedLabel = '';
    const splittedLabel = label.split(separator);
    for (let i = 1; i < splittedLabel.length; i += 1) {
      mutatedLabel +=
        separator + addSpaceToPrefixIfNeeded(prefix[i]) + splittedLabel[i];
    }
    return (
      addSpaceToPrefixIfNeeded(prefix[0]) + splittedLabel[0] + mutatedLabel
    );
  }
  return addSpaceToPrefixIfNeeded(prefix) + label;
};

export {
  formatParagraph,
  getAmbitionsLinkingSentence,
  buildBusinessLineForSentence,
};
