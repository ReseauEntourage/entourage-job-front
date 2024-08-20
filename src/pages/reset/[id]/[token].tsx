import React from 'react';
import { Api } from 'src/api';
import {
  ResetPassword,
  ResetPasswordProps,
} from 'src/components/reset-password/ResetPassword';

const ResetPasswordPage = ({
  valid,
  id,
  token,
  isCreation = false,
}: ResetPasswordProps) => {
  return (
    <ResetPassword
      valid={valid}
      id={id}
      token={token}
      isCreation={isCreation}
    />
  );
};

ResetPasswordPage.getInitialProps = async ({ query }) => {
  const { id, token, isCreation } = query;
  const valid = await Api.getResetUserToken(id, token)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  return {
    valid,
    id,
    token,
    isCreation,
  };
};

export default ResetPasswordPage;
