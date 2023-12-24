// import fetch from "node-fetch";

// import { IHeaders } from "../interfaces/headers.interface";
// import AbortController from "abort-controller";
// import { BkashException } from "../exceptions/bkashException";

// interface IPayload {
//   [key: string]: unknown;
// }

// export async function get<T>(
//   url: string,
//   additionalHeaders: IHeaders
// ): Promise<T> {
//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       "content-type": "application/json",
//       Accept: "application/json",
//       ...additionalHeaders,
//     },
//   });
//   const parsed: any = await response.json();
//   if (parsed.errorMessage) throw new BkashException(parsed.errorMessage);
//   return parsed;
// }

// export async function post<T>(
//   url: string,
//   payload: IPayload = {},
//   additionalHeaders: IHeaders
// ): Promise<T> {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => {
//     controller.abort();
//   }, 30 * 1000);
//   const response = await fetch(url, {
//     headers: {
//       "content-type": "application/json",
//       Accept: "application/json",
//       ...additionalHeaders,
//     },
//     body: JSON.stringify(payload),
//     method: "POST",
//     signal: controller.signal,
//   });
//   clearTimeout(timeout);
//   const parsed: any = await response.json();
//   if (parsed.errorMessage) throw new BkashException(parsed.errorMessage);
//   return parsed;
// }
import axios, { AxiosError } from "axios";
import { IHeaders } from "../interfaces/headers.interface";
import { BkashException } from "../exceptions/bkashException";

interface IPayload {
  [key: string]: unknown;
}

// Define an interface that extends T and includes errorMessage
interface ApiResponse<T> {
  errorMessage?: string;
  data: T;
}

export async function get<T>(
  url: string,
  additionalHeaders: IHeaders
): Promise<T> {
  try {
    const response = await axios.get<ApiResponse<T>>(url, {
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        ...additionalHeaders,
      },
    });

    if (response.data.errorMessage) {
      throw new BkashException(response.data.errorMessage);
    }

    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

export async function post<T>(
  url: string,
  payload: IPayload = {},
  additionalHeaders: IHeaders
): Promise<T> {
  try {
    const response = await axios.post<ApiResponse<T>>(url, payload, {
      headers: {
        "content-type": "application/json",
        Accept: "application/json",
        ...additionalHeaders,
      },
      timeout: 30 * 1000,
    });

    if (response.data.errorMessage) {
      throw new BkashException(response.data.errorMessage);
    }

    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

// Helper function to handle Axios errors
function handleAxiosError(error: any): void {
  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError<ApiResponse<any>> = error;
    if (axiosError.response?.data?.errorMessage) {
      console.error("Axios Error:", axiosError.response.data.errorMessage);
    } else {
      console.error("Axios Error:", axiosError.message);
    }
  } else {
    console.error("Error:", error);
  }
}
