import {
    CSSProperties,
    FormEventHandler,
    ForwardedRef,
    FunctionComponent,
    InputHTMLAttributes,
    KeyboardEventHandler,
    MouseEventHandler,
    RefCallback,
    TouchEventHandler,
    useCallback,
    useEffect,
    useState,
} from 'react';
import classNames from 'classnames';
import { setRef} from "../../utils/setRef";
import { NumberValueState, useNumberInput, useNumberValue } from '../../utils/useNumberValue';
import styles from './Slider.module.scss';
import React from 'react';

type InputAttributes = InputHTMLAttributes<HTMLInputElement>;

const getAncestorByQuerySelector = (element: HTMLElement, selector: string): HTMLElement | null => {
    const parent = element.parentElement;
    if (parent) {
        if (parent.matches(selector)) {
            return parent;
        }

        return getAncestorByQuerySelector(parent, selector);
    }

    return null;
};

type SliderBaseInputProps = {
    valueState: NumberValueState;
    inputProps: InputAttributes;
    inputRef: ForwardedRef<HTMLInputElement> | undefined;
};

type SliderRangeProps = SliderBaseInputProps & {
    value: number;
    setValue: (value: number) => void;
};

const SliderRange: FunctionComponent<SliderRangeProps> = ({
                                                              value,
                                                              setValue,
                                                              valueState,
                                                              inputProps: { id, onInput, onMouseUp, onKeyUp, onTouchEnd, ...inputProps },
                                                              inputRef,
                                                          }) => {
    const setRangeRef = useCallback<RefCallback<HTMLInputElement>>(
        (element) => {
            setRef<typeof element>(inputRef, element);
        },
        [inputRef]
    );

    const [sliderPercent, setSliderPercent] = useState('0');
    useEffect(() => {
        const min = Number(valueState.minValue);
        const max = Number(valueState.maxValue);
        const calcValue = Number(value);
        const propValue = `${((calcValue - min) / (max - min)) * 100}%`;
        setSliderPercent(propValue);
    }, [value, valueState]);

    const setComponentValue = valueState.setValue;

    const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
        onInput?.(event);
        setValue(Number(event.currentTarget.value));
    };

    const handleMouseUp: MouseEventHandler<HTMLInputElement> = (event) => {
        onMouseUp?.(event);
        setComponentValue(value);
    };

    const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
        onKeyUp?.(event);
        setComponentValue(value);
    };

    const handleTouchEnd: TouchEventHandler<HTMLInputElement> = (event) => {
        onTouchEnd?.(event);
        setComponentValue(value);
    };

    return (
        <input
            {...inputProps}
            className={styles.sliderRange}
            ref={setRangeRef}
            id={id}
            value={value}
            min={valueState.minValue}
            max={valueState.maxValue}
            onInput={handleInput}
            onKeyUp={handleKeyUp}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            type="range"
            style={{ '--slider-percent': sliderPercent } as CSSProperties}
        />
    );
};

type SliderInputProps = SliderBaseInputProps & {
    value: number;
    following: boolean | undefined;
    symbolBefore?: string;
    symbolAfter?: string;
    min: string | number;
    max: string | number;
};

const SliderInput: FunctionComponent<SliderInputProps> = ({
                                                              value,
                                                              following,
                                                              symbolBefore,
                                                              symbolAfter,
                                                              min,
                                                              max,
                                                              valueState,
                                                              inputProps: { className, onInput, ...inputProps },
                                                          }) => {
    const [inputValue, inputEvents] = useNumberInput(inputProps, valueState, value);

    return (
        <span className={styles.inputBox}>
      {symbolBefore && <span className={styles.symbolLeft}>{symbolBefore}</span>}
            <input
                {...inputProps}
                {...inputEvents}
                value={inputValue}
                type="text"
                inputMode="numeric"
                className={classNames(
                    styles.sliderInput,
                    following && styles.sliderInputFollowing,
                    className
                )}
                min={min}
                max={max}
            />
            {symbolAfter && <span className={styles.symbolRight}>{symbolAfter}</span>}
    </span>
    );
};

type LimitedInputAttributes = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue'
>;

type SliderProps = LimitedInputAttributes & {
    value?: Exclude<InputAttributes['value'], ReadonlyArray<string>>;
    defaultValue?: Exclude<InputAttributes['defaultValue'], ReadonlyArray<string>>;
    inputFollowing?: boolean;
    inputProps?: LimitedInputAttributes;
    inputRef?: ForwardedRef<HTMLInputElement | null>;
    rangeRef?: ForwardedRef<HTMLInputElement | null>;
    onUpdateSlider?: (value: number) => void;
    inputSymbolBefore?: string;
    inputSymbolAfter?: string;
};

export const Slider: FunctionComponent<SliderProps> = ({
                                                           children,
                                                           className,
                                                           value,
                                                           defaultValue,
                                                           min = 0,
                                                           max = 100,
                                                           inputFollowing,
                                                           inputProps,
                                                           inputRef,
                                                           rangeRef,
                                                           onUpdateSlider,
                                                           inputSymbolBefore,
                                                           inputSymbolAfter,
                                                           ...rangeProps
                                                       }) => {
    const state = useNumberValue(value, defaultValue, min, max, onUpdateSlider);

    const numberValue = state.value;
    const [rangeValue, setRangeValue] = useState(numberValue);
    useEffect(() => setRangeValue(numberValue), [numberValue]);

    return (
        <span className={classNames(styles.slider, className)}>
      {(children || inputProps) && (
          <span className={styles.sliderHeader}>
          {children && (
              <label
                  className={classNames(
                      styles.sliderLabel,
                      inputFollowing && inputProps && styles.sliderLabelWithFollowingInput
                  )}
                  htmlFor={rangeProps.id}
              >
                  {children}
              </label>
          )}
              {inputProps && (
                  <SliderInput
                      value={rangeValue}
                      following={inputFollowing}
                      valueState={state}
                      inputProps={inputProps}
                      inputRef={inputRef}
                      symbolBefore={inputSymbolBefore}
                      symbolAfter={inputSymbolAfter}
                      min={min}
                      max={max}
                  />
              )}
        </span>
      )}
            <SliderRange
                value={rangeValue}
                setValue={setRangeValue}
                valueState={state}
                inputProps={rangeProps}
                inputRef={rangeRef}
            />
    </span>
    );
};
