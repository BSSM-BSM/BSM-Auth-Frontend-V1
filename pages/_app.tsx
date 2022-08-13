import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { AccountBox } from '../components/common/accountPopup'
import ModalDim from '../components/common/modalDim'
import LoadingDim from '../components/common/loadingDim'
import Toast from '../components/common/toast'
import Alert from '../components/common/alert'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <RecoilRoot>
                <Component {...pageProps} />
                <>
                    <Toast />
                    <Alert />
                    <LoadingDim />
                    <ModalDim />
                    <AccountBox />
                </>
            </RecoilRoot>
        </>
    )
}

export default MyApp
