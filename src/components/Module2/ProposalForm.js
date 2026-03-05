import React, { useState } from 'react';
import { FaBuilding, FaDollarSign, FaLeaf, FaPlus, FaTimes } from 'react-icons/fa';

const ProposalForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        businessType: '',
        budgetLimit: '',
        preferences: [],
        sustainabilityGoals: []
    });

    const [newPreference, setNewPreference] = useState('');
    const [newGoal, setNewGoal] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addPreference = () => {
        if (newPreference.trim()) {
            setFormData({
                ...formData,
                preferences: [...formData.preferences, newPreference.trim()]
            });
            setNewPreference('');
        }
    };

    const removePreference = (index) => {
        setFormData({
            ...formData,
            preferences: formData.preferences.filter((_, i) => i !== index)
        });
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            setFormData({
                ...formData,
                sustainabilityGoals: [...formData.sustainabilityGoals, newGoal.trim()]
            });
            setNewGoal('');
        }
    };

    const removeGoal = (index) => {
        setFormData({
            ...formData,
            sustainabilityGoals: formData.sustainabilityGoals.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            budgetLimit: parseFloat(formData.budgetLimit)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaBuilding className="inline mr-1 text-green-500" />
                    Business Type *
                </label>
                <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select business type</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Corporate Office">Corporate Office</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="School/University">School/University</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Event Management">Event Management</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaDollarSign className="inline mr-1 text-green-500" />
                    Budget Limit ($) *
                </label>
                <input
                    type="number"
                    name="budgetLimit"
                    value={formData.budgetLimit}
                    onChange={handleChange}
                    required
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="5000"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLeaf className="inline mr-1 text-green-500" />
                    Preferences
                </label>
                <div className="flex space-x-2 mb-2">
                    <input
                        type="text"
                        value={newPreference}
                        onChange={(e) => setNewPreference(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., plastic-free"
                    />
                    <button
                        type="button"
                        onClick={addPreference}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        <FaPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.preferences.map((pref, index) => (
                        <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                            {pref}
                            <button
                                type="button"
                                onClick={() => removePreference(index)}
                                className="ml-2 text-green-600 hover:text-green-800"
                            >
                                <FaTimes />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaLeaf className="inline mr-1 text-green-500" />
                    Sustainability Goals
                </label>
                <div className="flex space-x-2 mb-2">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., zero-waste"
                    />
                    <button
                        type="button"
                        onClick={addGoal}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        <FaPlus />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.sustainabilityGoals.map((goal, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                            {goal}
                            <button
                                type="button"
                                onClick={() => removeGoal(index)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <FaTimes />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                    loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
            >
                {loading ? 'Generating Proposal...' : 'Generate B2B Proposal'}
            </button>
        </form>
    );
};

export default ProposalForm;