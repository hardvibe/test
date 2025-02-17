"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if(savedTheme == "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
    setThemeLoaded(true);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);

      fetch(`https://fakestoreapi.com/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Ошибка загрузки данных:", error);
          setLoading(false);
        });
  }, [id]);

  if (!themeLoaded) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  if (loading)
    return (
      <motion.div
        className={`min-h-screen flex justify-center items-center ${
     darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-50 text-gray-600"
   }`}
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   transition={{ duration: 0.5 }}
 >
   Загрузка...
      </motion.div>
    );
  if (!product)
    return (
      <motion.div
        className={`min-h-screen flex justify-center items-center ${
          darkMode ? "bg-gray-900 text-red-400" : "bg-gray-50 text-red-500"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Товар не найден
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-6">
      <div className="w-full max-w-[800px] bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 text-center dark:text-white">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "Светлая тема" : "Тёмная тема"}
        </button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold"
        >
          {product.title}
        </motion.h1>

        <motion.figure
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-4"
        >
          <img src={product.image} alt={product.title} className="w-64 h-64 object-contain" />
        </motion.figure>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-blue-600 dark:text-blue-400 font-bold text-xl mt-4"
        >
          ${product.price}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-700 dark:text-gray-300 mt-2"
        >
          {product.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 flex justify-center gap-4"
        >
          <button
            onClick={() => router.push("/catalog")}
            className="bg-gray-500 dark:bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition"
          >
            Назад в каталог
          </button>

          <button
            className="bg-blue-500 dark:bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Купить
          </button>
        </motion.div>
      </div>
    </div>
  );
}
