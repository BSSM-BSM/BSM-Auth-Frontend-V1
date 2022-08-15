import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeState } from "../../store/common.store";
import { ToggleButton } from "./buttons/toggleButton";
import Modal from "./modal";

export const SettingBox = () => {
    const [theme, setTheme] = useRecoilState(themeState);

    useEffect(() => {
        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    return (
        <Modal type="main" id="setting" title="설정">
            <ul className='list-wrap left'>
                <li>
                    <h3>모양</h3>
                    <ul className='list'>
                        <li className="toggle">
                            <span>다크 모드</span>
                            <ToggleButton onCallback={() => setTheme('dark')} offCallback={() => setTheme('white')} />
                        </li>
                        <li className='detail'>
                            <span>배율</span>
                            <span>100%</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </Modal>
    );
}