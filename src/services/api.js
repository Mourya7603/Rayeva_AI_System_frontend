import axios from 'axios';
import config from './config';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log('🚀 Making request to:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        
        if (!error.config.url.includes('/health')) {
            let errorMessage = 'An error occurred';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
        
        return Promise.reject(error);
    }
);

// Module 1: Category Generator
export const generateCategory = async (productData) => {
    try {
        const response = await api.post('/products/generate-category', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Module 2: Proposal Generator
export const generateProposal = async (proposalData) => {
    try {
        const response = await api.post('/proposals/generate', proposalData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProposal = async (id) => {
    try {
        const response = await api.get(`/proposals/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listProposals = async () => {
    try {
        const response = await api.get('/proposals');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Prompt Logs - FIXED to handle different response formats
export const getPromptLogs = async () => {
    try {
        const response = await api.get('/prompt-logs');
        console.log('Raw logs response:', response.data);
        
        // Handle different response structures
        let logs = [];
        
        if (response.data && response.data.data) {
            // If response is { success: true, data: [...] }
            logs = response.data.data;
        } else if (Array.isArray(response.data)) {
            // If response is directly an array
            logs = response.data;
        } else if (response.data && typeof response.data === 'object') {
            // If response is an object with logs property
            logs = response.data.logs || response.data.promptLogs || [];
        }
        
        console.log('Processed logs:', logs);
        return { data: logs };
        
    } catch (error) {
        console.error('Error fetching logs:', error);
        return { data: [] };
    }
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        try {
            const response = await axios.get(`${config.API_URL.replace('/api', '')}/health`);
            return response.data;
        } catch (fallbackError) {
            console.log('Health check failed, but continuing...');
            return { 
                status: 'unknown', 
                timestamp: new Date().toISOString(),
                modules: []
            };
        }
    }
};

export default api;