import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateProtocolPayload,
  IGenericResponse,
  UpdateProtocolPayload,
} from "../interfaces";
import { API_ROUTES } from "./routers";

export const protocolApi = createApi({
  reducerPath: "protocolApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["Protocols", "SingleProtocol"],
  endpoints: (builder) => ({
    createProtocol: builder.mutation<IGenericResponse, CreateProtocolPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.CREATE_PROTOCOL,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Protocols"],
    }),
    getAllProtocols: builder.query({
      query: () => `${API_ROUTES.FFETCH_PROTOCOLS}?page=1&limit=100`,
      providesTags: ["Protocols"],
    }),
    updateProtocol: builder.mutation<
      void,
      { protocolId: string; payload: UpdateProtocolPayload }
    >({
      query: (body) => {
        return {
          url: `${API_ROUTES.UPDATE_PROTOCOLS}/${body?.protocolId}`,
          method: "POST",
          body: body?.payload,
        };
      },
      invalidatesTags: ["Protocols"],
    }),
    deleteProtocol: builder.mutation<void, { id: string }>({
      query: (body) => {
        return {
          url: `${API_ROUTES.DELETE_PROTOCOLS}/${body.id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Protocols"],
    }),
    getProtocolById: builder.query<void, { id: string }>({
      query: (body) => `${API_ROUTES.FFETCH_PROTOCOLS}/${body.id}`,
      providesTags: ["SingleProtocol"],
    }),
  }),
});

export const {
  useCreateProtocolMutation,
  useGetAllProtocolsQuery,
  useDeleteProtocolMutation,
  useUpdateProtocolMutation,
} = protocolApi;
