import React, {FunctionComponent, useRef} from 'react';
import { LoadingImage} from "../LoadingImage/LoadingImage";
import { IntersectionObserverProvider} from "../../IntersectionObserverContext";

const ParentComponent = () => {



    return (
        <IntersectionObserverProvider>
            <div className="App">
                <h1>Intersection Observer Example</h1>
                <LoadingImage
                    src="https://live.staticflickr.com/7347/13981393678_d4e935a89e_z.jpg"
                    alt="Placeholder Image"
                    width={300}
                    height={300}
                    lazy
                />
            </div>
        </IntersectionObserverProvider>
    );
};

export default ParentComponent;
