import { unstable_cache } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { createPublicClient } from "@/app/lib/supabase/public";

/** Profil de cache pentru catalogul public de utilaje (Upstash via handler). */
const RENTALS_CACHE = { tags: ["rentals"], revalidate: 3600 };

export type RentalMachine = {
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  specs: {
    label: string;
    value: string;
  }[];
  uses: string[];
  accessRequirements: string[];
};

type RentalRow = {
  slug: string;
  category: string;
  title: string;
  short_description: string;
  long_description: string;
  price: string;
  image_src: string | null;
  image_alt: string | null;
  specs: { label: string; value: string }[];
  uses: string[] | null;
  access_requirements: string[] | null;
};

const RENTAL_COLUMNS =
  "slug, category, title, short_description, long_description, price, image_src, image_alt, specs, uses, access_requirements, sort_order";

function mapRental(row: RentalRow): RentalMachine {
  return {
    slug: row.slug,
    category: row.category,
    title: row.title,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    price: row.price,
    imageSrc: row.image_src ?? "",
    imageAlt: row.image_alt ?? "",
    specs: row.specs ?? [],
    uses: row.uses ?? [],
    accessRequirements: row.access_requirements ?? [],
  };
}

/** Catalogul de utilaje de închiriat, în ordinea de afișare. */
export const getRentalMachines = unstable_cache(
  async (): Promise<RentalMachine[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("rental_machines")
      .select(RENTAL_COLUMNS)
      .order("sort_order")
      .returns<RentalRow[]>();

    if (error) {
      throw new Error(`Nu am putut încărca utilajele: ${error.message}`);
    }
    return (data ?? []).map(mapRental);
  },
  ["rental-machines"],
  RENTALS_CACHE,
);

/** Un utilaj după slug, sau `null` dacă nu există / nu e publicat. */
export const getRentalMachine = unstable_cache(
  async (slug: string): Promise<RentalMachine | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("rental_machines")
      .select(RENTAL_COLUMNS)
      .eq("slug", slug)
      .maybeSingle<RentalRow>();

    if (error) {
      throw new Error(`Nu am putut încărca utilajul „${slug}": ${error.message}`);
    }
    return data ? mapRental(data) : null;
  },
  ["rental-machine"],
  RENTALS_CACHE,
);

// ─── Admin (rânduri complete, cu id) ─────────────────────────────────────────

export type AdminRental = {
  id: string;
  slug: string;
  category: string;
  title: string;
  short_description: string;
  long_description: string;
  price: string;
  image_src: string | null;
  image_alt: string | null;
  specs: { label: string; value: string }[];
  uses: string[];
  access_requirements: string[];
  is_available: boolean;
  sort_order: number;
  is_published: boolean;
};

const ADMIN_RENTAL_COLUMNS =
  "id, slug, category, title, short_description, long_description, price, image_src, image_alt, specs, uses, access_requirements, is_available, sort_order, is_published";

/** Toate utilajele pentru panou (include draft + id). */
export async function getRentalsAdmin(): Promise<AdminRental[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rental_machines")
    .select(ADMIN_RENTAL_COLUMNS)
    .order("sort_order")
    .returns<AdminRental[]>();
  if (error) throw new Error(`Nu am putut încărca utilajele: ${error.message}`);
  return data ?? [];
}

/** Un utilaj după id (pentru editare). */
export async function getRentalById(id: string): Promise<AdminRental | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rental_machines")
    .select(ADMIN_RENTAL_COLUMNS)
    .eq("id", id)
    .maybeSingle<AdminRental>();
  if (error) throw new Error(`Nu am putut încărca utilajul: ${error.message}`);
  return data;
}
