import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import Header from "./Header";
import Footer from "./Footer";
import {Truck} from "./shared/components/Icons/Truck";
import ParentComponent from "./shared/components/Input/ParentComponent";
const App = () => (
  <div className="container">

    <Header/>
      <Truck/>
      <ParentComponent/>
    <div className="my-10">
        Framework: react
    </div>
    <Footer/>
  </div>
)
const rootElement = document.getElementById('app')
if (!rootElement) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement as HTMLElement)

root.render(<App />)