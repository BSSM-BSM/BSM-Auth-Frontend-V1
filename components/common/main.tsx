import { ReactNode, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { aprilFool2024State, headerOptionState, sideBarState } from '@/store/common.store';
import Sidebar from '@/components/common/sidebar/sidebar';
import Navbar from '@/components/common/navbar/navbar';
import { SettingBox } from '@/components/common/settingPopup';
import Toast from '@/components/common/overlay/toast';
import Alert from '@/components/common/overlay/alert';
import LoadingDim from '@/components/common/overlay/loadingDim';
import { Header } from '@/components/common/header';
import { AccountBox } from '@/components/common/accountPopup';

export const Main = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [sideBar, setSideBar] = useRecoilState(sideBarState);
  const { title, headTitle } = useRecoilValue(headerOptionState);
  const [aprilFool2024, setAprilFool2024] = useRecoilState(aprilFool2024State);

  useEffect(() => {
    if (headTitle) {
      document.title = headTitle;
    } else {
      document.title = title ?? '';
    }
  }, [title]);

  useEffect(() => {
    if (aprilFool2024) {
      document.body.classList.add('aprilFool2024');
    } else {
      document.body.classList.remove('aprilFool2024');
    }
  }, [aprilFool2024]);

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