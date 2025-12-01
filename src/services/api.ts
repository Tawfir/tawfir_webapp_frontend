/**
 * API Service
 * Centralized API client with authentication handling
 */

import { getApiEndpoint, API_CONFIG } from '@/config/api';

export interface ApiResponse<T = any> {
  status: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user data in localStorage
 */
export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem('user');
};

/**
 * Make an API request
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const url = getApiEndpoint(endpoint);

  // Check if body is FormData - if so, don't set Content-Type (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }), // Only set JSON content-type if NOT FormData
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses (like 204 No Content)
    if (response.status === 204) {
      return {
        status: true,
        data: null as any,
        message: 'Success',
      };
    }

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || data.error || 'An error occurred',
        status: response.status,
        data: data.data || null,
      } as ApiError;
    }

    return data;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw {
      message: error.message || 'Network error occurred',
      status: 0,
    } as ApiError;
  }
}

/**
 * API Client methods
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> => {
    // Check if body is FormData
    const isFormData = body instanceof FormData;
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  },

  /**
   * PUT request
   */
  put: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> => {
    // Check if body is FormData
    const isFormData = body instanceof FormData;
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  },

  /**
   * PATCH request
   */
  patch: <T = any>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
  },
};

/**
 * Auth API endpoints
 */
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<{ user: any; token: string }>('/auth/login', {
      email,
      password,
    });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      setUser(response.data.user);
    }
    
    return response;
  },

  register: async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    type?: string;
  }) => {
    const response = await api.post<{ user: any; token: string }>('/auth/register', data);
    
    if (response.data.token) {
      setAuthToken(response.data.token);
      setUser(response.data.user);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      removeAuthToken();
      removeUser();
    }
  },

  getUser: async () => {
    return api.get<{ user: any }>('/auth/user');
  },

  requestPasswordResetCode: async (email: string) => {
    return api.post('/auth/request-password-reset-code', { email });
  },

  checkResetCode: async (email: string, code: string) => {
    return api.post('/auth/check-reset-code', { email, code });
  },

  resetPasswordWithCode: async (email: string, code: string, password: string, password_confirmation: string) => {
    return api.post('/auth/reset-password-with-code', {
      email,
      code,
      password,
      password_confirmation,
    });
  },

  updateProfile: async (data: { name?: string; phone?: string }) => {
    return api.put<{ user: any }>('/auth/update-profile', data);
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return api.post('/auth/password/update', {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

/**
 * Restaurant API endpoints
 */
export const restaurantApi = {
  getRestaurant: async (id?: number) => {
    const endpoint = id ? `/restaurant/${id}` : '/restaurant';
    return api.get(endpoint);
  },

  createRestaurant: async (data: {
    restaurant_name: string;
    address: string;
    lat: number;
    lng: number;
    public_phone?: string;
    private_phone?: string;
    working_hours?: any;
    food_category_ids?: number[];
  }) => {
    return api.post('/restaurant', data);
  },

  updateRestaurant: async (data: {
    restaurant_name?: string;
    address?: string;
    lat?: number;
    lng?: number;
    public_phone?: string;
    private_phone?: string;
    working_hours?: any;
    food_category_ids?: number[];
    profile_pic?: File;
    cover_image?: File;
    place_pics?: File[];
  }) => {
    const formData = new FormData();
    if (data.restaurant_name) formData.append('restaurant_name', data.restaurant_name);
    if (data.address) formData.append('address', data.address);
    if (data.lat !== undefined) formData.append('lat', data.lat.toString());
    if (data.lng !== undefined) formData.append('lng', data.lng.toString());
    if (data.public_phone) formData.append('public_phone', data.public_phone);
    if (data.private_phone) formData.append('private_phone', data.private_phone);
    if (data.working_hours) formData.append('working_hours', JSON.stringify(data.working_hours));
    if (data.food_category_ids) formData.append('food_category_ids', JSON.stringify(data.food_category_ids));
    if (data.profile_pic) formData.append('profile_pic', data.profile_pic);
    if (data.cover_image) formData.append('cover_image', data.cover_image);
    if (data.place_pics && data.place_pics.length > 0) {
      data.place_pics.forEach((file) => {
        formData.append('place_pics', file);
      });
    }
    return api.put('/restaurant', formData);
  },

  getDishes: async () => {
    return api.get('/restaurant/dishes');
  },

  getDish: async (id: number) => {
    return api.get(`/restaurant/dishes/${id}`);
  },

  createDish: async (data: {
    name: string;
    price: number;
    discounted_price?: number;
    co2_saved?: number;
    description?: string;
    pickup_time?: string;
    availability_method?: string;
    quantity: number;
    food_category_ids: number[];
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    if (data.discounted_price !== undefined) formData.append('discounted_price', data.discounted_price.toString());
    if (data.co2_saved !== undefined) formData.append('co2_saved', data.co2_saved.toString());
    if (data.description) formData.append('description', data.description);
    if (data.pickup_time) formData.append('pickup_time', data.pickup_time);
    if (data.availability_method) formData.append('availability_method', data.availability_method);
    formData.append('quantity', data.quantity.toString());
    formData.append('food_category_ids', JSON.stringify(data.food_category_ids));
    if (data.image) formData.append('image', data.image);
    return api.post('/restaurant/dishes', formData);
  },

  updateDish: async (id: number, data: {
    name?: string;
    price?: number;
    discounted_price?: number;
    co2_saved?: number;
    description?: string;
    pickup_time?: string;
    availability_method?: string;
    quantity?: number;
    food_category_ids?: number[];
    image?: File;
  }) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.discounted_price !== undefined) formData.append('discounted_price', data.discounted_price.toString());
    if (data.co2_saved !== undefined) formData.append('co2_saved', data.co2_saved.toString());
    if (data.description) formData.append('description', data.description);
    if (data.pickup_time) formData.append('pickup_time', data.pickup_time);
    if (data.availability_method) formData.append('availability_method', data.availability_method);
    if (data.quantity !== undefined) formData.append('quantity', data.quantity.toString());
    if (data.food_category_ids) formData.append('food_category_ids', JSON.stringify(data.food_category_ids));
    if (data.image) formData.append('image', data.image);
    return api.put(`/restaurant/dishes/${id}`, formData);
  },

  deleteDish: async (id: number) => {
    return api.delete(`/restaurant/dishes/${id}`);
  },

  deleteDishImage: async (id: number) => {
    return api.delete(`/restaurant/dishes/${id}/image`);
  },

  deleteProfilePic: async () => {
    return api.delete('/restaurant/profile-pic');
  },

  deleteCoverImage: async () => {
    return api.delete('/restaurant/cover-image');
  },

  deletePlacePic: async (index: number) => {
    return api.delete(`/restaurant/place-pics/${index}`);
  },

  getOrders: async () => {
    return api.get('/restaurant/orders');
  },

  getOrder: async (id: number) => {
    return api.get(`/restaurant/orders/${id}`);
  },

  getChartData: async (type: 'co2' | 'orders') => {
    return api.get(`/restaurant/stats/chart?type=${type}`);
  },

  updateOrderStatus: async (id: number, status: 'incoming' | 'ready' | 'completed' | 'cancelled') => {
    return api.put(`/restaurant/orders/${id}/status`, { status });
  },

  getWalletBalance: async () => {
    return api.get('/restaurant/wallet');
  },

  getWalletTransactions: async () => {
    return api.get('/restaurant/wallet/transactions');
  },

  requestWithdrawal: async () => {
    return api.post('/restaurant/wallet/withdrawals');
  },

  markTransactionPaid: async (id: number) => {
    return api.patch(`/restaurant/transactions/${id}/paid`);
  },
};

/**
 * Admin API endpoints
 */
export const adminApi = {
  getAdmin: async () => {
    return api.get('/admin');
  },

  getRestaurants: async () => {
    return api.get('/admin/restaurants');
  },

  getOrders: async () => {
    return api.get('/admin/orders');
  },

  getWithdrawals: async () => {
    return api.get('/admin/withdrawals');
  },

  getCategories: async () => {
    return api.get('/admin/categories');
  },

  getCategory: async (id: number) => {
    return api.get(`/admin/categories/${id}`);
  },

  createCategory: async (data: {
    name: string;
    slug?: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.image) formData.append('image', data.image);
    return api.post('/admin/categories', formData);
  },

  updateCategory: async (id: number, data: {
    name?: string;
    slug?: string;
    image?: File;
  }) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.image) formData.append('image', data.image);
    return api.put(`/admin/categories/${id}`, formData);
  },

  deleteCategoryImage: async (id: number) => {
    return api.delete(`/admin/categories/${id}/image`);
  },

  getStats: async () => {
    return api.get('/admin/stats');
  },

  getChartData: async (type: 'co2' | 'orders') => {
    return api.get(`/admin/stats/chart?type=${type}`);
  },
};

