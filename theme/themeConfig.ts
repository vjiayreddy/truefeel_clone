import {
  PaletteColorOptions,
  createTheme,
  responsiveFontSizes,
  PaletteOptions,
  css,
} from "@mui/material/styles";
import { APP_COLORS } from "./colors";
import { APP_BAR_SIZE } from "@/utils/constants";
import { Atkinson_Hyperlegible } from "next/font/google";

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface CustomPalette {
    milkWhite?: PaletteColorOptions;
    google?: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
  interface Theme extends CustomPalette {}
  interface ThemeOptions extends CustomPalette {}
}

// Override button props
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    milkWhite: true;
    google: true;
  }
}
export type AllowedTheme = NonNullable<PaletteOptions["mode"]>;
export const DEFAULT_THEME: AllowedTheme = "dark";
const defaultTheme = createTheme({
  //spacing: 10,
});
const { augmentColor } = defaultTheme.palette;
const createColor = (mainColor: any) =>
  augmentColor({
    color: {
      main: mainColor,
    },
  });
export const lightTheme = createTheme({
  palette: {
    primary: { main: APP_COLORS.PRIMARY_COLOR },
    secondary: { main: APP_COLORS.SECONDARY_COLOR },
    mode: "light",
    milkWhite: createColor(APP_COLORS.WHITE),
    google: createColor(APP_COLORS.GOOGLE),
  },
  typography: {
    fontFamily: [atkinson.style.fontFamily].join(","),
    h1: {
      fontSize: 30,
      fontWeight: 700,
      lineHeight: "39px",
    },
    subtitle1: {
      fontSize: 22,
      lineHeight: "28px",
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 18,
      lineHeight: "28px",
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      lineHeight: "24px",
      letterSpacing: "0.5px",
    },
    caption:{
      color:defaultTheme.palette.text.secondary
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
        color: "primary",
        fullWidth: true,
        size: "large",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 100,
        },
        sizeLarge: {
          height: 50,
        },
        outlinedInherit: {
          border:`1px solid ${defaultTheme.palette.divider}`
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "medium",
      },
      styleOverrides: {},
    },
    MuiAppBar: {
      defaultProps: {
        color: "inherit",
        elevation: 0,
      },
    },
  },
});

export const globalStyles = css`
  :root {
    body {
      background-color: #ffffff;
      color: #121212;
    }
    main {
      padding-top: ${0}px;
    }
  }

  [data-theme="dark"] {
    body {
      background-color: #121212;
      color: #fff;
    }
  }
`;
