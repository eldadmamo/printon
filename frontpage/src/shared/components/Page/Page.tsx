import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './Page.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
    fit?: boolean;
    children: ReactNode;
}

export const Page: FunctionComponent<Props> = ({ fit, children, ...rest }) => (
    <div className={cn(styles.cmsContainer, !fit && styles.cmsMarginBottom)} {...rest}>
        {children}
    </div>
);
