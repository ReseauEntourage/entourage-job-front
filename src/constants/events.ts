import { FilterConstant } from './utils';

export enum EventMode {
  IN_PERSON = 'irl',
  ONLINE = 'online',
}

export const EVENT_MODES = [
  {
    name: 'En personne',
    format: EventMode.IN_PERSON,
  },
  {
    name: 'En ligne',
    format: EventMode.ONLINE,
  },
];

export enum EventType {
  UNKNOWN = 'UNKNOWN',
  WELCOME_SESSION = 'WELCOME_SESSION',
  COFFEE_SESSION = 'COFFEE_SESSION',
  NETWORKING = 'NETWORKING',
  SPEED_MEETING = 'SPEED_MEETING',
  PAPOTAGES_PRO = 'PAPOTAGES_PRO',
  PHOTO_SHOOTING = 'PHOTO_SHOOTING',
  APERO_COACH = 'APERO_COACH',
  WORKSHOP = 'WORKSHOP',
}

export const EVENT_TYPES = [
  {
    name: 'Rendez-vous de bienvenue Entourage Pro',
    type: EventType.WELCOME_SESSION,
  },
  {
    name: 'Café d’information Entourage Pro',
    type: EventType.COFFEE_SESSION,
  },
  {
    name: 'L’atelier réseau',
    type: EventType.NETWORKING,
  },
  {
    name: 'La rencontre réseau',
    type: EventType.SPEED_MEETING,
  },
  {
    name: 'Les papotages pro',
    type: EventType.PAPOTAGES_PRO,
  },
  {
    name: 'Le shooting photo',
    type: EventType.PHOTO_SHOOTING,
  },
  {
    name: 'Apéro coach',
    type: EventType.APERO_COACH,
  },
  {
    name: 'Atelier Entourage Pro',
    type: EventType.WORKSHOP,
  },
];

export const EVENT_IMAGES: {
  [key in EventType]: string;
} = {
  [EventType.WELCOME_SESSION]: '/static/img/events/welcome_session.jpg',
  [EventType.COFFEE_SESSION]: '/static/img/events/coffee_session.jpg',
  [EventType.NETWORKING]: '/static/img/events/networking.jpg',
  [EventType.SPEED_MEETING]: '/static/img/events/speed_meeting.jpg',
  [EventType.PAPOTAGES_PRO]: '/static/img/events/papotages_pro.jpg',
  [EventType.PHOTO_SHOOTING]: '/static/img/events/photo_shooting.jpg',
  [EventType.APERO_COACH]: '/static/img/events/apero_coach.jpg',
  [EventType.WORKSHOP]: '/static/img/events/workshop.jpg',
  [EventType.UNKNOWN]: '/static/img/events/placeholder.png',
};

export const EVENT_MODES_FILTERS: FilterConstant<EventMode>[] = [
  ...EVENT_MODES.map(({ name, format }) => {
    return {
      value: format,
      label: name,
    };
  }),
];

export const EVENT_TYPES_FILTERS: FilterConstant<string>[] = [
  ...EVENT_TYPES.map(({ name, type }) => {
    return {
      value: type,
      label: name,
    };
  }),
];
