/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#10B981", // Esmeralda 500 (Color base)
          light: "#6EE7B7", // Esmeralda 300
          dark: "#047857", // Esmeralda 700
        },
        secondary: {
          DEFAULT: "#0F172A", // Azul oscuro (Fondo)
          light: "#1E293B", // Azul grisáceo (Para tarjetas)
          dark: "#020617", // Casi negro (Para contrastes fuertes)
        },
        accent: {
          DEFAULT: "#FACC15", // Amarillo fuerte (Para detalles llamativos)
          light: "#FEF08A", // Amarillo claro (Para fondos sutiles)
          dark: "#CA8A04", // Amarillo oscuro (Para resaltar)
        },
        neutral: {
          DEFAULT: "#E5E7EB", // Gris claro (Texto secundario)
          light: "#F3F4F6", // Gris más claro (Fondos suaves)
          dark: "#374151", // Gris oscuro (Texto principal)
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Fuente principal
        poppins: ["Poppins", "sans-serif"], // Alternativa elegante
        roboto: ["Roboto", "sans-serif"], // Opción clásica
      },
    },
  },
};
