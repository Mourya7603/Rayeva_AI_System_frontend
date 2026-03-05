import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaFileAlt, FaHistory, FaLeaf, FaCheckCircle } from 'react-icons/fa';
import { healthCheck, getPromptLogs } from '../../services/api';
import Loader from '../Common/Loader';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const [health, setHealth] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        successful: 0,
        successRate: 0,
        categoryCount: 0,
        proposalCount: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [healthData, logsData] = await Promise.all([
                healthCheck(),
                getPromptLogs()
            ]);
            
            setHealth(healthData);
            
            // Process logs data
            const processedLogs = logsData.data || [];
            setLogs(processedLogs);
            
            // Calculate stats
            const total = processedLogs.length;
            const successful = processedLogs.filter(log => {
                // Check different possible success indicators
                return log.response?.success === true || 
                       log.status === 'success' ||
                       log.success === true;
            }).length;
            
            const categoryCount = processedLogs.filter(log => 
                log.module === 'category-tag-generator' || 
                log.module?.includes('category')
            ).length;
            
            const proposalCount = processedLogs.filter(log => 
                log.module === 'b2b-proposal-generator' || 
                log.module?.includes('proposal')
            ).length;
            
            const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;
            
            setStats({
                total,
                successful,
                successRate,
                categoryCount,
                proposalCount
            });
            
            console.log('Dashboard Stats:', {
                total,
                successful,
                successRate,
                categoryCount,
                proposalCount,
                logs: processedLogs
            });
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Prepare chart data
    const moduleStats = {
        'Category Generator': stats.categoryCount,
        'Proposal Generator': stats.proposalCount
    };

    const pieData = Object.entries(moduleStats)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));

    const COLORS = ['#10B981', '#3B82F6'];

    // Time series data (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const timeSeriesData = last7Days.map(date => {
        const count = logs.filter(log => {
            const logDate = log.timestamp ? new Date(log.timestamp).toISOString().split('T')[0] : null;
            return logDate === date;
        }).length;
        return { date, requests: count };
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to Rayeva AI System for Sustainable Commerce</p>
            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Requests</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaHistory className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Success Rate</p>
                            <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaCheckCircle className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Categories Generated</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.categoryCount}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaTag className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Proposals Generated</p>
                            <p className="text-3xl font-bold text-gray-800">{stats.proposalCount}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <FaFileAlt className="text-orange-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts - Only show if there's data */}
            {stats.total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Request Timeline (Last 7 Days)</h2>
                        <div className="h-64" style={{ minHeight: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={timeSeriesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Area 
                                        type="monotone" 
                                        dataKey="requests" 
                                        stroke="#10B981" 
                                        fill="#10B981" 
                                        fillOpacity={0.3} 
                                        name="Requests"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Module Distribution</h2>
                        <div className="h-64" style={{ minHeight: '250px' }}>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => 
                                                `${name}: ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No module data available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Module Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/module1">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-green-600 p-3 rounded-full">
                                <FaTag className="text-white text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-bold text-gray-800">Module 1</h2>
                                <p className="text-gray-600">AI Auto-Category & Tag Generator</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Automatically categorize products and generate SEO tags with sustainability filters
                        </p>
                        <div className="flex items-center text-green-600">
                            <span>Access Module</span>
                            <span className="ml-2">→</span>
                        </div>
                    </div>
                </Link>

                <Link to="/module2">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-600 p-3 rounded-full">
                                <FaFileAlt className="text-white text-2xl" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-bold text-gray-800">Module 2</h2>
                                <p className="text-gray-600">AI B2B Proposal Generator</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Generate sustainable product mixes with budget allocation and impact analysis
                        </p>
                        <div className="flex items-center text-blue-600">
                            <span>Access Module</span>
                            <span className="ml-2">→</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* System Status */}
            {health && health.status !== 'unknown' && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">System Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 ${health.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'} rounded-full mr-2`}></span>
                            <span>Server: {health.status}</span>
                        </div>
                        <div className="flex items-center">
                            <FaLeaf className="text-green-600 mr-2" />
                            <span>Active Modules: {health.modules?.join(', ') || 'None'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;