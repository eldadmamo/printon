import React from "react";
import {CSSProperties,Children,FunctionComponent,ReactNode} from "react";
import styles from './Tiles.module.scss';

const getWidthFromColumns = (columns: number) => `${(1 / columns) * 100}%`;

interface TileProps {
    space?: number;
    columns: number;
    columnsXsMobile?: number;
    columnsMobile?: number;
    columnsTablet?: number;
    columnsDesktop?: number;
    children: ReactNode;
}

export const Tiles: FunctionComponent<TileProps> = ({
    space = 0,
    columns,
    columnsXsMobile,
    columnsMobile,
    columnsTablet,
    columnsDesktop,
    children
                                                    }) => {
    const widthDefault = getWidthFromColumns(columns);
    const widthXsMobile = columnsXsMobile ? getWidthFromColumns(columnsXsMobile) : widthDefault;
    const widthMobile = columnsMobile ? getWidthFromColumns(columnsMobile): widthDefault;
    const widthTablet = columnsTablet ? getWidthFromColumns(columnsTablet) : widthMobile;
    const widthDesktop = columnsDesktop ? getWidthFromColumns(columnsDesktop) : widthTablet;

    return (
        <ol
        className={styles.tilesBox}
        style={
            {
                '--space': space,
                '--widthDefault': widthDefault,
                '--widthXsMobile': widthXsMobile,
                '--widthMobile': widthMobile,
                '--widthTablet': widthTablet,
                '--widthDesktop': widthDesktop,
            } as CSSProperties
        }
        >
            {
                Children.map(children,(child) => (
                    <li className={styles.tilesListItem}>{child}</li>
                ))
            }
        </ol>
    )
}