import { OpenDppApiClient } from "@open-dpp/api-client";
import { API_URL } from "../const.ts";

const apiClient = new OpenDppApiClient({
  baseURL: API_URL,
});

export default apiClient;
