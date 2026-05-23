import React from "react";
import dynamic from "next/dynamic";
import Footer from "@/components/footer/Footer";

const FoodGrid = dynamic(() => import("@/components/food-grid/FoodGrid"), {
  ssr: false, // Set to false if you want to disable server-side rendering for this component
  loading: () => (
    <div className="flex justify-center text-center h-screen text-black text-2xl">
      Loading...
    </div>
  ),
});

const FoodItems = () => {
  return (
    <>
      <FoodGrid />
      <Footer />
    </>
  );
};

export default FoodItems;
