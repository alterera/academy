import { create } from "zustand";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage?: string;
  price?: string;
  chapters: number;
  assessments: number;
  videos: number;
  days: number;
}

interface CheckoutState {
  course: Course | null;
  setCourse: (course: Course | null) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  course: null,
  setCourse: (course) => set({ course }),
  clearCheckout: () => set({ course: null }),
}));

