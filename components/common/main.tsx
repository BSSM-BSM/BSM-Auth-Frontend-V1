import { ReactNode, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { headerOptionState, sideBarState } from '../../store/common.store';
import Sidebar from './sidebar/sidebar';
import Navbar from './navbar/navbar';
import { SettingBox } from './settingPopup';
import Toast from './overlay/toast';
import Alert from './overlay/alert';
import LoadingDim from './overlay/loadingDim';
import { Header } from './header';
import { AccountBox } from './accountPopup';

export const Main = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sideBar, setSideBar] = useRecoilState(sideBarState);
  const { title, headTitle } = useRecoilValue(headerOptionState);

  useEffect(() => {
    if (headTitle) {
      document.title = headTitle;
    } else {
      document.title = title ?? '';
    }
  }, [title]);

  return (
    <div className={`wrap ${sideBar ? 'side_bar_open' : ''}`}>
      <Sidebar />
      <Navbar />
      <main onClick={() => setSideBar(false)}>
        {children}
      </main>
      <>
        <Header />
        <Toast />
        <Alert />
        <LoadingDim />
        <AccountBox />
        <SettingBox />
      </>
    </div>
  );
}