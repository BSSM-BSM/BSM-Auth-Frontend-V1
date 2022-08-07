import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    children: ReactNode,
    active: boolean,
    setActive: Dispatch<SetStateAction<boolean>>
}

const Modal = ({children, active, setActive}: ModalProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    
    return mounted? createPortal(
        active?
            <div>
                <button onClick={() => setActive(false)}>X</button>
                {children}
            </div>
            : null
        ,document.querySelector('#modal') as HTMLElement
    ): null;
};

export default Modal;