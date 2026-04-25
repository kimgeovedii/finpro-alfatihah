import { MapPinIcon } from "@heroicons/react/24/outline";

export const AllowAccess = () => {
  return (
    <section className="bg-secondary-container/30 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-primary/5">
      <div className="flex items-center gap-6 max-w-xl">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
          <MapPinIcon className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl font-heading font-bold text-primary mb-2">
            Want to see products near you?
          </h3>
          <p className="text-slate-600 font-medium">
            Enable location access for the best service from our closest branch
            and exclusive local deals.
          </p>
        </div>
      </div>
      <button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold shadow-md hover:shadow-xl transition-all active:scale-95 whitespace-nowrap">
        Allow Access
      </button>
    </section>
  );
};
