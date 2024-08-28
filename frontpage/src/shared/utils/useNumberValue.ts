import { InputHTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from 'react';

type InputAttributes = InputHTMLAttributes<HTMLInputElement>;

const isDefined = <DefinedType>(unknown: DefinedType | undefined | null): unknown is DefinedType =>
    unknown != null;

function clamp(value: number, max = 1, min = 0) {
    return Math.max(min, Math.min(max, value));
}

const getNumberValue = (value: string | number) => {
    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        throw new TypeError(`Invalid value attribute: ${value}`);
    }
    return numberValue;
};

export type NumberValueState = {
    value: number;
    setValue: (value: number) => void;
    minValue: number;
    maxValue: number;
};

export const useNumberValue = (
    value: Exclude<InputAttributes['value'], ReadonlyArray<string>>,
    defaultValue: Exclude<InputAttributes['defaultValue'], ReadonlyArray<string>>,
    min: InputAttributes['min'],
    max: InputAttributes['max'],
    onUpdate: ((value: number) => void) | undefined
): NumberValueState => {
    const lastValueRef = useRef<number>();
    const [hasValue, controlledValue] = useMemo(
        () => (isDefined(value) ? [true, getNumberValue(value)] : [false, 0]),
        [value]
    );
    const [localValue, setLocalValue] = useState((): number => {
        const initialValue = hasValue ? controlledValue : isDefined(defaultValue) ? getNumberValue(defaultValue) : 0;
        lastValueRef.current = initialValue;
        return initialValue;
    });

    // update if the external value changes (defaultValue should not trigger an update)
    useEffect(() => {
        if (hasValue) {
            if (controlledValue !== lastValueRef.current) {
                lastValueRef.current = controlledValue;
                setLocalValue(controlledValue);
            }
        }
    }, [hasValue, controlledValue]);

    const setValue = useCallback(
        (nextValue: number) => {
            setLocalValue(nextValue);
            onUpdate?.(nextValue);
        },
        [onUpdate]
    );

    const [minValue, maxValue] = useMemo<[number, number]>(() => {
        const minValue = Number(min);
        const maxValue = Number(max);
        if (Number.isNaN(minValue)) {
            throw new TypeError(`Invalid min attribute: ${min}`);
        }
        if (Number.isNaN(maxValue)) {
            throw new TypeError(`Invalid max attribute: ${max}`);
        }
        if (minValue > maxValue) {
            throw new RangeError(`Min attribute: ${min} bigger than max: ${max}`);
        }
        return [minValue, maxValue];
    }, [min, max]);

    const currentValue = hasValue ? controlledValue : localValue;
    return useMemo(
        () => ({
            value: currentValue,
            setValue,
            minValue,
            maxValue,
        }),
        [currentValue, setValue, minValue, maxValue]
    );
};

type InputEvents = Pick<InputAttributes, 'onInput' | 'onBlur' | 'onKeyDown'>;

export const useNumberInput = (
    events: InputEvents,
    state: NumberValueState,
    value?: number
): [number | string, InputEvents] => {
    const [inputValue, setInputValue] = useState<string>();

    const updateValueFromInput = (element: HTMLInputElement) => {
        const nextValue = Number(element.value);
        if (!Number.isNaN(nextValue)) {
            state.setValue(clamp(Math.round(nextValue), state.maxValue, state.minValue));
        }
    };

    useEffect(() => {
        setInputValue(String(value));
    }, [value]);

    return [
        isDefined(inputValue) ? inputValue : isDefined(value) ? value : state.value,
        {
            onInput: (event) => {
                const nextValue = Number(event.currentTarget.value);
                if (!Number.isNaN(nextValue) || event.currentTarget.value === '') {
                    events.onInput?.(event);
                    setInputValue(event.currentTarget.value);
                }
            },
            onBlur: (event) => {
                events.onBlur?.(event);
                updateValueFromInput(event.currentTarget);
            },
            onKeyDown: (event) => {
                events.onKeyDown?.(event);
                if (event.key === 'Enter' && event.currentTarget.value !== '') {
                    updateValueFromInput(event.currentTarget);
                }
            },
        },
    ];
};
