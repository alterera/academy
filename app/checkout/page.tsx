import { redirect } from "next/navigation";

export default function CheckoutPage() {
  // Redirect to courses if no course slug provided
  redirect("/courses");
}
