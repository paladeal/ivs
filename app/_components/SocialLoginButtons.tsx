"use client";
import React from 'react';
import { SocialLoginButton } from './SocialLoginButton';
// Lucide Reactのアイコンをインポート
// 実際のプロジェクトでは、npm install lucide-react でインストールが必要です。
// ハッカソンでは、CDN経由でアイコンを使用するか、SVGを直接埋め込むことも検討できます。
// ここでは、Lucide Reactのコンポーネントがあることを前提とします。
// ダミーとして、それぞれのアイコンを直接SVGで定義することも可能です。

// ダミーのアイコンコンポーネント
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M21.17 8H12"/><path d="M3.83 16H12"/><path d="M16 3.83V12"/><path d="M8 21.17V12"/></svg>
);
const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-apple"><path d="M12 20.94c1.37 0 2.7-.42 3.8-1.26a8.8 8.8 0 0 0 3.2-2.92c.76-1.13 1.1-2.48 1.1-3.86 0-1.38-.34-2.73-1.1-3.86a8.8 8.8 0 0 0-3.2-2.92c-1.1-1.1-2.43-1.26-3.8-1.26-1.37 0-2.7.42-3.8 1.26a8.8 8.8 0 0 0-3.2 2.92c-.76 1.13-1.1 2.48-1.1 3.86 0 1.38.34 2.73 1.1 3.86a8.8 8.8 0 0 0 3.2 2.92c1.1.84 2.43 1.26 3.8 1.26z"/><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/></svg>
);
const LineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 0 0 12 22h0a9 9 0 0 0 4.1-1.1L21 23l-1.9-5.1A9 9 0 0 0 22 12V12c0-4.9-4.1-9-9-9S3 7.1 3 12a9 9 0 0 0 4.9 8z"/></svg>
); // LINEアイコンの代替としてメッセージアイコン
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
); // Xアイコンの代替としてXマーク
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
);


export const SocialLoginButtons: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full"> {/* min-h-screen bg-gray-100 p-4 sm:p-6 を削除 */}
      <div className="w-full"> {/* bg-white p-8 rounded-2xl shadow-xl max-w-md を削除 */}
        <div className="space-y-4">
          <SocialLoginButton
            provider="Google"
            icon={GoogleIcon}
            bgColor="bg-white"
            textColor="text-gray-700 border border-gray-300"
          />
          <SocialLoginButton
            provider="Apple"
            icon={AppleIcon}
            bgColor="bg-black"
            textColor="text-white"
          />
          <SocialLoginButton
            provider="LINE"
            icon={LineIcon}
            bgColor="bg-green-500"
            textColor="text-white"
          />
          <SocialLoginButton
            provider="X"
            icon={XIcon}
            bgColor="bg-gray-800"
            textColor="text-white"
          />
          <SocialLoginButton
            provider="Facebook"
            icon={FacebookIcon}
            bgColor="bg-blue-600"
            textColor="text-white"
          />
          <SocialLoginButton
            provider="Instagram"
            icon={InstagramIcon}
            bgColor="bg-pink-500"
            textColor="text-white"
          />
        </div>
      </div>
    </div>
  );
};
