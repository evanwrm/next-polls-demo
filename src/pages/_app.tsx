import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import { NextComponentType } from "next";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import React, { useEffect } from "react";

const theme = createMuiTheme({});

const AppWrapper: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
    Component,
    pageProps
}: AppProps) => {
    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles && jssStyles.parentElement) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default AppWrapper;
