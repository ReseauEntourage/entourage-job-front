import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';

import React from 'react';
import '@testing-library/jest-dom';
import { NewsletterPartial } from '../NewsletterPartial';
import { BREAKPOINTS } from 'src/constants/styles';

jest.mock('react-modal');
jest.mock('cookies-next');
jest.mock('react-redux', () => {
  return {
    useSelector: jest.fn(),
    useDispatch: () => jest.fn(),
  };
});

jest.mock('@react-hook/window-size', () => {
  return {
    useWindowWidth: () => BREAKPOINTS.desktop,
  };
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

jest.mock('src/lib/gtag', () => {
  const gtag = jest.requireActual('src/lib/gtag');
  return {
    ...gtag,
    gaEvent: () => {},
  };
});

jest.mock('src/api/index', () => {
  const ActualApi = jest.requireActual('src/api/index');
  return {
    Api: {
      ...ActualApi.Api,
      postNewsletter: () => {
        return Promise.resolve({
          status: 200,
          body: {},
        });
      },
    },
  };
});

describe('Newsletter Partial', () => {
  let setup = {};

  beforeEach(() => {
    const utils = render(<NewsletterPartial />);
    const emailInput = screen.queryByTestId('nl-email-input');
    const submitBtn = screen.queryByTestId('nl-submit-btn');
    setup = {
      emailInput,
      submitBtn,
      ...utils,
    };
  });

  it('should render anyway', () => {
    const { container } = setup;
    expect(container).toBeDefined();
  });

  it('should send the NL if only mail is given', async () => {
    await waitFor(async () => {
      const { emailInput, submitBtn } = setup;
      fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
      expect(emailInput.value).toBe('test@gmail.com');
      await act(async () => {
        fireEvent.click(submitBtn);
      });
      // check if email input is reset to empty => the request has been sent
      expect(emailInput.value).toEqual('');
    });
  });

  it('should send error if email is wrong', async () => {
    await waitFor(async () => {
      const { emailInput, submitBtn } = setup;
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
});
