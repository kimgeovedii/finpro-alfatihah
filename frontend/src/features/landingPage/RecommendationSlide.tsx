"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  packInfo: string;
  price: string;
  image: string;
  tag?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Organic Bananas",
    packInfo: "1kg Cluster",
    price: "Rp 18.500",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDeP9IKHTu45ftA5JwC26q35SKmEkV92nNL2IIM9CQdwG5bYov7X-ECoFAgWKni0CY8ZCuqRUvD2T1YOAdChTQecx9HPK0iGPtrY9npqJjq3v0K8s2gRMZLC_2sidmmtEfJJjyyz8eUDE-d49Z0gsw1BRbJknm6mXrmEKrWIbfI7qxzTWKOqbMrLeQmc2rVMIsWKGXg5yvNdBpUtQ3HD2Ed-ekPmjQMAOQUwZdwC_DClA4LMlOfpny4rofHs1nPC57O-V05MdlQ7W8",
    tag: "Buy 1 Get 1 Free",
  },
  {
    id: 2,
    name: "Fresh Chicken Breast",
    packInfo: "500g Pack",
    price: "Rp 45.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOdtfIjJtaILPs94r77Rw6X1rEiArvL1lHcTLC9fgW2qJQ1y_JRNdk7MFW05ZXLMLoSJ4I5g2Q7T2Laoc7L3DqqujcU3ZL1smn2U6mFSsGXq5otYl9IxXMrQ-BQV-P6eJthXHra6T9yWB_JeYre1wcxZ7ERNvLIEXGN70tr66RMjj63QKtZ45wokOXUHctDzLoIX1XXwneEft6xY4VISTxB9pCC5_bJ5WevB5k8Z5uQdy4wg3bGMkEXZaeh7dUSdho_VWE4Ed0hy8",
  },
  {
    id: 3,
    name: "Ripe Avocado",
    packInfo: "2 Large Pieces",
    price: "Rp 32.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBvwDzC6HXn9x7551yYRb1zYhgJQcWNMbDRa012ry5t2IJ-TTBOl7WNLydG6UyMfVhjpMXOStNl59p8q2V0P3IJoEOM0Kzpw0oXi7htzfJB2rUM8tzZuchj3RxBknPXwm0vxr6HmaFgI8_ABwpRk8KnmrrrdNreLNjAbvq-Wk5IvQIEgzHBZlw_q8wz0SqAzTaE3mopIz_fcdB7t3cJiead9osJo79R-XvPzs4Wsjko9ZfKKAkjwp21h2M2Q1wAOgbrj8WzSlOu7Js",
    tag: "Buy 1 Get 1 Free",
  },
  {
    id: 4,
    name: "Fresh Asparagus",
    packInfo: "250g Bundle",
    price: "Rp 22.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuARmangFJhbAjIgT6b71MAPcHobC7uJQeJdNPB0hAXpYGA9eGzxxYyk8orHpr78N5P8B0KfO5kNXD1MEqZTLUrd8ohymIwWm52GkLb5kfbXRRM98SRL9gUdV_9hLWXy37Q82I4TPJNSqmUx6bepn3R7NnsGLX6LN_8WsuDOLU43dgDEXjUQzx54KOInXmsf2S_kOBfbEXoKCyI4dDAjC_1c03nZuQoVwUqu8ZRxXWH7qN8gAHAxEbFyEH_dnwtDnB6uIy_YCMZ7g-A",
  },
];

export const RecommendationSlide = () => {
  return (
    <section>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-heading font-black tracking-tight text-primary">
            Fresh for You
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Our daily hand-picked selections
          </p>
        </div>
        <button className="text-primary font-bold hover:underline flex items-center gap-2">
          See All <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container-lowest rounded-[1.5rem] p-5 group hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            <div className="relative h-48 w-full bg-surface-container rounded-xl overflow-hidden mb-5">
              <img
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                src={product.image}
              />
              {product.tag && (
                <span className="absolute top-3 left-3 bg-tertiary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                  {product.tag}
                </span>
              )}
            </div>
            <h4 className="text-lg font-heading font-bold text-on-surface mb-1">
              {product.name}
            </h4>
            <span className="text-slate-400 text-xs font-semibold mb-3">
              {product.packInfo}
            </span>
            <div className="mt-auto flex justify-between items-center">
              <span className="text-xl font-black text-primary">
                {product.price}
              </span>
              <button className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors active:scale-90 shadow-md">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
