import React from 'react';

function Error({ message }) {
    return (
        <div className="alert alert-danger text-center mt-3">
            <strong>Error:</strong> {message || 'Something went wrong!'}
        </div>
    );
}

export default Error;
