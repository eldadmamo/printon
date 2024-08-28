import { FunctionComponent, ImgHTMLAttributes } from 'react';
import cn from 'classnames';
import { useIsVisibleObserver } from '../../hooks/useIntersectionObserver';
import styles from './LoadingImage.module.scss';
import React from "react";
interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    width: number;
    height: number;
    alt: string;
    className?: string;
    lazy?: boolean;
    srcSetList?: Record<string, string>;
}

export const LoadingImage: FunctionComponent<Props> = ({
                                                           src: imageSrc,
                                                           alt,
                                                           width,
                                                           height,
                                                           className,
                                                           lazy = true,
                                                           srcSetList,
                                                           ...rest
                                                       }) => {
    const [elementRef, isIntersecting] = useIsVisibleObserver();
    const showPlaceholder = !isIntersecting && lazy;
    const dataSrc = showPlaceholder ? imageSrc : undefined;
    const src = showPlaceholder
        ? `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" />`
        : imageSrc;

    return srcSetList ? (
        <picture>
            {srcSetList
                ? Object.entries(srcSetList).map(([media, src]) => (
                    <source key={media} media={media} srcSet={src} />
                ))
                : null}
            <img
                className={cn(styles.img, showPlaceholder && styles.loading, className)}
                data-src={dataSrc}
                ref={elementRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                {...rest}
            />
        </picture>
    ) : (
        <img
            className={cn(styles.img, showPlaceholder && styles.loading, className)}
            data-src={dataSrc}
            ref={elementRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            {...rest}
        />
    );
};
