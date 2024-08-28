import { FunctionComponent } from 'react';
import { Root, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { GlobalDataProvider } from '@/globalData';
import { App } from '@/shared/App';
import { createUniversalHistory } from '@/shared/universalHistory';
import * as AdobeLaunch from '@/shared/utils/adobeLaunch';
import { tokenToUrl, urlToToken } from '@/shared/utils/mpHelpers';
import { AppData } from '@/typings/routing';

const history = createUniversalHistory();

if (window.desta?.replaceState) {
  
  history.listen(() => {
    if (window.desta?.replaceState && window?.core_data) {
      window.desta.replaceState(urlToToken(window.location.href));
    }
  });
}

let root: Root;
if (window.addPageStateChangeHandler) {
  
  window.addPageStateChangeHandler((token) => {
    if (root) {
      freeHijackedMetaTags();
      root.unmount();
    }
    history.replace(tokenToUrl(token));
  });
}

interface ClientAppProps {
  global: GlobalData & { init: AppData<any> };
}

const ClientApp: FunctionComponent<ClientAppProps> = ({ global }) => (
  <GlobalDataProvider value={global}>
    <Router history={history}>
      <HelmetProvider>
        <App data={global.init} />
      </HelmetProvider>
    </Router>
  </GlobalDataProvider>
);

let hijackedMetaTags: HTMLElement[] = [];

const hijackMetaTags = () => {
  hijackedMetaTags = Array.from(
    document.head.querySelectorAll(
      'link[rel=canonical],meta[name=description],link[rel=alternate]:not([hreflang=x-default]),#openGraphImage,#openGraphWidth,#openGraphHeight,#openGraphImageType'
    )
  );
  hijackedMetaTags.forEach((tag, index) => {
    const element = tag;
    element.id = String(index);
    element.dataset.rh = 'true';
  });
};

const freeHijackedMetaTags = () => {
  if (hijackedMetaTags && hijackedMetaTags.length) {
    hijackedMetaTags.forEach((tag) => {
      delete tag.dataset.rh;
    });
  }
};

const hydrateFrontpage = () => {
  const globalData = window.page_data.data;
  AdobeLaunch.init({});
  hijackMetaTags();
  root = hydrateRoot(document.getElementById('app'), <ClientApp global={globalData} />);
};
window.hydrateFrontpage = hydrateFrontpage;
hydrateFrontpage();
