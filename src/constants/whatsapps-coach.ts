import { ADMIN_ZONES, AdminZone } from 'src/constants/departements';

export interface WhatsappCoach {
  name: string;
  qrcode_url: string;
  url: string;
}

export const WhatsappCoach: {
  [K in AdminZone]: WhatsappCoach;
} = {
  [ADMIN_ZONES.PARIS]: {
    name: 'IDF // Paris, 92, 93',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_PARIS as string,
    url: process.env.WHATSAPP_COACH_URL_PARIS as string,
  },
  [ADMIN_ZONES.LYON]: {
    name: 'Rhône // Lyon',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_LYON as string,
    url: process.env.WHATSAPP_COACH_URL_LYON as string,
  },
  [ADMIN_ZONES.LILLE]: {
    name: 'Nord // Lille',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_LILLE as string,
    url: process.env.WHATSAPP_COACH_URL_LILLE as string,
  },
  [ADMIN_ZONES.RENNES]: {
    name: 'Bretagne // Rennes & Lorient',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_RENNES_ORIENT as string,
    url: process.env.WHATSAPP_COACH_URL_RENNES_ORIENT as string,
  },
  [ADMIN_ZONES.LORIENT]: {
    name: 'Bretagne // Rennes & Lorient',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_RENNES_LORIENT as string,
    url: process.env.WHATSAPP_COACH_URL_RENNES_LORIENT as string,
  },
  [ADMIN_ZONES.HZ]: {
    name: 'Entourage Pro France',
    qrcode_url: process.env.WHATSAPP_COACH_QRCODE_HZ as string,
    url: process.env.WHATSAPP_COACH_URL_HZ as string,
  },
} as const;
