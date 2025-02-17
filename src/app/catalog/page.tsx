"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (!savedTheme) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      });
  }, []);

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center p-6">
      <div className="w-full max-w-[1400px]">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          {darkMode ? "Светлая тема" : "Тёмная тема"}
        </button>

        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Каталог товаров
          </h1>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <motion.article
              key={product.id}
              className="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-xl overflow-hidden p-5 flex flex-col items-center text-center border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <figure className="w-48 h-48 flex justify-center items-center bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </figure>

              <h2 className="text-lg font-semibold mt-4">{product.title}</h2>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-2">
                ${product.price}
              </p>

              <Link href={`/catalog/${product.id}`} className="mt-4 w-full">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Подробнее
                </button>
              </Link>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
