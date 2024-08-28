import React from 'react';
import { FunctionComponent, SVGAttributes } from 'react';
import { IconBase, IconComponent } from './BaseIcon';

type StarFill = 'filled' | 'half-filled' | '';

interface Props extends SVGAttributes<SVGElement> {
    type?: StarFill;
}

export const FilledStar: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M21 26.43a2.13 2.13 0 0 1-1-.25l-6.21-3.26-6.19 3.26a2.15 2.15 0 0 1-3.12-2.27L5.66 17l-5-4.85a2.16 2.16 0 0 1 1.18-3.68l7-1 3.02-6.27A2.12 2.12 0 0 1 13.78 0a2.15 2.15 0 0 1 1.93 1.2l3.1 6.29 6.91 1a2.16 2.16 0 0 1 1.19 3.68l-5 4.89 1.21 6.87a2.14 2.14 0 0 1-.88 2.07 2.18 2.18 0 0 1-1.24.43z"></path>
    </IconBase>
);

export const HalfFilledStar: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M21 26.43a2.13 2.13 0 0 1-1-.25l-6.21-3.26-6.19 3.26a2.15 2.15 0 0 1-3.12-2.27L5.66 17l-5-4.85a2.16 2.16 0 0 1 1.18-3.68l7-1 3.02-6.27A2.12 2.12 0 0 1 13.78 0a2.15 2.15 0 0 1 1.93 1.2l3.1 6.29 6.91 1a2.16 2.16 0 0 1 1.19 3.68l-5 4.89 1.21 6.87a2.14 2.14 0 0 1-.88 2.07 2.18 2.18 0 0 1-1.24.43zm-7.19-5.51a1.91 1.91 0 0 1 .9.23l6.21 3.26a.14.14 0 0 0 .16 0 .12.12 0 0 0 .06-.15l-1.18-6.92a1.94 1.94 0 0 1 .56-1.72l5-4.9a.13.13 0 0 0 0-.15.17.17 0 0 0-.12-.11l-7-1A1.94 1.94 0 0 1 17 8.38l-3.11-6.3a.13.13 0 0 0-.1-.08z"></path>
    </IconBase>
);

export const DefaultStar: IconComponent = (props) => (
    <IconBase {...props}>
        <path d="M21 26.44a2.28 2.28 0 0 1-1-.25l-6.21-3.27-6.2 3.26a2.15 2.15 0 0 1-3.12-2.27L5.66 17l-5-4.85a2.15 2.15 0 0 1 1.18-3.68l7-1 3.02-6.27A2.14 2.14 0 0 1 13.79 0a2.14 2.14 0 0 1 1.93 1.2l3.1 6.3 6.91 1a2.16 2.16 0 0 1 1.19 3.67l-5 4.9 1.2 6.87a2.13 2.13 0 0 1-.86 2.1 2.1 2.1 0 0 1-1.26.4zm-7.19-5.52a2 2 0 0 1 .91.23l6.21 3.27a.14.14 0 0 0 .16 0 .15.15 0 0 0 .06-.14l-1.19-6.92a2 2 0 0 1 .57-1.72l5-4.9a.14.14 0 0 0 0-.16.13.13 0 0 0-.12-.1l-7-1A2 2 0 0 1 17 8.38l-3.1-6.29a.16.16 0 0 0-.28 0l-3.11 6.3a1.94 1.94 0 0 1-1.43 1.05l-6.95 1a.13.13 0 0 0-.12.1.14.14 0 0 0 0 .16l5 4.9a1.94 1.94 0 0 1 .56 1.72l-1.13 6.93a.15.15 0 0 0 .06.15.15.15 0 0 0 .16 0l6.22-3.26a1.91 1.91 0 0 1 .9-.22z"></path>
    </IconBase>
);

export const Star: FunctionComponent<Props> = (props) => {
    switch (props.type){
        case 'filled':
            return <FilledStar {...props} />
        case 'half-filled':
            return <HalfFilledStar {...props} />
        default:
            return <DefaultStar {...props} />
    }
}
