import React from 'react';
import { FaCheck, FaTag, FaFilter, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const ProductResult = ({ result }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{result.name}</h3>
                        <p className="text-sm text-gray-600">ID: {result.id}</p>
                    </div>
                    <button
                        onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        className="text-gray-500 hover:text-green-600"
                    >
                        <FaCopy />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Generated: {format(new Date(result.created_at), 'PPpp')}
                </p>
            </div>

            {/* Category */}
            <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-600">Primary Category</p>
                <p className="text-xl font-semibold text-green-700">{result.primary_category}</p>
                {result.sub_category && (
                    <>
                        <p className="text-sm text-gray-600 mt-2">Sub-Category</p>
                        <p className="text-lg text-gray-800">{result.sub_category}</p>
                    </>
                )}
            </div>

            {/* SEO Tags */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                        <FaTag className="inline mr-1" />
                        SEO Tags ({result.seo_tags?.length})
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {result.seo_tags?.map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Sustainability Filters */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">
                        <FaFilter className="inline mr-1" />
                        Sustainability Filters
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {result.sustainability_filters?.map((filter, index) => (
                        <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                            <FaCheck className="mr-1 text-xs" />
                            {filter}
                        </span>
                    ))}
                </div>
            </div>

            {/* JSON Preview */}
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">JSON Output</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ProductResult;