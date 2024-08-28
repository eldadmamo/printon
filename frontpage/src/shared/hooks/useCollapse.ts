import { MutableRefObject, useCallback, useRef, useState } from 'react';
import { useOnElementResize} from "./useOnElementResize";

export const useCollapse = <ContentWrapperElement extends HTMLElement>(
    isOpenInitial: boolean,
    container?: MutableRefObject<HTMLElement>
) => {
    const [isOpen, setIsOpen] = useState(isOpenInitial);
    const [showChildren, setShowChildren] = useState(isOpen);

    const contentWrapperRef = useRef<ContentWrapperElement>();
    const cancelUpdateShowChildren = useRef<() => void>();
    const toggle = (setTo?: boolean) => {
        cancelUpdateShowChildren.current?.();
        setIsOpen((isOpenCurrent) => {
            const isOpenNext = typeof setTo === 'boolean' ? setTo : !isOpenCurrent;
            if (isOpenNext) {
                setShowChildren(isOpenNext);
            } else {
                const updateShowChildren = () => {
                    setShowChildren(!isOpen);
                    cancelUpdateShowChildren.current();
                    cancelUpdateShowChildren.current = null;
                };
                const updateTimeout = setTimeout(updateShowChildren, 500);
                contentWrapperRef.current.addEventListener('transitionend', updateShowChildren);
                cancelUpdateShowChildren.current = () => {
                    clearTimeout(updateTimeout);
                    contentWrapperRef.current?.removeEventListener('transitionend', updateShowChildren);
                };
            }

            return isOpenNext;
        });
    };

    const [height, setHeight] = useState<number | 'auto'>('auto');
    const [alignRight, setAlignRight] = useState(false);
    const updateHeight = useCallback(
        (contentElement: HTMLElement) => {
            const rect = contentElement.getBoundingClientRect();
            const elementHeight = rect.height;
            if (elementHeight) {
                setHeight(elementHeight);

                // container of one collapse component
                const itemWrapper = contentWrapperRef.current?.offsetParent as HTMLElement;
                // container of all collapse components
                const containerElement = container?.current;
                if (itemWrapper && containerElement) {
                    setAlignRight(
                        itemWrapper.offsetLeft + rect.width >
                        containerElement.offsetLeft + containerElement.clientWidth
                    );
                }
            }
        },
        [container]
    );
    const contentInnerRef = useOnElementResize(updateHeight);

    let wrapperHeight = isOpen ? height : 0;
    if (!isOpenInitial && wrapperHeight === 'auto') {
        // if an initially closed component gets opened for the first time the wrapper height needs to stay at 0
        //  so we can measure the size of the child first, otherwise there is no animation
        wrapperHeight = 0;
    }

    return [
        contentWrapperRef,
        contentInnerRef,
        isOpen,
        showChildren,
        wrapperHeight,
        toggle,
        alignRight,
    ] as const;
};
