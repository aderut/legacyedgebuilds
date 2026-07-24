import { supabase } from "@/lib/supabase/client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  colors: string[];
  sizes: string[];
  applications: string[];
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content: string[];
};

export const categories = ["Flooring", "Wall Solutions", "Boards", "Furniture Accessories"];

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at");
  if (error) {
    console.error(error);
    return [];
  }
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) return null;
  return data as Product;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from("gallery_items").select("*").order("created_at");
  if (error) {
    console.error(error);
    return [];
  }
  return data as GalleryItem[];
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from("blog_posts").select("*").order("date", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
  if (error) return null;
  return data as BlogPost;
}

export type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
  source: string;
  approved: boolean;
  created_at: string;
};

export async function getApprovedReviews(limit?: number): Promise<Review[]> {
  let query = supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data as Review[];
}
