import type { NextPage } from 'next'
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useModal } from '../hooks/useModal';
import { useOverlay } from '../hooks/useOverlay';
import { headerOptionState } from '../store/common.store';

const Home: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const { openModal } = useModal();
    const { showToast, showAlert } = useOverlay();

    useEffect(() => {
        setHeaderOption({title: ''});
    }, []);

    return (
        <div>
            <button onClick={() => openModal('login')}>로그인 창 열기</button>
            <button onClick={() => showToast('test\nmessage')}>토스트 메시지 테스트</button>
            <button onClick={() => showAlert('test\nmessage')}>알림 메시지 테스트</button>
        </div>
    )
}

export default Home
