import {
    FormEventHandler,
    FunctionComponent,
    KeyboardEventHandler,
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react";
import cn from 'classnames';
import {trackFeature} from "../../utils/adobeLaunch";
import {Minus} from "../Icons/Minus";
import {Plus} from "../Icons/Plus";
import styles from './QuantitySelector.module.scss'
import React from "react";

type QuantitySelectorProps = {
    inputId: string;
    quantity: number;
    onChange: (quantity: number) => void;
    disabled?: boolean;
    minValue?: number;
    maxValue: number;
    ariaLabel?: string;
    decreaseLabel?: string;
    increaseLabel?: string;
    infoTooltip?: ReactNode;
    children?: ReactNode;
}

export const QuantitySelector: FunctionComponent<QuantitySelectorProps> = ({
                                                                               inputId,
                                                                               quantity,
                                                                               onChange,
                                                                               disabled,
                                                                               minValue = 0,
                                                                               maxValue = Number.POSITIVE_INFINITY,
                                                                               ariaLabel,
                                                                               decreaseLabel,
                                                                               increaseLabel,
                                                                               infoTooltip,
                                                                               children,
                                                                           }) => {
    const [value, setValue] = useState(String(quantity));
    const lastChangedValue = useRef(quantity);
    useEffect(() => {
        setValue(String(quantity));
        lastChangedValue.current = quantity;
    }, [quantity]);

    const update = (diff?: number) => {
        let parsedValue = parseInt(value, 10);
        if (Number.isNaN(parsedValue) || parsedValue < minValue) {
            parsedValue = minValue;
        }
        if(parsedValue > maxValue){
            parsedValue = maxValue;
        }

        const changeValue = diff ? parsedValue + diff : parsedValue;
        setValue(String(changeValue));

        if(changeValue !== lastChangedValue.current) {
            onChange(changeValue);
            lastChangedValue.current = changeValue;
        }

        return changeValue;
    };

    const onInput: FormEventHandler<HTMLInputElement> = (event) => {
        setValue((event.target as HTMLInputElement).value);
    }

    const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key !== 'Enter') return;
        update();
    };

    const onDecrease = () => {
        const updatedValue = update(-1);
        trackFeature({ featureName: 'assortment-quantity-decrease', quantity: updatedValue });
    };

    const onIncrease = () => {
        const updatedValue = update(1);
        trackFeature({ featureName: 'assortment-quantity-increase', quantity: updatedValue });
    };

    return (
        <div>
            {children && (
                <label htmlFor={inputId} aria-label={ariaLabel}>
                    {children}
                </label>
            )}
            <div className={styles.selectorWithInfo}>
        <span className={styles.selectorBox}>
          <input
              className={styles.input}
              id={inputId}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              spellCheck="false"
              value={value}
              disabled={disabled}
              onInput={onInput}
              onBlur={() => update()}
              onKeyDown={onInputKeyDown}
          />
          <button
              className={cn(styles.counterButton, styles.minus)}
              type="button"
              id="button-decrease"
              title={decreaseLabel}
              onClick={onDecrease}
              disabled={disabled || parseInt(value, 10) <= minValue}
          >
            <Minus/>
          </button>
          <button
              className={cn(styles.counterButton, styles.plus)}
              type="button"
              id="button-increase"
              title={increaseLabel}
              onClick={onIncrease}
              disabled={disabled || parseInt(value, 10) >= maxValue}
          >
            <Plus/>
          </button>
        </span>
                {infoTooltip}
            </div>
        </div>
    );
};