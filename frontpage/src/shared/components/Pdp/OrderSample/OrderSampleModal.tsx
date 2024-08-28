import {Fragment, FunctionComponent, useEffect} from "react";
import cn from 'classnames';
import {useGlobalData} from "../../../../globalData";
import {FaqArticle, getFaqUrl} from "../../../utils/faq";
import {getDefaultViewId} from "../../../utils/getDefaultViewId";
import {toggleArrayItem} from "../../../utils/toggleArrayItem";
import {productTypeImageUrl} from "../../../utils/urls";
import {Collapse} from "../../Collapse/Collapse";
import {Info} from "../../Icons/Info";
import {Inline} from "../../Inline/Inline";
import {LoadingImage} from "../../LoadingImage/LoadingImage";
import {Rating} from "../../Rating/Rating";
import {App}