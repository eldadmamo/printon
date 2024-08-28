import React from "react";
import { FunctionComponent, SVGAttributes } from "react";

export type IconComponent = FunctionComponent<SVGAttributes<SVGElement>>;

export const IconBase: IconComponent = ({
                                            width = '1em',
                                            height = '1em',
                                            viewBox = '0 0 32 32',
                                            children,
                                            ...rest
                                        }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={width}
        height={height}
        fill="currentColor"
        {...rest}
    >
        {children}
    </svg>
);
