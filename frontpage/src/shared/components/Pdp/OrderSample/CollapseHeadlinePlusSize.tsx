import React from "react";
import {FunctionComponent} from "react";
import {useGlobalData} from "../../../../globalData";
import styles from './CollapseHeadlinePlusSize.module.scss';

interface CollapseHeadlinePlusSizeProps {
    productType: DesignerApiProductType;
}

export const CollapseHeadlinePlusSize: FunctionComponent<CollapseHeadlinePlusSizeProps> = ({
                                                                                               productType,
                                                                                           }) => {
    const {t} = useGlobalData();
    return (
        <div>
            <strong>{t('sizePanel.sizeInfo')}</strong>
            {productType.sizes.length !== 1 && (
                <p className={styles.sizeFit}>
                    <strong>{`${t('sizePanel.sizeFitHint.fit')}: `}</strong>
                    {t(`sizePanel.sizeFitHint.${productType.sizeFitHintId}`)}
                </p>
            )}
        </div>
    )
}