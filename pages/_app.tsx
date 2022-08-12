import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { AccountBox } from '../components/common/accountPopup'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <RecoilRoot>
                <Component {...pageProps} />
                <>
                    <AccountBox />
                </>
            </RecoilRoot>
        </>
    )
}

export default MyApp
