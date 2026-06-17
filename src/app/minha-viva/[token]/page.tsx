import { headers } from "next/headers";
import { MinhaVivaView } from "@/components/minha-viva/MinhaVivaView";
import type { VivaProfileResponse } from "@/lib/viva/profile-types";

export const dynamic = "force-dynamic";

async function getProfile(token: string): Promise<VivaProfileResponse | null> {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return null;
  }

  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const response = await fetch(`${protocol}://${host}/api/viva/profile/${encodeURIComponent(token)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as VivaProfileResponse & { success?: boolean };

  if (payload.success === false) {
    return null;
  }

  return {
    profile: payload.profile,
    latestPlan: payload.latestPlan,
  };
}

export default async function MinhaVivaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await getProfile(token);

  return <MinhaVivaView data={data} />;
}
