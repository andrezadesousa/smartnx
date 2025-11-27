import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CharacterList from "../components/CharacterList";
import { fetchCharacters } from "../api/swapi";
import { fetchResourceName } from "../utils/fetchResourceName";

jest.mock("../api/swapi");
jest.mock("../utils/fetchResourceName");

// Mock necessário p/ Drawer e grid do Ant Design
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: any) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

describe("CharacterList Component", () => {
  const mockCharacter = {
    name: "Luke Skywalker",
    url: "1",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: ["film1"],
    species: ["species1"],
    vehicles: ["vehicle1"],
    starships: ["ship1"],
    created: "2024-01-01",
    edited: "2024-01-02",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (fetchCharacters as jest.Mock).mockResolvedValue({
      count: 1,
      results: [mockCharacter],
    });

    (fetchResourceName as jest.Mock).mockResolvedValue("Resolved Name");
  });

  it("renderiza o personagem carregado", async () => {
    render(<CharacterList />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("dispara o search e recarrega os dados", async () => {
    render(<CharacterList />);

    const input = screen.getByPlaceholderText(/Filtrar por nome/i);
    fireEvent.change(input, { target: { value: "luke" } });

    const button = screen.getByRole("button", { name: /search/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(1, "luke");
    });
  });

  it("abre o Drawer ao clicar em Detalhes e resolve o planeta", async () => {
    render(<CharacterList />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

    const detailsBtn = screen.getByText(/detalhes/i);
    fireEvent.click(detailsBtn);

    // Drawer aparece com o nome do personagem
    expect(await screen.findAllByText("Luke Skywalker")).toHaveLength(2);

    // Aguarda os dados resolvidos
    await waitFor(() => {
      expect(fetchResourceName).toHaveBeenCalled();
    });

    expect(screen.getByTestId("homeworld")).toHaveTextContent("Resolved Name");
  });

  it("exibe listas resolvidas (filmes, veículos, naves, espécies)", async () => {
    render(<CharacterList />);

    fireEvent.click(await screen.findByText(/detalhes/i));

    await waitFor(() => {
      expect(fetchResourceName).toHaveBeenCalledTimes(5); // homeworld + 4 categorias
    });

    expect(screen.getAllByText("Resolved Name").length).toBeGreaterThan(1);
  });
});
