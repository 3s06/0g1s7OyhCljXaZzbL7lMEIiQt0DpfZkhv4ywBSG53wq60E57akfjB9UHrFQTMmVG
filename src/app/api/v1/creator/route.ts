import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { creators } = await request.json();

    if (!creators || !Array.isArray(creators)) {
      return NextResponse.json(
        { error: "Campo 'creators' é obrigatório e deve ser um array de strings." },
        { status: 400 }
      );
    }

    // Buscar todos os perfis paralelamente
    const profiles = await Promise.all(
      creators.map(async (creator) => {
        try {
          const response = await fetch(
            `https://coomer.su/api/v1/onlyfans/user/${encodeURIComponent(creator)}/profile`
          );

          if (!response.ok) {
            return null; // ou pode retornar algum erro específico para o creator
          }

          const data = await response.json();
          return data;
        } catch {
          return null;
        }
      })
    );

    // Filtra resultados válidos
    const filteredProfiles = profiles.filter((p) => p !== null);

    return NextResponse.json(filteredProfiles);

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor", details: (error as Error).message || String(error) },
      { status: 500 }
    );
  }
}
