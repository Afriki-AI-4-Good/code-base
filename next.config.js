/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

const githubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

/** @type {import("next").NextConfig} */
const config = {
  ...(githubPagesBasePath
    ? {
        assetPrefix: githubPagesBasePath,
        basePath: githubPagesBasePath,
        images: {
          unoptimized: true,
        },
      }
    : {}),
};

export default config;
