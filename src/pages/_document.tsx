import { ServerStyleSheets } from "@material-ui/core/styles";
import { RenderPageResult } from "next/dist/next-server/lib/utils";
import Document, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript
} from "next/document";
import React from "react";

class DocumentWrapper extends Document {
    // `getInitialProps` belongs to `_document` (instead of `_app`),
    // it's compatible with server-side generation (SSG).
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
        // Resolution order
        //
        // On the server:
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. document.getInitialProps
        // 4. app.render
        // 5. page.render
        // 6. document.render
        //
        // On the server with error:
        // 1. document.getInitialProps
        // 2. app.render
        // 3. page.render
        // 4. document.render
        //
        // On the client
        // 1. app.getInitialProps
        // 2. page.getInitialProps
        // 3. app.render
        // 4. page.render

        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = (): RenderPageResult | Promise<RenderPageResult> =>
            originalRenderPage({
                enhanceApp: App => props => sheets.collect(<App {...props} />)
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()]
        };
    }

    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    {/* PWA primary color */}
                    <meta name="theme-color" content="#fff" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default DocumentWrapper;
