import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste projeto (evita ambiguidade quando há
  // outros package-lock.json em diretórios pais).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
