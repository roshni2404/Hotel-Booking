import React, { useState } from 'react';
import { HashLoader } from "react-spinners";

function Loader() {
    let [loading, setloading] = useState(true);

    return (
        <div style={{ marginTop: '150px' }}>

            <div className="sweet loading text-center">
                <HashLoader color='#000' loading={loading} css='' size={80} />
            </div>
        </div>








    );
}

export default Loader;
