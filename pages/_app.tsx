import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AccountPopup from '../components/popup/accountPopup'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <RecoilRoot>
                <Component {...pageProps} />
                <AccountPopup />
            </RecoilRoot>
        </>
    )
}

export default MyApp
