import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ProposalForm from './ProposalForm';
import ProposalResult from './ProposalResult';
import { generateProposal } from '../../services/api';
import Loader from '../Common/Loader';
import { FaFileAlt, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProposalGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (proposalData) => {
        setLoading(true);
        try {
            const response = await generateProposal(proposalData);
            if (response.success) {
                setResult(response.data);
                toast.success('Proposal generated successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                        <FaFileAlt className="mr-3 text-green-600" />
                        AI B2B Proposal Generator
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Generate sustainable product mixes with budget allocation and impact analysis
                    </p>
                </div>
                <button
                    onClick={() => navigate('/logs')}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                    <FaHistory />
                    <span>View Logs</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Proposal Details</h2>
                    <ProposalForm onSubmit={handleSubmit} loading={loading} />
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Generated Proposal</h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader size="large" />
                        </div>
                    ) : result ? (
                        <ProposalResult result={result} />
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <p>Enter business details to generate a proposal</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Info */}
            <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Module Features:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        'Suggested sustainable product mix',
                        'Budget allocation within limit',
                        'Estimated cost breakdown',
                        'Impact positioning summary',
                        'Budget validation',
                        'Structured JSON output',
                        'Database storage',
                        'Prompt logging'
                    ].map((feature, index) => (
                        <div key={index} className="flex items-center text-green-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProposalGenerator;