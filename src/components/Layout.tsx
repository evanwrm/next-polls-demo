import { AppBar, Button, makeStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title?: string;
};

const useStyles = makeStyles((_theme: Theme) => ({
    title: {
        flexGrow: 1
    }
}));

const Layout: React.FC<Props> = ({ children, title = "Wics Polls" }: Props) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <AppBar position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6">
                        {title}
                    </Typography>
                    <Link href="/" passHref>
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link href="/add" passHref>
                        <Button color="inherit">Add Poll</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            {children}
        </React.Fragment>
    );
};

export default Layout;
