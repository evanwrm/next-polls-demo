import {
    Button,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    makeStyles,
    Radio,
    RadioGroup,
    Theme,
    Typography
} from "@material-ui/core";
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../../components/Layout";
import { Poll } from "../../../interfaces/Poll";
import { auth, firestore } from "../../../lib/firebase";

interface Props {
    poll: Poll | null;
    errors?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    buttons: {
        width: "100%",
        marginTop: theme.spacing(4),
        display: "flex",
        justifyContent: "space-evenly"
    }
}));

const PollDetail: NextPage<Props> = ({ poll, errors }: Props) => {
    const classes = useStyles();
    const router = useRouter();

    const [option, setOption] = useState<number>(0);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOption(parseInt((event.target as HTMLInputElement).value));
    };

    const handleVote = async () => {
        await auth.signInAnonymously();
        firestore
            .collection("polls")
            .doc(poll?.id)
            .collection("votes")
            .doc(auth.currentUser?.uid)
            .set({
                option
            })
            .catch(() => console.error("Failed to vote"));

        router.push(`/polls/${poll?.id}/r`);
    };

    if (router.isFallback) {
        return (
            <Layout title="Loading...">
                <Container component="main" maxWidth="md">
                    <div className={classes.paper}>
                        <CircularProgress />
                    </div>
                </Container>
            </Layout>
        );
    }

    if (errors || !poll) {
        return (
            <Layout title="Error">
                <Container component="main" maxWidth="md">
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5" style={{ color: "red" }}>
                            Error
                        </Typography>
                        <p>
                            <span>{errors}</span>
                        </p>
                    </div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout title={poll.question}>
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">
                            <Typography component="h1" variant="h3">
                                {poll.question}
                            </Typography>
                        </FormLabel>
                        <RadioGroup
                            aria-label="options"
                            name="pollOptions"
                            value={option}
                            onChange={handleChange}
                        >
                            {poll.options.map((option, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    value={idx}
                                    control={<Radio />}
                                    label={option}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" onClick={handleVote}>
                            Vote
                        </Button>
                        <Link href="/polls/[id]/r" as={`/polls/${poll?.id}/r`} passHref>
                            <Button variant="contained" color="inherit">
                                View Results
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </Layout>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths: { params: { id: string } }[] = [];

    return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const staticProps: GetStaticPropsResult<Props> = {
        props: { poll: null }
    };

    try {
        if (params?.id) {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            const doc = await firestore.collection("polls").doc(id).get();
            const poll = { id: doc.id, ...doc.data() } as Poll;

            if (!poll) throw new Error("Poll not found");
            else if (staticProps.props) staticProps.props.poll = poll;
        }
    } catch (err) {
        if (staticProps.props) staticProps.props.errors = err.message;
    }

    return staticProps;
};

export default PollDetail;
