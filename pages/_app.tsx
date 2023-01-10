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
import Sidebar from '../components/common/sidebar/sidebar'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div className='wrap'>
        <RecoilRoot>
          <Sidebar />
          <main className='scroll-bar'>
            <Component {...pageProps} />
          </main>
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
      </div>
    )
}

export default MyApp
