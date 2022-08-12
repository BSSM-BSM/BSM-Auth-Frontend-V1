import type { NextPage } from 'next'
import { useModal } from '../hook/useModal';

const Home: NextPage = () => {
    const { openModal } = useModal();
    return (
        <div>
            <button onClick={() => openModal('loginBox')}>로그인 창 열기</button>
        </div>
    )
}

export default Home
