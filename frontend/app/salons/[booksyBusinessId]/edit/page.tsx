"use client";

import Link from "next/link";
import axios from "axios";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getSalonById, tryEditSalon } from "@/api/salons";
import { getRoleFromToken, getValidToken } from "@/auth";
import type { Service } from "@/types/salon";

type EditFormState = {
  name: string;
  address: string;
  description: string;
  district: string;
  email: string;
  facebookLink: string;
  instagramLink: string;
  phone: string;
  services: Service[];
};

function toNullableString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export default function EditSalonPage() {
  const params = useParams<{ booksyBusinessId: string }>();
  const rawId = params?.booksyBusinessId;
  const salonId = useMemo(() => Number(rawId), [rawId]);

  const authSnapshot = useMemo(() => {
    if (typeof window === "undefined") {
      return { checked: false, token: null as string | null, canEdit: false };
    }
    const validToken = getValidToken();
    const role = validToken ? getRoleFromToken(validToken) : null;
    return { checked: true, token: validToken, canEdit: role === "ADMIN" };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EditFormState | null>(null);

  useEffect(() => {
    if (!authSnapshot.canEdit || Number.isNaN(salonId)) {
      return;
    }

    const loadSalon = async () => {
      setIsLoading(true);
      try {
        const salon = await getSalonById(salonId);
        setForm({
          name: salon.name,
          address: salon.address,
          description: salon.description,
          district: salon.district,
          email: salon.email ?? "",
          facebookLink: salon.facebookLink ?? "",
          instagramLink: salon.instagramLink ?? "",
          phone: salon.phone ?? "",
          services: salon.services.map((service) => ({
            name: service.name ?? "",
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
          })),
        });
      } catch {
        toast.error("Failed to load salon details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSalon();
  }, [authSnapshot.canEdit, salonId]);

  const updateService = (index: number, patch: Partial<Service>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const services = [...prev.services];
      services[index] = { ...services[index], ...patch };
      return { ...prev, services };
    });
  };

  const addService = () => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        services: [...prev.services, { name: "", minPrice: 0, maxPrice: 0 }],
      };
    });
  };

  const removeService = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const services = prev.services.filter((_, i) => i !== index);
      return { ...prev, services };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !authSnapshot.token) return;

    setIsSubmitting(true);
    try {
      await tryEditSalon(salonId, authSnapshot.token, {
        name: form.name,
        address: form.address,
        description: form.description,
        district: form.district,
        email: toNullableString(form.email),
        facebookLink: toNullableString(form.facebookLink),
        instagramLink: toNullableString(form.instagramLink),
        phone: toNullableString(form.phone),
        services: form.services.map((service) => ({
          name: toNullableString(service.name ?? ""),
          minPrice: Number.isNaN(service.minPrice) ? 0 : service.minPrice,
          maxPrice: Number.isNaN(service.maxPrice) ? 0 : service.maxPrice,
        })),
      });
      toast.success("Salon updated successfully.");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error("You are not allowed to update this salon.");
      } else {
        toast.error("Failed to update salon.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (Number.isNaN(salonId)) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p className="text-red-600">Invalid salon id.</p>
        <Link href="/" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to main page
        </Link>
      </main>
    );
  }

  if (!authSnapshot.checked) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p>Checking access...</p>
      </main>
    );
  }

  if (!authSnapshot.canEdit) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold">Edit salon</h1>
        <p className="mt-3 text-zinc-700 dark:text-zinc-300">
          You are not allowed to access this page. Only admins can edit salon records.
        </p>
        <Link href="/" className="mt-4 inline-block text-orange-600 hover:underline">
          Back to main page
        </Link>
      </main>
    );
  }

  if (isLoading || !form) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <p>Loading salon data...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Edit salon #{salonId}</h1>
        <Link href="/" className="text-sm text-orange-600 hover:underline">
          Back to main page
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="name">Name</label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="address">Address</label>
          <input
            id="address"
            required
            value={form.address}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, address: e.target.value } : prev))}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="description">Description</label>
          <textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
            rows={4}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="district">District</label>
          <input
            id="district"
            required
            value={form.district}
            onChange={(e) => setForm((prev) => (prev ? { ...prev, district: e.target.value } : prev))}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, phone: e.target.value } : prev))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="facebookLink">Facebook link</label>
            <input
              id="facebookLink"
              value={form.facebookLink}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, facebookLink: e.target.value } : prev))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="instagramLink">Instagram link</label>
            <input
              id="instagramLink"
              value={form.instagramLink}
              onChange={(e) => setForm((prev) => (prev ? { ...prev, instagramLink: e.target.value } : prev))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Services</h2>
            <button
              type="button"
              onClick={addService}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Add service
            </button>
          </div>

          <div className="space-y-3">
            {form.services.map((service, index) => (
              <div key={`${index}-${service.name ?? "service"}`} className="grid gap-2 rounded-md border border-zinc-200 p-3 dark:border-zinc-700 sm:grid-cols-12">
                <input
                  value={service.name ?? ""}
                  onChange={(e) => updateService(index, { name: e.target.value })}
                  placeholder="Service name"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-5"
                />
                <input
                  type="number"
                  value={service.minPrice}
                  onChange={(e) => updateService(index, { minPrice: Number(e.target.value) })}
                  placeholder="Min price"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-3"
                />
                <input
                  type="number"
                  value={service.maxPrice}
                  onChange={(e) => updateService(index, { maxPrice: Number(e.target.value) })}
                  placeholder="Max price"
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-900 sm:col-span-3"
                />
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20 sm:col-span-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving changes..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}
