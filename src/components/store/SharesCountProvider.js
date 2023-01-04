// store/SharesCount.js
import React, { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Api from 'src/api/index.ts';
import { VALUES } from 'src/constants';
import { useMount } from 'src/hooks/utils';

export const SharesCountContext = createContext({ totalShares: 0 });

const SharesCountProvider = ({ children }) => {
  const [totalShares, setTotalShares] = useState(0);

  const incrementSharesCount = useCallback(() => {
    setTotalShares((prevTotalShares) => {
      return prevTotalShares + 1;
    });
  }, []);

  useMount(() => {
    Api.getCVShares()
      .then(({ data }) => {
        setTotalShares(data.total);
      })
      .catch((e) => {
        console.error(e);
        setTotalShares(VALUES.SHARES);
      });
  });

  return (
    <SharesCountContext.Provider value={{ totalShares, incrementSharesCount }}>
      {children}
    </SharesCountContext.Provider>
  );
};

SharesCountProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
export default SharesCountProvider;
