import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AccountPopup from '../components/popup/accountPopup'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <AccountPopup />
        </>
    )
}

export default MyApp
