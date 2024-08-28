import {ChangeEvent,FunctionComponent} from "react";
import cn from 'classnames';
import styles from './Input.module.scss'
import React from "react";

export interface InputProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    className?: string;
}

export const Input: FunctionComponent<InputProps> = ({
                                                         value,
                                                         onChange,
                                                         type = 'text',
                                                         className,
                                                     }) => (
    <input
        className={cn(styles.inputBasics, className && className)}
        value={value}
        onChange={onChange}
        type={type}
    />
);