/**
 * User API endpoints (for restaurant users browsing)
 */
export const userApi = {
  getHome: async () => {
    return api.get('/user/home');
  },

  search: async (query: string, lat?: number, lng?: number) => {
    const params = new URLSearchParams({ q: query });
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    return api.get(`/user/home/search?${params.toString()}`);
  },

  getCategories: async () => {
    return api.get('/user/categories');
  },

  getCategoryDishes: async (id: number, lat?: number, lng?: number) => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    const query = params.toString();
    return api.get(`/user/categories/${id}/dishes${query ? `?${query}` : ''}`);
  },

  getDishDetails: async (id: number) => {
    return api.get(`/user/dishes/${id}`);
  },

  getRestaurantDetails: async (id: number) => {
    return api.get(`/user/restaurants/${id}`);
  },

  getFeaturedRestaurants: async () => {
    return api.get('/user/restaurants/featured');
  },

  getCart: async () => {
    return api.get('/user/cart');
  },

  addToCart: async (dishId: number, quantity: number) => {
    return api.post('/user/cart/add', { dish_id: dishId, quantity });
  },

  removeFromCart: async (dishId: number) => {
    return api.post('/user/cart/remove', { dish_id: dishId });
  },

  flushCart: async () => {
    return api.post('/user/cart/flush');
  },

  getOrders: async () => {
    return api.get('/user/orders');
  },

  getOrderDetails: async (id: number) => {
    return api.get(`/user/orders/${id}`);
  },

  cancelOrder: async (id: number) => {
    return api.post(`/user/orders/${id}/cancel`);
  },

  getNotifications: async (page: number = 1, perPage: number = 10) => {
    return api.get(`/user/notifications?page=${page}&per_page=${perPage}`);
  },

  markNotificationAsRead: async (id: string) => {
    return api.patch(`/user/notifications/${id}/read`);
  },

  getUnreadCount: async () => {
    return api.get('/user/notifications/unread-count');
  },
};

/**
 * Payment API endpoints
 */
export const paymentApi = {
  checkout: async (paymentMethod: 'stripe' | 'cash') => {
    return api.post('/payment/checkout', { payment_method: paymentMethod });
  },
};

