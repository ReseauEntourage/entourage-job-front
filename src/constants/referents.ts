import { ADMIN_ZONES, AdminZone } from 'src/constants/departements';

export interface Referent {
  name: string;
  img: string;
  mail: string;
}

export const Referents: {
  [K in AdminZone]: Referent;
} = {
  [ADMIN_ZONES.PARIS]: {
    name: 'Clothilde B.',
    img: `clothilde.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_PARIS as string,
  },
  [ADMIN_ZONES.LYON]: {
    name: 'Alice D.',
    img: `alice.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_LYON as string,
  },
  [ADMIN_ZONES.LILLE]: {
    name: 'Julien D.',
    img: `julien.png`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_LILLE as string,
  },
  [ADMIN_ZONES.RENNES]: {
    name: 'Mathilde G.',
    img: `mathilde.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_RENNES as string,
  },
  [ADMIN_ZONES.LORIENT]: {
    name: 'Mathilde G.',
    img: `mathilde.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_LORIENT as string,
  },
  [ADMIN_ZONES.SUDOUEST]: {
    name: 'Valentine R.',
    img: `valentine.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_HZ as string,
  },
  [ADMIN_ZONES.HZ]: {
    name: 'Valentine R.',
    img: `valentine.jpg`,
    mail: process.env.NEXT_PUBLIC_LOCAL_BRANCH_EMAIL_HZ as string,
  },
} as const;
