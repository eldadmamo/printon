import {
    ForwardRefRenderFunction,
    MutableRefObject,
    ReactNode,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef
} from "react";
import cn from 'classnames';
import {useCollapse} from "../../hooks/useCollapse";
import {trackFeature} from "../../utils/adobeLaunch";
import {Minus} from "../Icons/Minus";
import {Plus} from "../Icons/Plus";
import styles from './Collapse.module.scss';
import React from "react";

const scrollIntoView = (element: MutableRefObject<HTMLDivElement>) =>
    element.current?.scrollIntoView({ behavior: 'smooth' });

export interface CollapseRef {
    show: () => void;
}

interface CollapseProps {
    title: ReactNode;
    isOpenInitial?: boolean;
    last?: boolean;
    first?: boolean;
    asHeading?: boolean;
    asLink?: boolean;
    trackingId?: string;
    children: ReactNode;
}

const CollapseWithRef: ForwardRefRenderFunction<CollapseRef, CollapseProps> = (
    { title, isOpenInitial = false, last, first, asHeading, asLink, trackingId, children },
    ref
) => {
    const [contentWrapperRef, contentInnerRef, isOpen, showChildren, height, toggle] =
        useCollapse<HTMLDivElement>(isOpenInitial);

    const element = useRef<HTMLDivElement>();
    const scrollWhenOpen = useRef(false);
    useImperativeHandle(ref, () => ({
        show: () => {
            if (isOpen) {
                scrollIntoView(element);
            } else {
                scrollWhenOpen.current = true;
                toggle(true);
            }
        },
    }));

    useEffect(() => {
        // check for the height too, so we only start scrolling when the collapsed content is visible
        if (isOpen && scrollWhenOpen.current && height > 0) {
            scrollWhenOpen.current = false;
            scrollIntoView(element);
        }
    }, [isOpen, height]);

    const tracked = useRef(false);
    useEffect(() => {
        if (trackingId && isOpen && !isOpenInitial && !tracked.current) {
            trackFeature({ featureName: 'pdp-collapse-opened', collapse: trackingId });
            // make sure we only track once per page, if user has opened the collapse
            tracked.current = true;
        }
        // trackingId and isOpenInitial should not change and should not trigger
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <div ref={element} className={cn(styles.container, first && styles.first, last && styles.last)}>
            <button
                className={cn(
                    styles.titleBtn,
                    asHeading && styles.titleBtnAsHeading,
                    asLink && styles.titleBtnAsLink
                )}
                onClick={() => toggle()}
                aria-expanded={isOpen}
                data-collapsible="true"
            >
                {title} {isOpen ? <Minus className={styles.icon} /> : <Plus className={styles.icon} />}
            </button>
            <div className={styles.content} ref={contentWrapperRef} style={{ height }}>
                {showChildren && (
                    <div className={styles.contentInner} ref={contentInnerRef}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};

export const Collapse = forwardRef(CollapseWithRef);
