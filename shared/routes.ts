import { z } from 'zod';
import { insertResponseSchema, responses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  config: {
    get: {
      method: 'GET' as const,
      path: '/api/config',
      responses: {
        200: z.object({
          gifUrl: z.string(),
          question: z.string(),
        }),
      },
    },
  },
  responses: {
    create: {
      method: 'POST' as const,
      path: '/api/responses',
      input: insertResponseSchema,
      responses: {
        201: z.custom<typeof responses.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ResponseInput = z.infer<typeof api.responses.create.input>;
export type AppConfigResponse = z.infer<typeof api.responses.create.responses[201]>;
