/// <reference path="../.astro/types.d.ts" />
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
  phones?: { src: string; alt: string; device: "iphone" | "android" }[];
}

export type Vote = {
  [key: string]: string;
};

export type VoteResult = {
  ok: number;
  uncertain: number;
  stop: number;
  total: number;
};
