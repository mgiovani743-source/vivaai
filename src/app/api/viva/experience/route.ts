import { NextResponse } from "next/server";
import { saveVivaExperience } from "@/lib/viva/profile-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await saveVivaExperience(body);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Erro na API /api/viva/experience:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Nao foi possivel salvar sua Viva agora.";
    const isValidationError = message.includes("Informe") || message.includes("plano gerado");
    const status = isValidationError ? 400 : 500;

    return NextResponse.json(
      {
        success: false,
        error: isValidationError
          ? message
          : "Nao foi possivel salvar sua Viva agora. Tente novamente em instantes.",
      },
      { status },
    );
  }
}
