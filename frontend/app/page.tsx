import Link from "next/link";
import { getSalons } from "@/api/salons";

export const dynamic = "force-dynamic";

type QueryParams = {
  page?: string;
  name?: string;
  district?: string;
  serviceType?: string;
};

type HomePageProps = {
  searchParams: Promise<QueryParams>;
};

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

function getWindowPages(currentPage: number, totalPages: number, windowSize = 5) {
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(windowSize / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = windowSize;
  }

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - windowSize + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPageHref(targetPage: number, query: QueryParams): string {
  const params = new URLSearchParams();

  params.set("page", String(targetPage));
  if (query.name) params.set("name", query.name);
  if (query.district) params.set("district", query.district);
  if (query.serviceType) params.set("serviceType", query.serviceType);

  return `/?${params.toString()}`;
}

function formatRating(rating: number) {
  return Number(rating.toFixed(2));
}

export default async function Home({ searchParams }: HomePageProps) {
  const query = await searchParams;

  const pageFromQuery = Number(query.page ?? "1");
  const currentPage =
    Number.isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery;

  const data = await getSalons({
    page: currentPage,
    name: query.name,
    district: query.district,
    serviceType: query.serviceType,
  });

  const pages = getWindowPages(data.page, data.totalPages, 5);
  const showLeftDots = pages[0] > 2;
  const showRightDots = pages[pages.length - 1] < data.totalPages - 1;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Salons Nearby</h1>
      <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-300">
        Showing page {data.page} of {data.totalPages} ({data.totalItems} salons)
      </p>

      {data.items.length === 0 ? (
        <p>No salons found.</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((salon) => (
              <article
                key={salon.booksyBusinessId}
                className="group flex min-h-64 flex-col rounded-xl border border-orange-200/80 bg-gradient-to-br from-orange-100 to-orange-200 p-5 shadow-[0_10px_30px_-18px_rgba(194,65,12,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_-16px_rgba(194,65,12,0.45)] dark:border-orange-800/60 dark:from-orange-900/60 dark:to-orange-950/60"
              >
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-orange-700 dark:text-orange-100 dark:group-hover:text-orange-200">
                    {salon.name}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-700 dark:text-orange-200/90">
                    {salon.district}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-800 dark:text-orange-100/90">
                    {salon.address}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mt-4 flex items-center gap-4 text-sm text-zinc-800 dark:text-orange-100/90">
                    <span className="rounded-full bg-white/70 px-2 py-0.5 dark:bg-orange-900/40">
                      Rating: {formatRating(salon.rating)}
                    </span>
                    <span className="rounded-full bg-white/70 px-2 py-0.5 dark:bg-orange-900/40">
                      Reviews: {salon.reviewsCount}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-orange-100">
                    Price: {formatPriceRange(salon.minPrice, salon.maxPrice)}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {pages[0] > 1 && (
              <Link href={buildPageHref(1, query)} className="rounded-md border px-3 py-1 text-sm">
                1
              </Link>
            )}

            {showLeftDots && <span className="px-1 text-sm">...</span>}

            {pages.map((page) => {
              const isActive = page === data.page;

              return (
                <Link
                  key={page}
                  href={buildPageHref(page, query)}
                  className={`rounded-md border px-3 py-1 text-sm transition ${isActive
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Link>
              );
            })}

            {showRightDots && <span className="px-1 text-sm">...</span>}

            {pages[pages.length - 1] < data.totalPages && (
              <Link
                href={buildPageHref(data.totalPages, query)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                {data.totalPages}
              </Link>
            )}
          </nav>
        </>
      )}
    </main>
  );
}