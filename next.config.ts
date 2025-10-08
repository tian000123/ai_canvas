import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',              // 关键：静态导出
  images: { unoptimized: true }, // 若用到 <Image /> 必须关优化
}

export default nextConfig