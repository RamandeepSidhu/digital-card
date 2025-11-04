export type CardType = 'business' | 'bank' | 'personal';
export type BusinessCardStyle = 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style6';
export type BankCardStyle = 'style1' | 'style2' | 'style3';
export type PersonalCardStyle = 'style1' | 'style2' | 'style3';

export interface BusinessCard {
  id: string;
  type: 'business';
  style: BusinessCardStyle;
  data: {
    name: string;
    date: any;
    title: string;
    company: string;
    email: string;
    phone: string;
    website?: string;
    linkedin?: string;
    address?: string;
    image?: any; // Base64 encoded image or URL
  };
  createdAt: Date;
}

export interface BankCard {
  id: string;
  type: 'bank';
  style: BankCardStyle;
  data: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifscCode?: string;
    routingNumber?: string;
    upiId?: string;
    logo?: string; // Base64 encoded image or URL for bank logo
  };
  createdAt: Date;
}

export interface PersonalCard {
  id: string;
  type: 'personal';
  style: PersonalCardStyle;
  data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    birthday?: string;
    website?: string;
    image?: string; // Base64 encoded image or URL for profile picture
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
    };
  };
  createdAt: Date;
}

export type Card = BusinessCard | BankCard | PersonalCard;

