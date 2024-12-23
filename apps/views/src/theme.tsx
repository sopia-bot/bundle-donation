import { alpha, createTheme, getContrastRatio } from '@mui/material/styles';
import * as colors from '@mui/material/colors';

const colorPalette = Object.fromEntries(
  Object.entries(colors)
    .filter(([name]) => !['common'].includes(name))
    .map(([name, value]: any) => {
      return [name, {
        main: value['500'],
        light: alpha(value['500'], 0.5),
        dark: alpha(value['500'], 0.9),
        constrastText: getContrastRatio(value['500'], '#fff') > 4.5 ? '#fff' : '#111',
      }]
    })
);
// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: colors.red.A400,
    },
    ...colorPalette,
  },
});

export default theme;