import { api } from '../../app/api';

// Inject roles endpoints into the central base API
export const roleApi = api.injectEndpoints({
  endpoints: () => ({
    // Endpoints will be added here later
  }),
  overrideExisting: false,
});
