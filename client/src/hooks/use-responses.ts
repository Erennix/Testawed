import { useMutation, useQuery } from "@tanstack/react-query";
import { api, type ResponseInput } from "@shared/routes";

// GET /api/config
export function useConfig() {
  return useQuery({
    queryKey: [api.config.get.path],
    queryFn: async () => {
      const res = await fetch(api.config.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch config");
      return api.config.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/responses
export function useCreateResponse() {
  return useMutation({
    mutationFn: async (data: ResponseInput) => {
      const validated = api.responses.create.input.parse(data);
      const res = await fetch(api.responses.create.path, {
        method: api.responses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.responses.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit response");
      }
      
      return api.responses.create.responses[201].parse(await res.json());
    },
  });
}
