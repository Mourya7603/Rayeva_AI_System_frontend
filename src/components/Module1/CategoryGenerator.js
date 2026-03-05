import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import ProductForm from './ProductForm';
import ProductResult from './ProductResult';
import { generateCategory } from '../../services/api';
import Loader from '../Common/Loader';
import { FaTag, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoryGenerator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (productData) => {
        setLoading(true);
        try {
            const response = await generateCategory(productData);
            if (response.success) {
                setResult(response.data);
                toast.success('Categories generated successfully!');
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
                        <FaTag className="mr-3 text-green-600" />
                        AI Auto-Category & Tag Generator
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Automatically categorize products and generate SEO tags with sustainability filters
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
                    <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                    <ProductForm onSubmit={handleSubmit} loading={loading} />
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Generated Results</h2>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader size="large" />
                        </div>
                    ) : result ? (
                        <ProductResult result={result} />
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <p>Enter product details to generate categories and tags</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Info */}
            <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3">Module Features:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        'Auto-assign primary category',
                        'Suggest sub-category',
                        'Generate 5-10 SEO tags',
                        'Suggest sustainability filters',
                        'Structured JSON output',
                        'Database storage',
                        'Prompt logging',
                        'Error handling'
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

export default CategoryGenerator;