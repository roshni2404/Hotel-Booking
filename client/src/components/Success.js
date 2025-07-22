import React from 'react';

function Success({ message }) {
    return (
        <div className="alert alert-success text-center mt-3">
            <strong>Success:</strong> {message || 'Operation completed successfully!'}
        </div>
    );
}

export default Success;
