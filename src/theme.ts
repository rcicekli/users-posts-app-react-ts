import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#f7f0f0ff',
    },
    primary: {
      main: '#5DADE2',
    },
    text: {
      primary: '#ffffff',   // ana metin rengi beyaz
      secondary: '#bbbbbb', // yardımcı metin rengi açık gri
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
}

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    background: {
      default: '#F4F6F7',
      paper: '#fff',
    },
    primary: {
      main: '#5DADE2',
    },
    text: {
      primary: '#000000',   // ana metin rengi siyah
      secondary: '#555555', // yardımcı metin rengi koyu gri
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
}


// ⬇️⬇️⬇️ default export olarak getTheme fonksiyonu
export default function getTheme(mode: 'light' | 'dark') {
  return createTheme(mode === 'light' ? lightThemeOptions : darkThemeOptions)
}
