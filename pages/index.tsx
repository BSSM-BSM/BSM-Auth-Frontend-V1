import type { NextPage } from 'next'
import { useState } from 'react';
import Modal from '../components/Modal'

const Home: NextPage = () => {
    const [testModal, setTestModal] = useState<boolean>(true);
    return (
        <div>
            <button onClick={() => setTestModal(true)}>팝업 열기</button>
            <Modal active={testModal} setActive={setTestModal}>
                <p>test</p>
            </Modal>
        </div>
    )
}

export default Home
