import React from "react";
import {
    CSSProperties,
    Children,
    Fragment,
    FunctionComponent,
    ReactNode,
    createElement
} from "react";
import styles from './Stack.module.scss';

interface StackProps {
    component?: 'div' | 'ol' | 'ul';
    space?: number;
    children: ReactNode
}

export const Stack: FunctionComponent<StackProps> = ({
    component = 'div',
    space = 0,
    children
                                                     }) => {
    const isList = component === 'ol' || component === 'ul';
    const itemComponent = isList ? 'li' : 'div';
    const items = Children.toArray(children);
    const count = items.length;

    if(!isList && (count <= 1 || space === 0)) {
        return <Fragment>{items}</Fragment>
    }

    const lastIndex = count - 1;

    return createElement(
        component,
        {
            style: {
                '--space': space,
            } as CSSProperties,
        },
        Children.map(
            items,
            (child,index) =>
                child && createElement(
                    itemComponent,
                    {
                        className: space && index !== lastIndex ? styles.stackItem : undefined,
                    },
                child
                )
        )
    )
}