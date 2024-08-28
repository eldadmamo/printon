import { FunctionComponent } from 'react';
import { CaretLeft, CaretRight } from '../Icons/Caret';
import styles from './Pagination.module.scss';

/**
 * 7 Slots
 * Pages 1-7 show all
 * Pages 8 (1): *1* 2 3 4 5 ... 8
 * Pages 8 (2): 1 *2* 3 4 5 ... 8
 * Pages 8 (3): 1 2 *3* 4 5 ... 8
 * Pages 8 (4): 1 2 3 *4* 5 ... 8
 * Pages 8 (5): 1 ... 4 *5* 6 7 8
 * Pages 8 (6): 1 ... 4 5 *6* 7 8
 * Pages 8 (7): 1 ... 4 5 6 *7* 8
 * Pages 8 (8): 1 ... 4 5 6 7 *8*
 * Pages 9 (4): 1 2 3 *4* 5 ... 9
 * Pages 9 (5): 1 ... 4 *5* 6 ... 9
 * Pages 9 (6): 1 ... 5 *6* 7 8 9
 */

export interface PaginationProps {
    count: number;
    current: number;
    onChange: (page: number) => void;
}

export const Pagination: FunctionComponent<PaginationProps> = ({ count, current, onChange }) => {
    const pageNumbers = [];

    const hasHiddenPages = count > 7;
    const hasLeftEllipsis = hasHiddenPages && current > 4;
    const hasRightEllipsis = hasHiddenPages && current < count - 3;

    if (!hasHiddenPages) {
        for (let page = 2; page < count; page++) {
            pageNumbers.push(page);
        }
    } else if (!hasLeftEllipsis) {
        pageNumbers.push(2, 3, 4, 5);
    } else if (!hasRightEllipsis) {
        pageNumbers.push(count - 4, count - 3, count - 2, count - 1);
    } else {
        pageNumbers.push(current - 1, current, current + 1);
    }

    const filteredPageNumbers = pageNumbers.filter((page) => page > 1 && page < count);

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageLeft}
                disabled={current === 1}
                onClick={() => onChange(current - 1)}
            >
                <CaretLeft />
            </button>
            <button
                className={1 === current ? styles.pageNumberActive : styles.pageNumbers}
                disabled={1 === current}
                onClick={() => onChange(1)}
            >
                {1}
            </button>
            {hasLeftEllipsis && <span className={styles.ellipsis}>...</span>}
            {filteredPageNumbers.map((num) => (
                <button
                    key={num}
                    className={num === current ? styles.pageNumberActive : styles.pageNumbers}
                    disabled={num === current}
                    onClick={() => onChange(num)}
                >
                    {num}
                </button>
            ))}
            {hasRightEllipsis && <span className={styles.ellipsis}>...</span>}
            {count !== 1 && (
                <button
                    className={count === current ? styles.pageNumberActive : styles.pageNumbers}
                    disabled={count === current}
                    onClick={() => onChange(count)}
                >
                    {count}
                </button>
            )}
            <button
                className={styles.pageRight}
                disabled={current === count}
                onClick={() => onChange(current + 1)}
            >
                <CaretRight />
            </button>
        </div>
    );
};
