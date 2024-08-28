import { FunctionComponent, ReactNode, createContext, useEffect, useMemo, useRef } from 'react';
import { hasWindow} from "./utils/hasWindow";
import { isDefined} from "./utils/isDefined";
import React from "react";

export type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

type IntersectionObserverValue = {
    observe: (element: Element, callback: IntersectionCallback) => void;
    unobserve: (element: Element) => void;
};

const noop = () => {};
const intersectionObserverValueDefault: IntersectionObserverValue = {
    observe: noop,
    unobserve: noop,
};

export const IntersectionObserverContext = createContext<IntersectionObserverValue>(
    intersectionObserverValueDefault
);

interface IntersectionObserverProviderProps {
    children: ReactNode;
}

const isIntersectionObserverSupported = hasWindow() && isDefined(window.IntersectionObserver);

export const IntersectionObserverProvider: FunctionComponent<IntersectionObserverProviderProps> = ({
                                                                                                       children,
                                                                                                   }) => {
    const callbacks = useRef<WeakMap<Element, IntersectionCallback>>(new WeakMap());
    const [value, disconnect] = useMemo((): [IntersectionObserverValue, () => void] => {
        if (isIntersectionObserverSupported) {
            const intersectionObserver = new IntersectionObserver((entries) =>
                entries.forEach((entry) => {
                    callbacks.current.get(entry.target)?.(entry);
                })
            );

            return [
                {
                    observe: (element, callback) => {
                        callbacks.current.set(element, callback);
                        intersectionObserver.observe(element);
                    },
                    unobserve: (element) => {
                        intersectionObserver.unobserve(element);
                        callbacks.current.delete(element);
                    },
                },
                () => intersectionObserver.disconnect(),
            ];
        }

        return [intersectionObserverValueDefault, noop];
    }, []);

    useEffect(() => () => disconnect(), [disconnect]);

    return (
        <IntersectionObserverContext.Provider value={value}>
            {children}
        </IntersectionObserverContext.Provider>
    );
};

