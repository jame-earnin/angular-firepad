import { IFirepad } from "./firepad-x";

export {};

declare global {
  interface Window {
    firepad: IFirepad;
    editor: any;
  }
}