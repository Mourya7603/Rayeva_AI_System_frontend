import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const ErrorAlert = ({ message, onRetry }) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
                <FaExclamationCircle className="text-red-500 mr-3" />
                <p className="text-red-700">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorAlert;