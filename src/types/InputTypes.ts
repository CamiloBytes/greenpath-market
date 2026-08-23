import type { UseFormRegisterReturn } from "react-hook-form";

export interface InputProps {
    type: string;
    placeholder?: string;
    label?: string;
    icon?: React.ReactNode;
    className?: string;
    error?: string;
    register?: UseFormRegisterReturn;
}