import { FunctionComponent, ReactNode, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { Button } from '../Button/Button';
import { Close } from '../Icons/Close';
import styles from './Modal.module.scss';

const PORTAL_ID = 'frontpage-portal';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    bottomButtons?: ReactNode;
    className?: string;
    headerClassName?: string;
    title?: string;
    children: ReactNode;
}

export const { landScape, zoom } = styles;

export const Modal: FunctionComponent<ModalProps> = ({
                                                         open,
                                                         onClose,
                                                         bottomButtons,
                                                         className,
                                                         headerClassName,
                                                         title,
                                                         children,
                                                     }) => {
    const portalElement = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        window.sprd?.allowScrolling?.();
        onClose();
    }, [onClose]);

    useEffect(() => {
        const keypressHandler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', keypressHandler);
        return () => {
            window.removeEventListener('keydown', keypressHandler);
        };
    }, [handleClose]);

    useEffect(() => {
        if (open) {
            window.sprd?.preventScrolling?.();

            return () => {
                window.sprd?.allowScrolling?.();
            };
        }
    }, [open]);

    if (__SERVER__) {
        return null;
    }

    if (!portalElement.current) {
        const portal = document.getElementById(PORTAL_ID);
        if (portal) {
            portalElement.current = portal as HTMLDivElement;
        } else {
            const element = document.createElement('div');
            element.id = PORTAL_ID;
            document.body.appendChild(element);
            portalElement.current = element;
        }
    }

    return ReactDOM.createPortal(
        <CSSTransition in={open} appear mountOnEnter unmountOnExit timeout={200}>
            <div className={cn(styles.outerBox, className)}>
                {/* close on background is a comfort option for mouse users, the same can be achieved by interacting with the close button */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div className={styles.overlayBackground} onClick={handleClose} />
                <div className={styles.overlayMain}>
                    <Button onClick={handleClose} className={styles.overlayClose}>
                        <Close width="1.25rem" height="1.25rem" />
                    </Button>
                    <div className={cn(styles.overlayHeader, headerClassName)}>
                        {title && <span className={styles.title}>{title}</span>}
                        <Button onClick={handleClose} className={styles.closeButton}>
                            <Close width="0.75rem" height="0.75rem" />
                        </Button>
                    </div>
                    <div className={styles.overlayContent}>{children}</div>
                    {bottomButtons && <div className={styles.bottomButtons}>{bottomButtons}</div>}
                </div>
            </div>
        </CSSTransition>,
        portalElement.current
    );
};
