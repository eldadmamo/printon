import {IconBase,IconComponent} from "./BaseIcon";
import React from 'react';

const Circle = () => (
    <path
        d="M6.43 14.95a9.57 9.57 0 1 0 19.14 0 9.57 9.57 0 1 0-19.14 0m2.1 0a7.47 7.47 0 1 0 14.95 0 7.47 7.47 0 1 0-14.95 0"
        fillRule="evenodd"
    />
);

const FemaleSign = () => (
    <path d="m17.07 22.97-2.14.02v4.74H12.8v2.14h2.13V32h2.14v-2.13h2.13v-2.14h-2.13v-4.76Z" />
);

export const Female: IconComponent = (props) => (
    <IconBase {...props}>
        <Circle />
        <FemaleSign />
    </IconBase>
);

const MaleSign = () => (
    <path d="M24.53 0v2.13h2.77l-6.34 6.34 1.5 1.48 6.34-6.33V6.4h2.13V0h-6.4Z" />
);

export const Male: IconComponent = (props) => (
    <IconBase {...props}>
        <Circle />
        <MaleSign />
    </IconBase>
);

export const Unisex: IconComponent = (props) => (
    <IconBase {...props}>
        <Circle />
        <FemaleSign />
        <MaleSign />
        <path d="M9.53 9.97 11 8.47 8.93 6.4l1.38-1.38-1.51-1.5L7.42 4.9 4.7 2.13h2.77V0h-6.4v6.4H3.2V3.64L5.96 6.4 4.58 7.78l1.5 1.51 1.4-1.39 2.06 2.07Z" />
    </IconBase>
);
