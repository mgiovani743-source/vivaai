import { NextResponse } from "next/server";
import { getVivaProfileByToken } from "@/lib/viva/profile-service";

type ProfileRouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: ProfileRouteContext) {
  try {
    const { token } = await context.params;
    const data = await getVivaProfileByToken(token);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Viva nao encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Erro na API /api/viva/profile/[token]:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Nao foi possivel carregar sua Viva agora.",
      },
      { status: 500 },
    );
  }
}
