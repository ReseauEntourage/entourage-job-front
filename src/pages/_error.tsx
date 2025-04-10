import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import React from 'react';

const CustomError = ({
  statusCode,
}: // hasGetInitialPropsRun,
// err
{
  statusCode: number;
}) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

CustomError.getInitialProps = async (props: NextPageContext) => {
  const {
    res,
    err,
    // asPath
  } = props;

  /**
   *
   * Now using standard error handling
   * (see: https://nextjs.org/docs/pages/building-your-application/routing/custom-error)
   *
   */
  if (res) {
    return { statusCode: res.statusCode };
  }
  return { statusCod: err ? err.statusCode : 404 };
};

export default CustomError;
