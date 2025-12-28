import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        work: resolve(__dirname, "work.html"),
        culture: resolve(__dirname, "culture.html"),
        contact: resolve(__dirname, "contact.html"),
        film: resolve(__dirname, "film.html"),
        automobile: resolve(__dirname, "automobile.html"),
        cinematography: resolve(__dirname, "cinematography.html"),
        fashion: resolve(__dirname, "fashion.html"),
        food: resolve(__dirname, "food.html"),
        graphicDesign: resolve(__dirname, "graphic-design.html"),
        interiors: resolve(__dirname, "interiors.html"),
        photography: resolve(__dirname, "photography.html"),
        products: resolve(__dirname, "products.html"),
        webDev: resolve(__dirname, "web-dev.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
