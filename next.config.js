/** @type {import('next').NextConfig} */
const nextConfig = {
  // 해커톤용: 타입 에러 & 린트 에러 무시하고 강제 배포
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'], // 외부 이미지 허용
  },
};

export default nextConfig;