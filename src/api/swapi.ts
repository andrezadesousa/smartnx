export interface SwapiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Character {
  name: string;
  height: string;
  mass: string;
  gender: string;
  birth_year: string;
  url: string;
}

const BASE = "https://swapi.dev/api";

export async function fetchCharacters(
  page = 1,
  search = ""
): Promise<SwapiResponse<Character>> {
  const q = new URLSearchParams();
  q.set("page", String(page));
  if (search) q.set("search", search);
  const res = await fetch(`${BASE}/people/?${q.toString()}`);
  if (!res.ok) throw new Error("Erro ao buscar personagens");
  return res.json();
}
