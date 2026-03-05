import React, { useState, useEffect } from 'react';
import { FaHistory, FaEye, FaTimes } from 'react-icons/fa';
import { getPromptLogs } from '../../services/api';
import Loader from './Loader';
import ErrorAlert from './ErrorAlert';
import { format } from 'date-fns';

const PromptLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await getPromptLogs();
            setLogs(response.data || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch prompt logs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getModuleColor = (module) => {
        switch (module) {
            case 'category-tag-generator':
                return 'bg-blue-100 text-blue-800';
            case 'b2b-proposal-generator':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getModuleIcon = (module) => {
        switch (module) {
            case 'category-tag-generator':
                return '🏷️';
            case 'b2b-proposal-generator':
                return '📊';
            default:
                return '🤖';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader size="large" />
            </div>
        );
    }

    if (error) {
        return <ErrorAlert message={error} onRetry={fetchLogs} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FaHistory className="mr-3 text-green-600" />
                        AI Prompt Logs
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track all AI interactions for transparency and debugging
                    </p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Refresh
                </button>
            </div>

            {logs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                    <p className="text-gray-500">No logs found. Generate some AI content first!</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prompt Preview
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log._id || log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.timestamp ? format(new Date(log.timestamp), 'PPpp') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getModuleColor(log.module)}`}>
                                                {getModuleIcon(log.module)} {log.module}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-md truncate">
                                                {log.prompt?.substring(0, 100)}...
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                log.response?.success 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {log.response?.success ? '✅ Success' : '❌ Failed'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="text-green-600 hover:text-green-900 mr-3"
                                            >
                                                <FaEye />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold">Prompt Details</h2>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Module</p>
                                    <p className="mt-1">
                                        <span className={`px-2 py-1 text-sm rounded-full ${getModuleColor(selectedLog.module)}`}>
                                            {selectedLog.module}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Timestamp</p>
                                    <p className="mt-1">
                                        {selectedLog.timestamp ? format(new Date(selectedLog.timestamp), 'PPPPpppp') : 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Prompt</p>
                                    <pre className="mt-2 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                        {selectedLog.prompt || 'No prompt available'}
                                    </pre>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Response</p>
                                    <pre className="mt-2 bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                                        {JSON.stringify(selectedLog.response, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptLogs;