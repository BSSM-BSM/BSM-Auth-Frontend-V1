import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    children: ReactNode,
    active: boolean,
    setActive: Dispatch<SetStateAction<boolean>>,
    type?: string,
    title?: string | ReactNode
}

const Modal = ({
    children,
    active,
    setActive,
    type,
    title
}: ModalProps) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    
    return mounted? createPortal(
        active?
            <div className={`modal ${type}`}>
                <p className="modal--title">
                    {title}
                </p>
                <div className="close_button" onClick={() => setActive(false)}></div>
                <div className="modal--content">
                    {children}
                </div>
            </div>
            : null
        ,document.querySelector('#modal') as HTMLElement
    ): null;
};

export default Modal;