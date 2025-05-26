import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://coomer.su/api/v1/posts");

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao buscar dados da API externa" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor", details: String(error) }, { status: 500 });
  }
}
