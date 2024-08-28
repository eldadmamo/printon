import {FunctionComponent,ReactNode,createElement} from "react";
import cn from 'classnames';
import styles from './Text.module.scss';

export const {center,lh1, lh1p1,lh1p2, ellipsis} = styles;

export interface TextProps {
    className?: string;
    size?: 'xxsmall' | 'xsmall' | 'small' | 'large' | 'xlarge' | 'xxlarge';
    weight?: 'strong';
    color?: 'light' | 'grey40';
    children: ReactNode;
}

export const Text: FunctionComponent<TextProps> = ({
    className:componentClassName,
    size,
    weight,
    color,
    children,
                                                   }) =>
    createElement(
        weight === 'strong' ? 'strong': 'span',
        {
            className: cn(styles.base, componentClassName, styles[size], styles[color])
        },
        children
    )