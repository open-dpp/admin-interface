import { OpenDppApiClient } from "@open-dpp/api-client";
import { config } from "../const";

const apiClient = new OpenDppApiClient({
  baseURL: config.API_URL,
});

export default apiClient;
