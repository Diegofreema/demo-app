import { ProductType } from '@/type';
import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery<ProductType[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://fakestoreapi.com/products?limit=5');
      const data = await response.json();
      return data;
    },
  });
};
export const useSingle = (id: any) => {
  return useQuery<ProductType>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      const data = await response.json();
      return data;
    },
  });
};
