import { mockApi } from './mockApi';
import { realApi } from './realApi';
import type { ApiService } from './api.interface';

// Determine which API to use based on environment variable
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

export const api: ApiService = useMock ? mockApi : realApi;
