import {ForwardedRef, RefCallback} from "react";

const isRefCallback = <RefValueType>(
    ref: Exclude<ForwardedRef<RefValueType>, null>
): ref is RefCallback<RefValueType> => typeof ref === 'function';

export const setRef = <RefValueType>(
    ref: ForwardedRef<RefValueType> | undefined,
    value: RefValueType
) => {
    if (ref) {
        if (isRefCallback(ref)) {
            ref(value)
        } else {
            ref.current = value;
        }
    }
}