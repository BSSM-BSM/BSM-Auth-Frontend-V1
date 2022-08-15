import { useState } from "react";

interface ToggleButtonProps {
    onCallback: Function;
    offCallback: Function;
}

export const ToggleButton = (props: ToggleButtonProps, initial: boolean) => {
    const [checked, setChecked] = useState(initial);
    
    return (
        <label className={`toggle-button ${checked? 'active': ''}`} onClick={() => {
            if (!checked) {
                props.onCallback();
            } else {
                props.offCallback();
            }
            setChecked(!checked);
        }}>
            <div className="slider"></div>
        </label>
    );
}