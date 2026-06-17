import type {
  BudgetOption,
  FeelingOption,
  MomentOption,
  StyleOption,
  VivaPlan,
} from "./types";

export type VivaProfileRecord = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  access_token: string;
  created_at: string;
  updated_at: string;
};

export type VivaPlanRecord = {
  id: string;
  profile_id: string;
  moments: MomentOption[];
  feelings: FeelingOption[];
  styles: StyleOption[];
  budget: BudgetOption | string | null;
  event_date: string | null;
  location: string | null;
  avoid: string | null;
  owned_items: string | null;
  plan: VivaPlan;
  created_at: string;
};

export type VivaProfileResponse = {
  profile: VivaProfileRecord;
  latestPlan: VivaPlanRecord | null;
};
