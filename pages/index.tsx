import type { NextPage } from 'next'
import { useModal } from '../hooks/useModal';

const Home: NextPage = () => {
    const { openModal } = useModal();
    return (
        <div>
            <button onClick={() => openModal('login')}>로그인 창 열기</button>
        </div>
    )
}

export default Home
