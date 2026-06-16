import type { Metadata } from "next";
import { ExperienceFlow } from "@/components/experience/ExperienceFlow";

export const metadata: Metadata = {
  title: "Experiência Viva | Plano personalizado",
  description:
    "Responda um fluxo curto e receba um plano personalizado de estilo, beleza e organização para seu próximo momento especial.",
};

export default function ExperienciaPage() {
  return <ExperienceFlow />;
}
