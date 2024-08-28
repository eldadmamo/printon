import {FunctionComponent, useMemo} from "react";
import {useGlobalData} from "../../../globalData";
import {useAbTest} from "../../hooks/useAbTest";
import {getPdpPath} from "../../pages/pdp/getPdpPath";
import {pdp as pdpRoute} from '../'