import { createInterFont } from "@tamagui/font-inter";
import { shorthands } from "@tamagui/shorthands";
import { themes, tokens } from "@tamagui/themes";
import { createTamagui } from "tamagui";





const headingFont = createInterFont();
const bodyFont = createInterFont();

const appConfig = createTamagui({
  themes,
  tokens,
  shorthands,
  backgroundColor: "#FFFFFF",

  light: {
    ...themes.light,
    background: "#FFFFFF",
  },
});

export type AppConfig = typeof appConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;