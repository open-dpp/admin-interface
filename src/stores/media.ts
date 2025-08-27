import { defineStore } from "pinia";
import axiosIns from "../lib/axios";
import { MEDIA_SERVICE_URL } from "../const";

export type MediaInfo = {
  mimeType?: string;
};

export const useMediaStore = defineStore("media", () => {
  const uploadDppMedia = async (
    organizationId: string | null,
    uuid: string | undefined,
    dataFieldId: string,
    file: File,
    onUploadProgress?: (progress: number) => void,
  ): Promise<string> => {
    if (!organizationId) {
      throw new Error("No organization selected");
    }
    if (!uuid) {
      throw new Error("No UUID provided");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosIns.post(
      `${MEDIA_SERVICE_URL}/media/dpp/${organizationId}/${uuid}/${dataFieldId}`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const total = progressEvent.total ?? 1;
            const progress = Math.round((progressEvent.loaded / total) * 100);
            onUploadProgress(progress);
          }
        },
      },
    );

    if (
      response.status === 201 ||
      response.status === 304 ||
      response.status === 200
    ) {
      return (response.data as { mediaId: string }).mediaId;
    }

    throw new Error(`Unexpected upload status ${response.status}`);
  };

  const getDppMediaInfo = async (
    uuid: string | undefined,
    dataFieldId: string,
  ): Promise<MediaInfo> => {
    if (!uuid) {
      throw new Error("No UUID provided");
    }
    const response = await axiosIns.get(
      `${MEDIA_SERVICE_URL}/media/dpp/${uuid}/${dataFieldId}/info`,
    );
    return response.data as MediaInfo;
  };

  const downloadDppMedia = async (
    uuid: string | undefined,
    dataFieldId: string,
  ): Promise<Blob> => {
    if (!uuid) {
      throw new Error("No UUID provided");
    }
    const response = await axiosIns.get(
      `${MEDIA_SERVICE_URL}/media/dpp/${uuid}/${dataFieldId}/download`,
      { responseType: "blob" },
    );
    return response.data as Blob;
  };

  const fetchDppMedia = async (
    uuid: string | undefined,
    dataFieldId: string,
  ): Promise<{ blob: Blob; contentType?: string }> => {
    const [info, blob] = await Promise.all([
      getDppMediaInfo(uuid, dataFieldId),
      downloadDppMedia(uuid, dataFieldId),
    ]);
    return { blob, contentType: info?.mimeType };
  };

  return {
    uploadDppMedia,
    getDppMediaInfo,
    downloadDppMedia,
    fetchDppMedia,
  };
});
