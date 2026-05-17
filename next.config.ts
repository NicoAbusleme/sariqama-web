import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer usa canvas (nativo) — excluir del bundle de webpack
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
