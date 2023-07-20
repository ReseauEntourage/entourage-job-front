import { AmbitionsPrefixesType } from 'src/constants';

export interface CVType {
  user: {
    candidat: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      zone: string;
      gender: number;
    };
  };
  catchphrase: string;
  story: string;
  locations: {
    name: string;
    order: number;
  }[];
  availability: string;
  urlImg: string;
  contracts: {
    name: string;
  }[];
  ambitions: {
    name: string;
    order: number;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    name: string;
    order: number;
  }[];
  languages: {
    name: string;
    order: number;
  }[];
  transport: string;
  skills: {
    id: string;
    name: string;
    order: number;
  }[];
  passions: {
    name: string;
    order: number;
  }[];
  reviews: {
    id: string;
    name: string;
    text: string;
    status: string;
  }[];
  experiences: {
    description: string;
    skills: {
      id: string;
      name: string;
      order: number;
    }[];
  }[];
  status: string;
  UserId: string;
}
