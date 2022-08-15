import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot, useRecoilState } from 'recoil'
import { AccountBox } from '../components/common/accountPopup'
import ModalDim from '../components/common/modalDim'
import LoadingDim from '../components/common/overlay/loadingDim'
import Toast from '../components/common/overlay/toast'
import Alert from '../components/common/overlay/alert'
import { SettingBox } from '../components/common/settingPopup'
import { themeState } from '../store/common.store'
import { useEffect } from 'react'

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
                    <SettingBox />
                </>
            </RecoilRoot>
        </>
    )
}

export default MyApp
