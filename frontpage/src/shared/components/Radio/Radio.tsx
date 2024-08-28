import {ForwardedRef, FunctionComponent, InputHTMLAttributes} from "react";
import cn from 'classnames';
import styles from './Radio.module.scss';
import React from "react";

type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    inputRef?: ForwardedRef<HTMLInputElement | null>;
};


export const Radio: FunctionComponent<RadioProps> = ({
    children,
    className,
    inputRef,
    ...inputProps
}) => {
    return (
        <label className={cn(styles.radio , className)}>
            <input ref={inputRef} className={styles.radioInput} type="radio" {...inputProps} />
            <span className={styles.radioIndicator} />
            {children && <span className={styles.radioLabel}>{children}</span>}
        </label>
    )
}