import React from 'react';
import { AnchorHTMLAttributes, ForwardRefRenderFunction, forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export type LinkProps = RouterLinkProps;

const LinkWithRef: ForwardRefRenderFunction<HTMLAnchorElement, LinkProps> = (
    { to, target = '_self', ...rest },
    ref
) => <RouterLink ref={ref} to={to} target={target} {...rest} />;

export const Link = forwardRef(LinkWithRef);

let mpHandleLink: (link: HTMLAnchorElement) => void = () => {};
if (__BROWSER__ && window.desta?.handleLinks) {
    // window.sprd.handleLinks is a mp method which allows a link to be used to navigate the mp SPA
    // it is important that a link is only 'handled' once or the click event listeners will stack
    const handledLinks = new WeakSet(document.getElementById('app').getElementsByTagName('a'));
    mpHandleLink = (link: HTMLAnchorElement) => {
        if (!handledLinks.has(link) && window.desta?.handleLinks) {
            handledLinks.add(link);
            window.desta.handleLinks(link.parentElement);
        }
    };
}

export type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
const ExternalLinkWithRef: ForwardRefRenderFunction<HTMLAnchorElement, ExternalLinkProps> = (
    { href, children, ...linkProps },
    ref
) => {
    const updateRef = (element: HTMLAnchorElement) => {
        if (element) {
            if (process.env.NODE_ENV !== 'production') {
                const links = element.parentElement.getElementsByTagName('a');
                if (links.length !== 1) {
                    console.error(
                        `ExternalLink should call window.sprd.handleLinks with only one link but ${links.length} found.`,
                        links
                    );
                }
            }

            mpHandleLink(element);
        }

        if (typeof ref === 'function') {
            ref(element);
        } else if (ref) {
            ref.current = element;
        }
    };

    return (
        // key is required so we have a new link element for every href
        // and handleLinks can be called safely again
        <a key={href} href={href} ref={updateRef} {...linkProps}>
            {children}
        </a>
    );
};

export const ExternalLink = forwardRef(ExternalLinkWithRef);
