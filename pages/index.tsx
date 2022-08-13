import type { NextPage } from 'next'
import { useModal } from '../hooks/useModal';
import { useOverlay } from '../hooks/useOverlay';

const Home: NextPage = () => {
    const { openModal } = useModal();
    const { showToast } = useOverlay();
    return (
        <div>
            <button onClick={() => openModal('login')}>로그인 창 열기</button>
            <button onClick={() => showToast('test')}>토스트 메시지 테스트</button>
        </div>
    )
}

export default Home
