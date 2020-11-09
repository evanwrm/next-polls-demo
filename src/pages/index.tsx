import { Button, Container, makeStyles, Theme, Typography } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    addPoll: {
        marginTop: theme.spacing(8)
    }
}));

const IndexPage: React.FC = () => {
    const classes = useStyles();

    return (
        <Layout title="Home">
            <Container component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3">
                        Wics Polls
                    </Typography>
                    <Link href="/add" passHref>
                        <Button className={classes.addPoll} variant="contained" color="primary">
                            Add Poll
                        </Button>
                    </Link>
                </div>
            </Container>
        </Layout>
    );
};

export default IndexPage;
