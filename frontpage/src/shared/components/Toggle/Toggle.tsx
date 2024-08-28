import {ForwardedRef,FunctionComponent,InputHTMLAttributes} from "react";
import classNames from "classnames";
import {CheckMark} from "../Icons/CheckMark";
import {Close} from "../Icons/Close";
import styles from './Toggle.module.scss'
import React from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    inputRef?: ForwardedRef<HTMLInputElement> | null;
}

export const Toggle: FunctionComponent<CheckboxProps> = ({
    children,
    className,
    inputRef,
    ...inputProps
}) => {
return(
    <label className={classNames(styles.toggle, className)}>
        <input ref={inputRef} className={styles.toggleInput} type="checkbox" {...inputProps}/>
        <span className={styles.toggleIndicator}>
            <CheckMark width={'0.75rem'} height={'0.75rem'} className={classNames(styles.toggleIndicatorIcon, styles.toggleIndicatorIconChecked)}/>
            <Close width={'0.75rem'} height={'0.75rem'} className={styles.toggleIndicatorIcon} />
        </span>
        {
            children && <span className={styles.toggleLabel}>{children}</span>
        }
    </label>
)
}