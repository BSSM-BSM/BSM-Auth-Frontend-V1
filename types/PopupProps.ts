import { Dispatch, SetStateAction } from "react"

export interface PopupProps {
    showBox: boolean
    setShowBox: Dispatch<SetStateAction<boolean>>
}