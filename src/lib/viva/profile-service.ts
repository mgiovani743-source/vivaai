import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service";
import type {
  BudgetOption,
  FeelingOption,
  MomentOption,
  StyleOption,
  VivaExperienceInput,
  VivaPlan,
} from "./types";
import type { VivaPlanRecord, VivaProfileRecord, VivaProfileResponse } from "./profile-types";

type SaveExperiencePayload = {
  profile?: {
    name?: unknown;
    email?: unknown;
    whatsapp?: unknown;
  };
  event?: {
    moments?: unknown;
    date?: unknown;
    location?: unknown;
  };
  preferences?: {
    feelings?: unknown;
    styles?: unknown;
    budget?: unknown;
    avoid?: unknown;
    ownedItems?: unknown;
  };
  input?: Partial<VivaExperienceInput>;
  plan?: VivaPlan;
};

type SaveExperienceResult = {
  accessToken: string;
  profileId: string;
  planId: string;
  redirectUrl: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray<T extends string>(value: unknown): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is T => typeof item === "string");
}

function normalizePayload(body: SaveExperiencePayload) {
  const input = body.input ?? {};

  const name = asString(body.profile?.name ?? input.name);
  const email = asString(body.profile?.email ?? input.email).toLowerCase();
  const whatsapp = asString(body.profile?.whatsapp ?? input.whatsapp) || null;
  const plan = body.plan;

  return {
    name,
    email,
    whatsapp,
    moments: asStringArray<MomentOption>(body.event?.moments ?? input.moments),
    feelings: asStringArray<FeelingOption>(body.preferences?.feelings ?? input.feelings),
    styles: asStringArray<StyleOption>(body.preferences?.styles ?? input.styles),
    budget: asString(body.preferences?.budget ?? input.budget) as BudgetOption | "",
    eventDate: asString(body.event?.date ?? input.date) || null,
    location: asString(body.event?.location ?? input.location) || null,
    avoid: asString(body.preferences?.avoid ?? input.avoid) || null,
    ownedItems: asString(body.preferences?.ownedItems ?? input.ownedItems) || null,
    plan,
  };
}

function assertValidExperience(data: ReturnType<typeof normalizePayload>) {
  if (!data.name) {
    throw new Error("Informe seu nome para salvar sua Viva.");
  }

  if (!data.email || !emailPattern.test(data.email)) {
    throw new Error("Informe um e-mail valido para salvar sua Viva.");
  }

  if (!data.plan) {
    throw new Error("Nao foi possivel encontrar o plano gerado.");
  }
}

async function findProfileByEmail(email: string): Promise<VivaProfileRecord | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("viva_profiles")
    .select("id,name,email,whatsapp,access_token,created_at,updated_at")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as VivaProfileRecord | null;
}

export async function saveVivaExperience(
  body: SaveExperiencePayload,
): Promise<SaveExperienceResult> {
  const data = normalizePayload(body);
  assertValidExperience(data);

  const supabase = createServiceRoleClient();
  let profile = await findProfileByEmail(data.email);

  if (profile) {
    const { data: updatedProfile, error } = await supabase
      .from("viva_profiles")
      .update({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
      .select("id,name,email,whatsapp,access_token,created_at,updated_at")
      .single();

    if (error) {
      throw error;
    }

    profile = updatedProfile as VivaProfileRecord;
  } else {
    const { data: insertedProfile, error } = await supabase
      .from("viva_profiles")
      .insert({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
      })
      .select("id,name,email,whatsapp,access_token,created_at,updated_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        profile = await findProfileByEmail(data.email);
      }

      if (!profile) {
        throw error;
      }
    } else {
      profile = insertedProfile as VivaProfileRecord;
    }
  }

  const { data: insertedPlan, error: planError } = await supabase
    .from("viva_plans")
    .insert({
      profile_id: profile.id,
      moments: data.moments,
      feelings: data.feelings,
      styles: data.styles,
      budget: data.budget || null,
      event_date: data.eventDate,
      location: data.location,
      avoid: data.avoid,
      owned_items: data.ownedItems,
      plan: data.plan,
    })
    .select("id")
    .single();

  if (planError) {
    throw planError;
  }

  return {
    accessToken: profile.access_token,
    profileId: profile.id,
    planId: insertedPlan.id as string,
    redirectUrl: `/minha-viva/${profile.access_token}`,
  };
}

export async function getVivaProfileByToken(token: string): Promise<VivaProfileResponse | null> {
  const cleanedToken = token.trim();

  if (!cleanedToken) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data: profile, error: profileError } = await supabase
    .from("viva_profiles")
    .select("id,name,email,whatsapp,access_token,created_at,updated_at")
    .eq("access_token", cleanedToken)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    return null;
  }

  const { data: latestPlan, error: planError } = await supabase
    .from("viva_plans")
    .select(
      "id,profile_id,moments,feelings,styles,budget,event_date,location,avoid,owned_items,plan,created_at",
    )
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (planError) {
    throw planError;
  }

  return {
    profile: profile as VivaProfileRecord,
    latestPlan: latestPlan as VivaPlanRecord | null,
  };
}
