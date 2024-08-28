import { FunctionComponent } from 'react';
import { LoveTab } from '../Icons/LoveTab';
import styles from './Loader.module.scss';

export const Loader: FunctionComponent = () => (
    <div className={styles.loader}>
        <LoveTab className={styles.loaderIcon} />
    </div>
);
