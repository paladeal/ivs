"use client";
import { Header } from "./_components/Header";
import { AIChatMock } from "./_components/AIChatMock";
import React, { useState } from "react";
import { ProductDetail } from "./_components/ProductDetail";
import { AIChatButton } from "./_components/AIChatButton";
import { ProductList } from "./_components/ProductList";
import { Product } from "./_types/Product";
import { useFetch } from "@/app/_hooks/useFetch";

export default function Products() {
  const { data,error } = useFetch<{products:Product[]}>("/api/products")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };
  const handleChatOpen = () => {
    setIsChatOpen(true);
    alert("AIアバター店員とのチャットを開始します！(モック)");
  };
  if(!data) return <div className="text-center py-12">読み込み中...</div>
  if(error) return <div className="text-center py-12 text-red-600">エラーが発生しました: {error.message}</div>
  return (
    <div
      className="bg-gray-50 min-h-screen pt-20"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Header />
      <ProductList
        products={data.products}
        onProductClick={handleProductClick}
      />
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseProductDetail}
        />
      )}
      <AIChatButton onChatOpen={handleChatOpen} />
      {isChatOpen && <AIChatMock setIsChatOpen={setIsChatOpen} />}
    </div>
  );
}
