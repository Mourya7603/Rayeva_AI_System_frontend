import React from 'react';
import { FaLeaf, FaDollarSign, FaChartBar, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const ProposalResult = ({ result }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    // Prepare data for charts
    const budgetData = result.budget_allocation ? [
        { name: 'Used', value: result.budget_allocation.total_cost },
        { name: 'Remaining', value: result.budget_allocation.remaining_budget }
    ] : [];

    const productData = result.product_mix?.map(item => ({
        name: item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name,
        cost: item.total_price
    })) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">Proposal #{result.id?.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">{result.business_type}</p>
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

            {/* Budget Allocation */}
            {result.budget_allocation && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Total Cost</p>
                        <p className="text-xl font-bold text-green-700">
                            ${result.budget_allocation.total_cost}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Remaining</p>
                        <p className="text-xl font-bold text-blue-700">
                            ${result.budget_allocation.remaining_budget}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Utilization</p>
                        <p className="text-xl font-bold text-purple-700">
                            {result.budget_allocation.utilization_percentage}%
                        </p>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
                {/* Budget Pie Chart */}
                <div className="h-48">
                    <p className="text-sm font-medium mb-2">Budget Allocation</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={budgetData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={60}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label
                            >
                                {budgetData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Costs Bar Chart */}
                <div className="h-48">
                    <p className="text-sm font-medium mb-2">Product Costs</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cost" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Product Mix */}
            <div>
                <p className="text-sm font-medium mb-2">Product Mix</p>
                <div className="space-y-3">
                    {result.product_mix?.map((item, index) => (
                        <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity} × ${item.unit_price}
                                    </p>
                                </div>
                                <p className="font-semibold text-green-600">${item.total_price}</p>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.sustainability_features?.map((feature, i) => (
                                    <span
                                        key={i}
                                        className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                                    >
                                        <FaCheck className="inline mr-1 text-xs" />
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cost Breakdown */}
            {result.cost_breakdown && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-3">Cost Breakdown</p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Products:</span>
                            <span className="font-medium">${result.cost_breakdown.products_cost}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping (est.):</span>
                            <span>${result.cost_breakdown.shipping_estimate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes (est.):</span>
                            <span>${result.cost_breakdown.taxes_estimate}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total:</span>
                            <span className="text-green-600">${result.cost_breakdown.total}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Impact Summary */}
            {result.impact_summary && (
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2 flex items-center">
                        <FaLeaf className="mr-2 text-green-600" />
                        Impact Summary
                    </p>
                    <p className="text-gray-700">{result.impact_summary}</p>
                </div>
            )}

            {/* Sustainability Highlights */}
            {result.sustainability_highlights && (
                <div>
                    <p className="text-sm font-medium mb-2">Sustainability Highlights</p>
                    <div className="space-y-2">
                        {result.sustainability_highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start">
                                <FaCheck className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                                <span className="text-gray-700">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalResult;