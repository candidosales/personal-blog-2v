/// <reference types="astro/client" />

export interface MenuItem {
  href: string;
  label: string;
  targetBlank: boolean;
  icon: any;
}

export interface Service {
  iconUrl: string;
  cssClass: string;
  title: string;
  description: string;
}
