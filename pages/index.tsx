import type { NextPage } from 'next'
import { useRecoilState } from 'recoil';
import { showLoginBoxState } from '../store/account.store';

const Home: NextPage = () => {
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);
    return (
        <div>
            <button onClick={() => setShowLoginBox(true)}>로그인창 열기</button>
        </div>
    )
}

export default Home
