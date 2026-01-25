import { mockApi } from './mockApi';
import { realApi } from './realApi';


// Determine which API to use based on environment variable
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Export the selected API implementation
export const api = useMock ? mockApi : realApi;
