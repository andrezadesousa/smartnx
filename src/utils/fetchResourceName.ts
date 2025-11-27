export async function fetchResourceName(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return "Desconhecido";

    const data = await res.json();
    return data.name || data.title || "Desconhecido";
  } catch {
    return "Desconhecido";
  }
}
