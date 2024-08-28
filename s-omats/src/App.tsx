import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

const ComplementaryProducts = lazy(
    () =>
        import(
            /* webpackChunkName: 'complementary-products', webpackPrefetch: true */ 'frontpage/Header'
            )
);
import Header from "frontpage/Header";
import Footer from "frontpage/Footer";
const App = () => (
    <div className="container">
        <Suspense>
            <ComplementaryProducts />
        </Suspense>
        <Header/>
        <div className="my-10">
            Framework: Suprise
        </div>
        <Footer/>
    </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)