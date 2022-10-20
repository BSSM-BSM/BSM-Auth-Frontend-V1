import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { AccountBox } from '../components/common/accountPopup'
import ModalDim from '../components/common/modalDim'
import LoadingDim from '../components/common/overlay/loadingDim'
import Toast from '../components/common/overlay/toast'
import Alert from '../components/common/overlay/alert'
import { SettingBox } from '../components/common/settingPopup'
import { Header } from '../components/common/header'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RecoilRoot>
            <Component {...pageProps} />
            <>
                <Header />
                <Toast />
                <Alert />
                <LoadingDim />
                <ModalDim />
                <AccountBox />
                <SettingBox />
            </>
        </RecoilRoot>
    )
}

export default MyApp
