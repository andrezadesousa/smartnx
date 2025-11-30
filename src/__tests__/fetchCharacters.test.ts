import { fetchCharacters } from "../api/swapi";
import type { Character } from "../types";

describe("fetchCharacters", () => {
  const mockResponse = {
    count: 1,
    next: null,
    previous: null,
    results: [{ name: "Luke Skywalker" } as Character],
  };

  beforeEach(() => {
    // limpa mocks antes de cada teste
    global.fetch = jest.fn();
  });

  it("deve buscar personagens com page e search corretos", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await fetchCharacters(2, "luke");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/people/?page=2&search=luke"
    );

    expect(data).toEqual(mockResponse);
  });

  it("deve buscar personagens apenas com page quando search estiver vazio", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchCharacters(3);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/people/?page=3"
    );
  });

  it("deve lançar erro quando response.ok for false", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchCharacters(1)).rejects.toThrow(
      "Erro ao buscar personagens"
    );
  });
});
