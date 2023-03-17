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
import Script from 'next/script'

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
    />
    <Script
      id="gtag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              });
            `,
      }}
    />
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
  </>
  )
}

export default MyApp
