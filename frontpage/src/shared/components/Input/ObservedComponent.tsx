import React, { useContext, useRef, useEffect } from 'react';
import { IntersectionObserverContext } from '../../IntersectionObserverContext';

const ObservedComponent: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { observe, unobserve } = useContext(IntersectionObserverContext);

    useEffect(() => {
        if (ref.current) {
            const callback = (entry: IntersectionObserverEntry) => {
                console.log('IntersectionObserver entry:', entry);
            };
            observe(ref.current, callback);

            return () => {
                if (ref.current) {
                    unobserve(ref.current);
                }
            };
        }
    }, [observe, unobserve]);

    return (
        <div ref={ref} style={{ height: '200px', background: 'lightcoral', margin: '50px 0' }}>
            Observe me
        </div>
    );
};

export default ObservedComponent;
