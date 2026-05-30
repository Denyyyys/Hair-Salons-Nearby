import Link from "next/link";
import { notFound } from "next/navigation";
import axios from "axios";
import { getSalonById } from "@/api/salons";

type Props = {
  params: Promise<{ booksyBusinessId: string }>;
};

function formatRating(rating: number) {
  return Number(rating.toFixed(2));
}

function formatPriceRange(minPrice: number | null, maxPrice: number | null) {
  const normalizedMin = minPrice != null && minPrice > 0 ? minPrice : null;
  const normalizedMax = maxPrice != null && maxPrice > 0 ? maxPrice : null;

  if (normalizedMin == null && normalizedMax == null) return "No price info";
  if (normalizedMin != null && normalizedMax != null) {
    return `${normalizedMin} - ${normalizedMax} PLN`;
  }
  if (normalizedMin != null) return `From ${normalizedMin} PLN`;
  return `Up to ${normalizedMax} PLN`;
}

export default async function SalonDetailsPage({ params }: Props) {
  const { booksyBusinessId } = await params;
  const id = Number(booksyBusinessId);

  if (Number.isNaN(id)) {
    notFound();
  }

  let salon;
  try {
    salon = await getSalonById(id);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{salon.name}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300">{salon.district}</p>
        </div>

        <Link
          href={`/salons/${salon.booksyBusinessId}/edit`}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Edit salon
        </Link>
      </div>

      <section className="space-y-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p><span className="font-semibold">Address:</span> {salon.address}</p>
        <p><span className="font-semibold">Description:</span> {salon.description}</p>
        <p><span className="font-semibold">Phone:</span> {salon.phone ?? "N/A"}</p>
        <p><span className="font-semibold">Email:</span> {salon.email ?? "N/A"}</p>
        <p><span className="font-semibold">Rating:</span> {formatRating(salon.rating)}</p>
        <p><span className="font-semibold">Reviews:</span> {salon.reviewsCount}</p>
        <p><span className="font-semibold">Price:</span> {formatPriceRange(salon.minPrice, salon.maxPrice)}</p>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="mb-3 text-xl font-semibold">Services</h2>
        {salon.services.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <ul className="space-y-2">
            {salon.services.map((service, index) => (
              <li
                key={`${service.name ?? "service"}-${index}`}
                className="rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-900"
              >
                <span className="font-medium">{service.name ?? "Unnamed service"}</span>{" "}
                ({service.minPrice} - {service.maxPrice} PLN)
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
