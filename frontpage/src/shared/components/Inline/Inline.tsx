import { CSSProperties, Children, FunctionComponent, ReactNode, createElement } from 'react';
import cn from 'classnames';
import styles from './Inline.module.scss';

export const { justifyCenter, nowrap } = styles;

interface InlineProps {
    className?: string;
    component?: 'div' | 'ol' | 'ul';
    space?: number;
    id?: string;
    children: ReactNode;
}

export const Inline: FunctionComponent<InlineProps> = ({
                                                           className,
                                                           component = 'div',
                                                           space = 0,
                                                           children,
                                                           id,
                                                       }) => {
    const isList = component === 'ol' || component === 'ul';
    const itemComponent = isList ? 'li' : 'div';

    return createElement(
        component,
        {
            id: id,
            className: cn(styles.inline, className),
            style: {
                '--space': space,
            } as CSSProperties,
        },
        Children.map(
            children,
            (child) =>
                child &&
                createElement(
                    itemComponent,
                    {
                        className: styles.childBox,
                    },
                    child
                )
        )
    );
};
