import {
    Children,
    ForwardRefRenderFunction,
    FunctionComponent,
    ReactNode,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import { debounce } from 'throttle-debounce';
import {supportsPassiveListeners} from "../../utils/supportsPassiveListeners";
import { CaretRight } from '../Icons/Caret';
import styles from './Slider.module.scss';
import React from 'react';

const DEBOUNCE_DELAY = 100;
const HORIZONTAL = 1;
const VERTICAL = -1;
const SWIPE_TRESHOLD = 5;

export type DisplayedItemsByWindowWidth = [number, number, number, number, number];

interface SliderProps {
    onNext?: (offset: number) => void;
    onPrevious?: (offset: number) => void;
    numberOfDisplayedItems: number | DisplayedItemsByWindowWidth;
    showDots?: boolean;
    infinite?: boolean;
    children: ReactNode;
}

export interface SliderRef {
    setOffset: (offset: number) => void;
}

const Dot: FunctionComponent<{ onClick: () => void; active?: boolean }> = ({
                                                                               onClick,
                                                                               active = false,
                                                                           }) => (
    <button
        type="button"
        className={cn(styles.dotButton, active ? styles.dotButtonActive : null)}
        onClick={onClick}
    ></button>
);

const round = (value: number) => Math.round(value * 100000) / 100000;

const getDisplayedItemsByWindowWidth = (
    width: number,
    numberOfDisplayedItems: DisplayedItemsByWindowWidth
) => {
    if (width < 480) {
        return numberOfDisplayedItems[0];
    } else if (width < 768) {
        return numberOfDisplayedItems[1];
    } else if (width < 1024) {
        return numberOfDisplayedItems[2];
    } else if (width < 1280) {
        return numberOfDisplayedItems[3];
    }

    return numberOfDisplayedItems[4];
};

const SliderWithRef: ForwardRefRenderFunction<SliderRef, SliderProps> = (
    {
        numberOfDisplayedItems,
        onNext = () => {},
        onPrevious = () => {},
        children,
        showDots = false,
        infinite = false,
    },
    ref
) => {
    const [currentOffset, setCurrentOffset] = useState(infinite ? -1 : 0);
    const [swipedDistance, setSwipedDistance] = useState(0);
    const [maxItems, setMaxItems] = useState(
        Array.isArray(numberOfDisplayedItems) ? 1 : numberOfDisplayedItems
    );
    const singleItemOffset = useMemo(() => 1 / maxItems, [maxItems]);

    const transitionEnabled = useRef(true);
    const sliderBar = useRef<HTMLDivElement>();
    const sliderWrapper = useRef<HTMLDivElement>();
    const swipeDirection = useRef<number>(null);
    const touchStartX = useRef<number>(null);
    const touchStartY = useRef<number>(null);
    const windowWidth = useRef<number>(0);

    const dotCount = useMemo(
        () => (showDots ? Math.ceil(Children.count(children)) : 0),
        [children, showDots]
    );
    const offsetForTiles = useMemo<number[]>(() => {
        const value = [-singleItemOffset - singleItemOffset];
        for (let i = 1; i < dotCount; i++) {
            value[i] = value[i - 1] - singleItemOffset;
        }
        return value;
    }, [singleItemOffset, dotCount]);
    const currentActiveDotIndex = useMemo(
        () => offsetForTiles.map(round).indexOf(round(currentOffset)),
        [currentOffset, offsetForTiles]
    );

    const setOffset = useCallback(
        (offset: number) => {
            setCurrentOffset(offsetForTiles[offset]);
        },
        [offsetForTiles, setCurrentOffset]
    );

    useImperativeHandle(ref, () => ({ setOffset }));

    const determineMaxNumberOfItems = useMemo(
        () =>
            debounce(DEBOUNCE_DELAY, () => {
                if (!Array.isArray(numberOfDisplayedItems)) {
                    return;
                }

                const width = window.innerWidth;
                if (width !== windowWidth.current) {
                    const maximumItems = getDisplayedItemsByWindowWidth(width, numberOfDisplayedItems);
                    setMaxItems(maximumItems);
                    setCurrentOffset(infinite ? (-1 / maximumItems) * 2 : 0);
                    windowWidth.current = width;
                }
            }),
        [numberOfDisplayedItems, infinite]
    );

    const nextPossible = useCallback(() => {
        return currentOffset - 1 > (Children.count(children) / maxItems) * -1;
    }, [currentOffset, maxItems, children]);

    const previousPossible = useCallback(() => currentOffset < 0, [currentOffset]);

    const getNextOffset = useCallback(() => {
        const offset = currentOffset * -1;
        const displayItemStartIndex = (offset + 1) * maxItems;
        const childCount = Children.count(children);

        if (displayItemStartIndex + maxItems <= childCount) {
            return currentOffset - 1;
        }

        const adjustedMaxItems = childCount - maxItems;
        const offsetDifference = adjustedMaxItems / maxItems - offset;

        return currentOffset - offsetDifference;
    }, [currentOffset, maxItems, children]);

    const getPreviousOffset = (offset: number) => {
        if (offset + 1 < 0) {
            return offset + 1;
        }

        return 0;
    };

    // Next and previous are used for non-infinite sliders where we move Math.ceil(maxItems) a time
    // and need to take care at the end of list to not move too far.
    const next = useCallback(() => {
        if (nextPossible()) {
            const newOffset = getNextOffset();
            setCurrentOffset(newOffset);
            setSwipedDistance(0);
            onNext(newOffset * -1);
        }
    }, [nextPossible, onNext, getNextOffset]);

    const previous = useCallback(() => {
        if (previousPossible()) {
            const newOffset = getPreviousOffset(currentOffset);
            setCurrentOffset(newOffset);
            setSwipedDistance(0);
            onPrevious(newOffset * -1);
        }
    }, [currentOffset, previousPossible, onPrevious]);

    // The single item functions are only used for infinite sliders where we move one item at a time
    const nextSingleItem = useCallback(() => {
        setCurrentOffset(currentOffset - singleItemOffset);
    }, [currentOffset, singleItemOffset]);

    const previousSingleItem = useCallback(() => {
        const nextOffset = currentOffset + singleItemOffset;
        setSwipedDistance(0);
        setCurrentOffset(nextOffset);
    }, [currentOffset, singleItemOffset]);

    const moveSingleItem = (offset: number) => {
        setCurrentOffset(offset);
    };

    const onTouchStartX = useCallback((event: TouchEvent) => {
        touchStartX.current = event.changedTouches[0].screenX;
        touchStartY.current = event.changedTouches[0].screenY;
        swipeDirection.current = null;
    }, []);

    const onTouchEndX = useCallback(() => {
        swipeDirection.current = null;
        if (swipedDistance > 40) {
            infinite ? previousSingleItem() : previous();
        } else if (swipedDistance < -40) {
            infinite ? nextSingleItem() : next();
        } else {
            setSwipedDistance(0);
        }
    }, [next, previous, swipedDistance, infinite, nextSingleItem, previousSingleItem]);

    const onTouchMoveX = useCallback(
        (event: TouchEvent) => {
            if (!event || !event.changedTouches[0]) {
                return;
            }

            const swipedDistanceX = event.changedTouches[0].screenX - touchStartX.current;
            const swipedDistanceY = event.changedTouches[0].screenY - touchStartY.current;

            if (!swipeDirection.current) {
                if (Math.abs(swipedDistanceX) > SWIPE_TRESHOLD) {
                    swipeDirection.current = HORIZONTAL;
                } else if (Math.abs(swipedDistanceY) > SWIPE_TRESHOLD) {
                    swipeDirection.current = VERTICAL;
                }
            }

            if (swipeDirection.current === HORIZONTAL) {
                event.preventDefault();
                const { width } = sliderBar.current.getBoundingClientRect();
                let distance =
                    swipedDistanceX < 0
                        ? Math.max(-width, swipedDistanceX)
                        : Math.min(width, swipedDistanceX);
                if (currentOffset === 0 && distance > 40) {
                    distance = 40;
                }
                if (!nextPossible() && distance < -40) {
                    distance = -40;
                }
                setSwipedDistance(distance);
            }
        },
        [currentOffset, nextPossible]
    );

    const onTouchCancelX = useCallback(() => {
        swipeDirection.current = null;
        setSwipedDistance(0);
    }, []);

    useEffect(() => {
        if (Array.isArray(numberOfDisplayedItems)) {
            window.addEventListener('resize', determineMaxNumberOfItems);
        }

        return () => {
            window.removeEventListener('resize', determineMaxNumberOfItems);
        };
    }, [numberOfDisplayedItems, determineMaxNumberOfItems]);

    useEffect(() => {
        //should run once on mount
        determineMaxNumberOfItems();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const currentSliderWrapper = sliderWrapper.current;

        if (currentSliderWrapper) {
            currentSliderWrapper.addEventListener(
                'touchstart',
                onTouchStartX,
                supportsPassiveListeners() ? { passive: false } : false
            );
            currentSliderWrapper.addEventListener('touchend', onTouchEndX);
            currentSliderWrapper.addEventListener(
                'touchmove',
                onTouchMoveX,
                supportsPassiveListeners() ? { passive: false } : false
            );
            currentSliderWrapper.addEventListener('touchcancel', onTouchCancelX);
        }

        return () => {
            if (currentSliderWrapper) {
                window.removeEventListener('touchstart', onTouchStartX);
                window.removeEventListener('touchend', onTouchEndX);
                window.removeEventListener('touchmove', onTouchMoveX);
                window.removeEventListener('touchend', onTouchEndX);
            }
        };
    }, [onTouchStartX, onTouchEndX, onTouchMoveX, onTouchCancelX]);

    const onTransitionEnd = useCallback(() => {
        if (!infinite) {
            return;
        }

        // For infinite slider the tiles contain clones of the last two elements at the beginning
        // and of the first two elements at the end.
        // If we move the offset to the first clone we need to adjust the offset to the offset of the
        // first (in case we are at the end of the tile list) or the last (in case we are at the beginning of the tile list).
        // We need to do this with a disabled transition so the user won't notice.
        if (round(currentOffset) > round(offsetForTiles[0])) {
            transitionEnabled.current = false;
            setCurrentOffset(offsetForTiles[offsetForTiles.length - 1]);
            requestAnimationFrame(() => {
                transitionEnabled.current = true;
            });
        } else if (round(currentOffset) < round(offsetForTiles[offsetForTiles.length - 1])) {
            transitionEnabled.current = false;
            setCurrentOffset(offsetForTiles[0]);
            requestAnimationFrame(() => {
                transitionEnabled.current = true;
            });
        }
    }, [currentOffset, offsetForTiles, infinite]);

    const tiles = Children.map(children, (child, index) => {
        return (
            <>
                {infinite && index === 0 ? (
                    <>
                        <div className={styles.sliderItem} style={{ width: `calc(100% / ${maxItems})` }}>
                            {children[Children.count(children) - 2]}
                        </div>
                        <div className={styles.sliderItem} style={{ width: `calc(100% / ${maxItems})` }}>
                            {children[Children.count(children) - 1]}
                        </div>
                    </>
                ) : null}
                <div className={styles.sliderItem} style={{ width: `calc(100% / ${maxItems})` }}>
                    {child}
                </div>
                {infinite && index === Children.count(children) - 1 ? (
                    <>
                        <div className={styles.sliderItem} style={{ width: `calc(100% / ${maxItems})` }}>
                            {children[0]}
                        </div>
                        <div className={styles.sliderItem} style={{ width: `calc(100% / ${maxItems})` }}>
                            {children[1]}
                        </div>
                    </>
                ) : null}
            </>
        );
    });

    const transform = `translateX(${
        currentOffset * 100
    }%) translateX(${swipedDistance}px) translateZ(0)`;
    const transition =
        swipedDistance !== 0 || !transitionEnabled.current ? null : 'transform .75s ease-in-out';

    return (
        <div className={styles.slider}>
            {!showDots ? (
                <button
                    type="button"
                    className={cn(styles.sliderButton, styles.sliderButtonPrev)}
                    onClick={previous}
                    disabled={!previousPossible()}
                >
                    {' '}
                    <CaretRight className={styles.iconLeft} width="1.5rem" height="1.5rem" />
                </button>
            ) : null}
            <div className={styles.sliderWrapper} ref={sliderWrapper}>
                <div
                    className={styles.sliderContent}
                    ref={sliderBar}
                    style={{ transform, transition }}
                    onTransitionEnd={onTransitionEnd}
                >
                    {tiles}
                </div>
            </div>
            {showDots ? (
                <div className={styles.dotContainer}>
                    {offsetForTiles.map((offset, index) => (
                        <Dot
                            key={offset}
                            onClick={() => {
                                moveSingleItem(offset);
                            }}
                            active={index === currentActiveDotIndex}
                        />
                    ))}
                </div>
            ) : null}
            {!showDots ? (
                <button
                    type="button"
                    className={cn(
                        styles.sliderButton,
                        styles.sliderButtonNext,
                        Number.isInteger(maxItems) ? styles.sliderButtonRelative : null
                    )}
                    onClick={next}
                    disabled={!nextPossible()}
                >
                    <CaretRight width="1.5rem" height="1.5rem" />
                </button>
            ) : null}
        </div>
    );
};

export const Slider = forwardRef(SliderWithRef);
