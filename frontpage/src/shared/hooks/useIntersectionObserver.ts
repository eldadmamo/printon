import { RefCallback, useCallback, useContext, useRef, useState } from 'react';
import { IntersectionCallback, IntersectionObserverContext} from "../IntersectionObserverContext";

export const useIntersectionObserver = (callback: IntersectionCallback) => {
    const ref = useRef<Element>();
    const intersectionObserver = useContext(IntersectionObserverContext);
    return useCallback(
        (element: Element | null) => {
            if (ref.current) {
                intersectionObserver.unobserve(ref.current);
            }
            if (element) {
                ref.current = element;
                intersectionObserver.observe(element, callback);
            }
        },
        [intersectionObserver, callback]
    );
};

export const useIsVisibleObserver = <ElementType extends Element>(): [
    RefCallback<ElementType>,
    boolean
] => {
    const [isVisible, setIsVisible] = useState(false);
    const intersectionCallback: IntersectionCallback = useCallback((entry) => {
        if (entry.isIntersecting) {
            setIsVisible(true);
        }
    }, []);
    const callbackRef = useIntersectionObserver(intersectionCallback);
    return [isVisible ? null : callbackRef, isVisible];
};
