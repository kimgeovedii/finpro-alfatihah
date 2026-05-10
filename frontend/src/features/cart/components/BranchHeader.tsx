import { HeadingText } from "@/components/layout/HeadingText";
import { MiniTagBox } from "@/components/layout/MiniTagBox";
import { Button } from "@/components/ui/button";
import { BuildingOfficeIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

type Props = {
  cartId: string
  storeName: string
  slug: string
  city: string
  distance?: number
  onRemove: () => void
}

export const BranchHeader: React.FC<Props> = ({ storeName, cartId, city, onRemove, slug, distance }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
          <BuildingOfficeIcon className="w-5 h-5"/>
        </div>
        <Link href={`/${slug}`}>
          <HeadingText children={storeName} level={2}/>
          <div className="flex gap-2">
            <MiniTagBox val={city}/>
            { distance && <MiniTagBox val={`${distance} Km`}/> }
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onRemove}
          className="bg-red-400 hover:bg-red-500 hover:shadow transition cursor-pointer flex gap-2 items-center rounded-xl px-3 py-1"
        >
          <TrashIcon className="w-5 h-5"/>{" "}
          <span className="block md:hidden lg:block">Remove</span>
        </Button>
        <Link href={`/cart/${cartId}`}>
          <Button className="bg-emerald-600 text-white shadow hover:bg-emerald-700 transition flex gap-2 items-center font-600 rounded-xl px-3 py-1">
            <ShoppingCartIcon className="w-5 h-5"/>{" "}
            <span className="block md:hidden lg:block">Checkout</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
