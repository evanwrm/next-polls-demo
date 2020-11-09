import {
    Button,
    Container,
    Grid,
    IconButton,
    makeStyles,
    Theme,
    Typography
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import * as Yup from "yup";
import Layout from "../components/Layout";
import { Poll } from "../interfaces/Poll";
import { auth, firestore } from "../lib/firebase";

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(8)
    },
    nested: {
        marginLeft: theme.spacing(2)
    },
    nestedGrid: {
        display: "flex",
        alignItems: "center"
    }
}));

const addSchema = Yup.object({
    question: Yup.string().required(),
    options: Yup.array().of(Yup.string().required()).min(2).max(10)
});

const initialValues: Poll = {
    id: "",
    question: "",
    options: ["", ""]
};

const Add: NextPage = () => {
    const classes = useStyles();
    const router = useRouter();

    return (
        <Layout title="Add Poll">
            <Container component="main" maxWidth="sm">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3">
                        Customize your poll
                    </Typography>
                    <Formik
                        validateOnChange={false}
                        validateOnBlur={true}
                        initialValues={initialValues}
                        validationSchema={addSchema}
                        onSubmit={async (poll: Poll, { setSubmitting }) => {
                            setSubmitting(true);

                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const { id, ...data } = poll;

                            // firebase
                            await auth.signInAnonymously();
                            const doc = await firestore.collection("polls").add({ ...data });

                            // redirect
                            router.push(`/polls/${doc.id}`);

                            setSubmitting(false);
                        }}
                    >
                        {({ values, isSubmitting }) => (
                            <Form className={classes.form}>
                                <Grid spacing={2} container>
                                    <Grid item xs={12}>
                                        <Field
                                            component={TextField}
                                            variant="outlined"
                                            name="question"
                                            label="Question"
                                            fullWidth={true}
                                            autoFocus={true}
                                            required={true}
                                        />
                                    </Grid>
                                    <FieldArray name="options">
                                        {arrayHelpers => {
                                            return (
                                                <Grid
                                                    className={classes.nested}
                                                    spacing={2}
                                                    container
                                                    item
                                                    xs={12}
                                                >
                                                    <Grid item xs={12}>
                                                        <Typography
                                                            component="h1"
                                                            variant="subtitle1"
                                                        >
                                                            Options
                                                        </Typography>
                                                    </Grid>
                                                    {values.options.map((_option, idx) => (
                                                        <Grid
                                                            key={idx}
                                                            className={classes.nestedGrid}
                                                            item
                                                            xs={12}
                                                        >
                                                            <Field
                                                                component={TextField}
                                                                variant="outlined"
                                                                name={`options.${idx}`}
                                                                label={`Options ${idx + 1}`}
                                                                fullWidth={true}
                                                                required={true}
                                                            />
                                                            <IconButton
                                                                aria-label="remove"
                                                                size="small"
                                                                onClick={() =>
                                                                    arrayHelpers.remove(idx)
                                                                }
                                                            >
                                                                <Clear />
                                                            </IconButton>
                                                        </Grid>
                                                    ))}
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => arrayHelpers.push("")}
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            );
                                        }}
                                    </FieldArray>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Container>
        </Layout>
    );
};

export default Add;
