// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type Palette } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    actionable: Palette['primary'];
    actionableSelected: Palette['primary'];
    nonactionable: Palette['primary'];
    nonactionableSelected: Palette['primary'];
  }

  interface PaletteOptions {
    actionable?: PaletteOptions['primary'];
    actionableSelected?: PaletteOptions['primary'];
    nonactionable?: PaletteOptions['primary'];
    nonactionableSelected?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    actionable: true;
    actionableSelected: true;
    nonactionable: true;
    nonactionableSelected: true;
  }
}
