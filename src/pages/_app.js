import { GeistProvider, CssBaseline } from '@geist-ui/core';
import '@/styles/globals.scss';

const App = ({ Component, pageProps }) => {
    return (
        <GeistProvider>
            <CssBaseline />
            <Component {...pageProps} />
        </GeistProvider>
    );
};

export default App;
