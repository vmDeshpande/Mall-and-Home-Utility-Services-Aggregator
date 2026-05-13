const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const parseJson = async (res: Response) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.msg || data?.error || "Request failed");
  }

  return data;
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    return parseJson(res);
  },
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return parseJson(res);
  },
  updateRole: async (userId: string, role: string) => {
    const res = await fetch(`${BASE_URL}/user/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, role }),
    });

    return parseJson(res);
  },
  completeCustomerOnboarding: async (data: any) => {
    const res = await fetch(`${BASE_URL}/onboarding/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return parseJson(res);
  },
  completeProviderOnboarding: async (data: any) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await fetch(`${BASE_URL}/onboarding/provider`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });

    return parseJson(res);
  },
  getProfile: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/user/${userId}`);
    return parseJson(res);
  },
  updateProfile: async (userId: string, data: any) => {
    const res = await fetch(`${BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return parseJson(res);
  },
  getProvider: async (userId: string) => {
    const res = await fetch(`${BASE_URL}/providers/${userId}`);
    return parseJson(res);
  },
  getProviders: async () => {
    const res = await fetch(`${BASE_URL}/providers`);
    return parseJson(res);
  },
  updateProvider: async (userId: string, data: any) => {
    const payload = {
      ...data,
      services: Array.isArray(data?.services)
        ? data.services.map((service: any) => ({
            ...service,
            serviceId: service.serviceId?._id || service.serviceId,
          }))
        : data?.services,
    };

    const res = await fetch(`${BASE_URL}/providers/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return parseJson(res);
  },
  getServices: async () => {
    const res = await fetch(`${BASE_URL}/services`);
    return parseJson(res);
  },
  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) => {
    const res = await fetch(`${BASE_URL}/user/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        currentPassword,
        newPassword,
      }),
    });

    return parseJson(res);
  },
  createService: async (data: any) => {
    const res = await fetch(`${BASE_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseJson(res);
  },

  updateService: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseJson(res);
  },

  deleteService: async (id: string) => {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      method: "DELETE",
    });
    return parseJson(res);
  },

  verifyProvider: async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/providers/${id}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return parseJson(res);
  },
  createRequest: async (data: any) => {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return parseJson(res);
  },
  getRequests: async (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/requests?${params.toString()}`);

    return parseJson(res);
  },
  getRequest: async (id: string) => {
    const res = await fetch(`${BASE_URL}/requests/${id}`);
    return parseJson(res);
  },
  updateRequestStatus: async (id: string, status: string) => {
    const res = await fetch(`${BASE_URL}/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    return parseJson(res);
  },
  getReviews: async (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${BASE_URL}/reviews?${params.toString()}`);

    return parseJson(res);
  },
  createReview: async (data: any) => {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return parseJson(res);
  },
  getSettings: async () => {
    const res = await fetch(`${BASE_URL}/settings`);
    return parseJson(res);
  },

  updateSettings: async (data: any) => {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return parseJson(res);
  },
  getAnalytics: async () => {
    const res = await fetch(`${BASE_URL}/analytics`);
    return parseJson(res);
  },
};
