"use client";
import { Header } from "./_components/Header";
import { AIChatMock } from "./_components/AIChatMock";
import React, { useState } from "react";
import { ProductDetail } from "./_components/ProductDetail";
import { AIChatButton } from "./_components/AIChatButton";
import { ProductList } from "./_components/ProductList";
import { Product } from "./_types/Product";
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "手作り陶器マグ",
    description: "職人が一つ一つ丁寧に作り上げた、素朴で温かみのある陶器マグカップです。日々のコーヒータイムを特別なものに。",
    price: "¥3,500",
    imageUrl: "https://picsum.photos/400/300?random=1",
    details: "素材: 陶器, サイズ: 直径8cm x 高さ9cm, 容量: 250ml. 食洗機・電子レンジ対応。"
  },
  {
    id: 2,
    name: "リネンカーディガン",
    description: "軽やかで通気性の良いリネン素材のカーディガン。季節の変わり目に最適で、どんなスタイルにも合わせやすい一枚。",
    price: "¥8,800",
    imageUrl: "https://picsum.photos/400/300?random=2",
    details: "素材: リネン100%, サイズ: S/M/L, カラー: オフホワイト, ベージュ, ネイビー. 洗濯機洗い可。"
  },
  {
    id: 3,
    name: "アロマディフューザー（木製）",
    description: "天然木を使用した、ミニマルなデザインのアロマディフューザー。お好みの香りで癒しの空間を演出します。",
    price: "¥5,200",
    imageUrl: "https://picsum.photos/400/300?random=3",
    details: "素材: 天然木, サイズ: 直径10cm x 高さ12cm, 機能: 超音波式, 連続稼働時間: 6時間."
  },
  {
    id: 4,
    name: "ヴィンテージブックスタンド",
    description: "使い込まれた風合いが魅力のヴィンテージブックスタンド。書斎やリビングのアクセントとして、本を美しくディスプレイ。",
    price: "¥6,900",
    imageUrl: "https://picsum.photos/400/300?random=4",
    details: "素材: アイアン, サイズ: 幅20cm x 奥行15cm x 高さ25cm. アンティーク加工。"
  },
  {
    id: 5,
    name: "オーガニックコットンタオル",
    description: "肌触りの良いオーガニックコットンを使用した上質なタオル。シンプルながらも、日々の生活に心地よさをもたらします。",
    price: "¥2,200",
    imageUrl: "https://picsum.photos/400/300?random=5",
    details: "素材: オーガニックコットン100%, サイズ: フェイスタオル, バスタオル. カラー: ナチュラル, グレー. 吸水性抜群。"
  },
  {
    id: 6,
    name: "ミニマリストウォレット",
    description: "必要最小限のカードと紙幣をスマートに収納できるウォレット。洗練されたデザインで、ポケットにすっきり収まります。",
    price: "¥7,500",
    imageUrl: "https://picsum.photos/400/300?random=6",
    details: "素材: 本革, サイズ: 幅10cm x 高さ7cm x 厚さ1cm. カードスロット3つ, 紙幣用ポケット1つ."
  },
  {
    id: 7,
    name: "手織りウールブランケット",
    description: "暖かく、肌触りの良い天然ウールで丁寧に手織りされたブランケット。リビングのアクセントや、寒い日の防寒に。",
    price: "¥12,000",
    imageUrl: "https://picsum.photos/400/300?random=7",
    details: "素材: ウール100%, サイズ: 130cm x 180cm. ドライクリーニング推奨。"
  },
  {
    id: 8,
    name: "ボタニカルアートポスター",
    description: "植物の繊細な美しさを描いたアートポスター。空間に落ち着きと自然の息吹をもたらし、インテリアを格上げします。",
    price: "¥4,000",
    imageUrl: "https://picsum.photos/400/300?random=8",
    details: "素材: 高品質アート紙, サイズ: A3, A2, A1. フレームは別売り。"
  },
  {
    id: 9,
    name: "竹製歯ブラシセット",
    description: "環境に優しい竹製の歯ブラシセット。シンプルでエシカルな選択を日常に取り入れ、地球に優しい生活を。",
    price: "¥1,800",
    imageUrl: "https://picsum.photos/400/300?random=9",
    details: "素材: 竹, 毛先: ナイロン. 4本セット. 自然分解可能。"
  },
  {
    id: 10,
    name: "天然石アクセサリー",
    description: "一つ一つ表情の異なる天然石を使用したアクセサリー。個性を引き出すデザインで、日常に輝きを添えます。",
    price: "¥9,500",
    imageUrl: "https://picsum.photos/400/300?random=10",
    details: "素材: 天然石(アメジスト, ローズクォーツなど), チェーン: シルバー925. 長さ: 45cm."
  }
];

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleProductClick = (product: (typeof DUMMY_PRODUCTS)[0]) => {
    setSelectedProduct(product);
  };
  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
  };
  const handleChatOpen = () => {
    setIsChatOpen(true);
    alert("AIアバター店員とのチャットを開始します！(モック)");
  };
  return (
    <div
      className="bg-gray-50 min-h-screen pt-20"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <Header />
      <ProductList
        products={DUMMY_PRODUCTS}
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
