import { useCallback, useEffect, useRef } from 'react';
import { hasWindow} from "../utils/hasWindow";
import { isDefined} from "../utils/isDefined";

type OnResize = (element: HTMLElement | null) => void;

const useOnElementResizeObserver = (onResize: OnResize) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const onResizeRef = useRef<OnResize>(onResize);
    // update the value on every render
    onResizeRef.current = onResize;

    const resizeObserverRef = useRef<ResizeObserver>();
    if (!resizeObserverRef.current) {
        resizeObserverRef.current = new ResizeObserver(() => onResizeRef.current(elementRef.current));
    }

    useEffect(() => () => resizeObserverRef.current?.disconnect(), []);

    return useCallback((element: HTMLElement | null) => {
        const resizeObserver = resizeObserverRef.current;
        const currentElement = elementRef.current;

        if (currentElement) {
            resizeObserver?.unobserve(currentElement);
        }

        if (element) {
            resizeObserver?.observe(element);
        }

        elementRef.current = element;
    }, []);
};

export const useOnElementResize =
    hasWindow() && isDefined(window.ResizeObserver) ? useOnElementResizeObserver : () => null;
