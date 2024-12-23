import { PaletteOptions } from '@mui/material/styles';

// 1. MUI 색상 키를 타입으로 정의
type MuiColorKeys = Exclude<keyof typeof import('@mui/material/colors'), 'common'>;

type GeneratedPalette = {
  [Key in MuiColorKeys]: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
};

// 2. PaletteOptions에 추가
declare module '@mui/material/styles' {
  interface Palette extends GeneratedPalette {}
  interface PaletteOptions extends GeneratedPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides extends Record<MuiColorKeys, true> {}
}
