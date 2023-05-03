import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { BREAKPOINTS } from 'src/constants/styles';
import { NewsletterPartial } from '../NewsletterPartial.tsx';

jest.mock('react-modal');
jest.mock('cookies-next');

jest.mock('@react-hook/window-size', () => {
  return jest.fn(() => {
    return {
      useWindowWidth: BREAKPOINTS.desktop,
    };
  });
});
jest.mock('src/components/modals/Modal', () => {
  const modalModule = jest.requireActual('src/components/modals/Modal');
  return {
    ...modalModule,
    // eslint-disable-next-line react/prop-types
    Modal: ({ children }) => {
      return <div>{children}</div>;
    },
  };
});

jest.mock('src/hooks', () => {
  const hooks = jest.requireActual('src/hooks');
  return {
    ...hooks,
    useNewsletterTracking: () => {
      return {
        trackingKey: 'trackingValue',
      };
    },
  };
});

jest.mock('src/lib/gtag.ts', () => {
  const gtag = jest.requireActual('src/lib/gtag.ts');
  return {
    ...gtag,
    gaEvent: () => {},
  };
});

jest.mock('src/api/index.ts', () => {
  const ActualApi = jest.requireActual('src/api/index.ts');
  return {
    ...ActualApi,
    postNewsletter: () => {
      return Promise.resolve({
        status: 200,
        body: {},
      });
    },
  };
});

describe('Newsletter Partial', () => {
  const setup = () => {
    const utils = render(<NewsletterPartial />);
    const emailInput = screen.queryByTestId('nl-email-input');
    const submitBtn = screen.queryByTestId('nl-submit-btn');
    return {
      emailInput,
      submitBtn,
      ...utils,
    };
  };
  it('should render anyway', () => {
    const { container } = setup();
    expect(container).toBeDefined();
  });
  it('should send the NL if only mail is given', async () => {
    const { emailInput, submitBtn } = setup();
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
    expect(emailInput.value).toBe('test@gmail.com');
    await fireEvent.click(submitBtn);
    // check if email input is reset to empty => the request has been sent
    expect(emailInput.value).toEqual('');
  });
  it('should send error if email is wrong', async () => {
    const { emailInput, submitBtn } = setup();
    fireEvent.change(emailInput, { target: { value: 'test' } });
    expect(emailInput.value).toBe('test');
    await fireEvent.click(submitBtn);
    // check if email input still has same value => the request has not been sent
    expect(emailInput.value).toEqual('test');
    // check if email error message has been displayed
    const errorMsg = screen.queryByTestId('nl-error-msg');
    expect(errorMsg).toBeDefined();
  });
});
