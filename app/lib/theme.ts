import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'jadeGreen',
  colors: {
    jadeGreen: [
      "#eafbed",
      "#dbf1e0",
      "#b9e0c1",
      "#94cfa0",
      "#75c184",
      "#60b772",
      "#55b368",
      "#459d57",
      "#3a8c4c",
      "#2c793e"
    ],
  },
  headings: {
    fontFamily: 'Murecho, Roboto, sans-serif',
    sizes: {
      h1: { fontSize: rem(36) },
    },
  },

  // Customize components
  components: {
    Button: {
      defaultProps: {
        color: 'jadeGreen',
        variant: 'filled',
      },
      styles: {
        root: {
          // If you specifically want to use the color at index 7 of the jadeGreen scale
          backgroundColor: '#459d57 !important',
        },
      },
    },
    Checkbox: {
      styles: {
        input: {
          '&:checked': {
            backgroundColor: '#459d57 !important',
            borderColor: '#459d57 !important', 
          },
        },
      },
    },
  },
});
