import { useQuery } from '@tanstack/react-query';
import { productAPI, categoryAPI, testimonialAPI } from '../services/api';

/**
 * Hook to fetch all products with filters
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single product
 */
export const useProduct = (idOrSlug) => {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: () => productAPI.getById(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (slug, params = {}) => {
  return useQuery({
    queryKey: ['products', 'category', slug, params],
    queryFn: () => productAPI.getByCategory(slug, params),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productAPI.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single category
 */
export const useCategory = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryAPI.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to fetch testimonials
 */
export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialAPI.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};
