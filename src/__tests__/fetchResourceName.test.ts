import { fetchResourceName } from "../utils/fetchResourceName";

global.fetch = jest.fn();

describe("fetchResourceName", () => {
  it("retorna 'name' quando existe", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ name: "Tatooine" }),
    });

    const result = await fetchResourceName("url");
    expect(result).toBe("Tatooine");
  });

  it("retorna 'title' quando 'name' não existe", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ title: "A New Hope" }),
    });

    const result = await fetchResourceName("url");
    expect(result).toBe("A New Hope");
  });

  it("retorna 'Desconhecido' quando resposta não for ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await fetchResourceName("url");
    expect(result).toBe("Desconhecido");
  });

  it("retorna 'Desconhecido' quando ocorre erro", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Falha"));

    const result = await fetchResourceName("url");
    expect(result).toBe("Desconhecido");
  });
});
