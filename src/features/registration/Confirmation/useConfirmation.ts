import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registrationActions,
  selectRegistrationData,
} from '@/src/use-cases/registration';

type WebmailProvider = {
  key: string;
  label: string;
  url: string;
  domains: string[];
};

const WEBMAIL_PROVIDERS: WebmailProvider[] = [
  {
    key: 'gmail',
    label: 'Gmail',
    url: 'https://mail.google.com/',
    domains: ['gmail.com', 'googlemail.com', 'entourage.social'],
  },
  {
    key: 'outlook',
    label: 'Outlook',
    url: 'https://outlook.live.com/mail/0/',
    domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'],
  },
  {
    key: 'yahoo',
    label: 'Yahoo Mail',
    url: 'https://mail.yahoo.com/',
    domains: ['yahoo.com', 'yahoo.fr'],
  },
  {
    key: 'icloud',
    label: 'iCloud Mail',
    url: 'https://www.icloud.com/mail/',
    domains: ['icloud.com', 'me.com', 'mac.com'],
  },
  {
    key: 'proton',
    label: 'Proton Mail',
    url: 'https://mail.proton.me/u/0/inbox',
    domains: ['proton.me', 'protonmail.com'],
  },
  {
    key: 'orange',
    label: 'Orange',
    url: 'https://mail.orange.fr/',
    domains: ['orange.fr', 'wanadoo.fr'],
  },
  {
    key: 'sfr',
    label: 'SFR',
    url: 'https://webmail.sfr.fr/',
    domains: ['sfr.fr', 'neuf.fr'],
  },
  {
    key: 'free',
    label: 'Free',
    url: 'https://zimbra.free.fr/',
    domains: ['free.fr'],
  },
  {
    key: 'laposte',
    label: 'LaPoste',
    url: 'https://webmail.laposte.net/',
    domains: ['laposte.net'],
  },
  {
    key: 'gmx',
    label: 'GMX',
    url: 'https://www.gmx.com/',
    domains: ['gmx.com', 'gmx.fr'],
  },
];

function getEmailDomain(email?: string): string | null {
  if (!email) {
    return null;
  }
  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf('@');
  if (atIndex === -1) {
    return null;
  }
  const domain = normalized.slice(atIndex + 1);
  return domain || null;
}

function getWebmailProvider(email?: string): WebmailProvider | null {
  const domain = getEmailDomain(email);
  if (!domain) {
    return null;
  }
  return (
    WEBMAIL_PROVIDERS.find((provider) => provider.domains.includes(domain)) ||
    null
  );
}

export function useConfirmation() {
  const dispatch = useDispatch();
  const registrationData = useSelector(selectRegistrationData);
  const emailFromStore =
    registrationData && typeof registrationData.email === 'string'
      ? registrationData.email
      : undefined;
  const [email] = useState<string | undefined>(emailFromStore);

  const webmailProvider = useMemo(() => getWebmailProvider(email), [email]);

  useEffect(() => {
    dispatch(registrationActions.resetRegistrationData());
  }, [dispatch]);

  return {
    email,
    webmailProvider,
    providers: WEBMAIL_PROVIDERS,
  };
}
