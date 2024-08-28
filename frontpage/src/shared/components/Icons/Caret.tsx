import React from 'react';
import { IconBase, IconComponent } from './BaseIcon';

export const CaretDown: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M31.9 9.46L16 25.36.1 9.46l2.83-2.82L16 19.7 29.07 6.64l2.83 2.82z" />
    </IconBase>
);

export const CaretRight: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M9.46 31.9L25.36 16 9.46.1 6.64 2.93 19.7 16 6.64 29.07l2.82 2.83z" />
    </IconBase>
);

export const CaretLeft: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M22.54 31.9L6.64 16 22.54.1l2.82 2.83L12.3 16l13.07 13.07-2.82 2.83z" />
    </IconBase>
);
