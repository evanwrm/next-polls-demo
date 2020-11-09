import {
    Button,
    CircularProgress,
    Container,
    Grid,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@material-ui/core";
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Layout from "../../../components/Layout";
import { Poll } from "../../../interfaces/Poll";
import { Vote } from "../../../interfaces/Vote";
import { firestore } from "../../../lib/firebase";

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
    graphs: {
        marginTop: theme.spacing(4)
    },
    buttons: {
        width: "100%",
        marginTop: theme.spacing(4),
        display: "flex",
        justifyContent: "center"
    }
}));

const PollDetailResults: NextPage<Props> = ({ poll, errors }: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();

    const matchesMd = useMediaQuery(theme.breakpoints.up("md"));

    const query = poll?.id
        ? firestore.collection("polls").doc(poll?.id).collection("votes")
        : undefined;
    const [votes] = useCollectionData<Vote>(query);

    const voteCounts = Array(poll?.options.length || 0).fill(0);
    (votes || []).forEach(vote => {
        voteCounts[vote.option]++;
    });

    const totalVotes = voteCounts.reduce((acc, option) => acc + option, 0);

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

    const data = {
        labels: poll.options,
        datasets: [
            {
                data: voteCounts,
                backgroundColor: [
                    "#ff3d00",
                    "#3d5afe",
                    "#1de9b6",
                    "#ffea00",
                    "#00e5ff",
                    "#2979ff",
                    "#00e676",
                    "#ffc400",
                    "#d500f9",
                    "#ff1744"
                ]
            }
        ]
    };

    return (
        <Layout title={poll.question}>
            <Container component="main" maxWidth="md">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3">
                        {poll.question}
                    </Typography>
                    <Grid container className={classes.graphs} spacing={2}>
                        <Grid item md={7} xs={12}>
                            <HorizontalBar
                                data={data}
                                options={{
                                    legend: { display: false },
                                    scales: {
                                        xAxes: [
                                            {
                                                ticks: { min: 0, stepSize: 1 },
                                                gridLines: { display: false }
                                            }
                                        ],
                                        yAxes: [{ gridLines: { display: true } }]
                                    }
                                }}
                            />
                        </Grid>
                        {totalVotes && matchesMd && (
                            <Grid item md={5}>
                                <Doughnut data={data} />
                            </Grid>
                        )}
                    </Grid>
                    <div className={classes.buttons}>
                        <Link href="/polls/[id]" as={`/polls/${poll?.id}`} passHref>
                            <Button variant="contained" color="inherit">
                                Vote
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

export default PollDetailResults;
