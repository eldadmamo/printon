import {Fragment, FunctionComponent, createElement} from "react";
import cn from 'classnames';
import {useGlobalData} from "../../../globalData";
import {Star} from "../Icons/Star";
import {Text} from "../Text/Text";
import styles from './Rating.module.scss';
import React from "react";

const stars = new Array(5).fill(0);

const getType = (rating: number, index: number) => {
    if(rating >= index + 1){
        return 'filled'
    }

    if(rating > index){
        return 'half-filled';
    }

    return '';
}

interface Props {
    rating: number;
    count?: number;
    showAverage?: boolean;
    showStarsOnly?: boolean;
    inline?: boolean;
    underlineCount?: boolean;
}

export const Rating: FunctionComponent<Props> = ({
    rating,
    count,
    showAverage,
    showStarsOnly,
    inline,
    underlineCount
                                                 }) => {
    const {t} = useGlobalData();
    return createElement(
        inline ? 'span' : 'div',
        {
            className: styles.rating,
            title: t('assortment.list.ratingLabel', String(rating), String(count)),
        },
        <Fragment>
            {stars.map((_,index) => (
                <Star
                className={styles.star}
                type={getType(rating,index)}
                key={index}
                aria-hidden="true"
                />
            ))}
            {showAverage && <strong className={styles.average}>{String(rating)}</strong>}
            {!showStarsOnly && (
                <Text size="xxsmall" aria-hidden="true" className={cn(underlineCount && styles.count)}>
                    ({count})
                </Text>
            )}
        </Fragment>
    )
}