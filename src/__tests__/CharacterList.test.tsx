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
    render(<CharacterList searchQuery="" />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
  });

  it("exibe informações do personagem no card", async () => {
    render(<CharacterList searchQuery="" />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("19BBY")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText(/172 cm/)).toBeInTheDocument();
    expect(screen.getByText(/77 kg/)).toBeInTheDocument();
  });

  it("recarrega os dados quando searchQuery muda", async () => {
    const { rerender } = render(<CharacterList searchQuery="" />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

    rerender(<CharacterList searchQuery="luke" />);

    await waitFor(() => {
      expect(fetchCharacters).toHaveBeenCalledWith(1, "luke");
    });
  });

  it("abre o Drawer ao clicar no botão de detalhes (ícone Eye)", async () => {
    render(<CharacterList searchQuery="" />);

    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

    // Encontra o botão com ícone Eye através do tooltip
    const detailsBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(detailsBtn);

    // Drawer aparece com o nome do personagem
    await waitFor(() => {
      expect(
        screen.getAllByText("Luke Skywalker").length
      ).toBeGreaterThanOrEqual(2);
    });

    // Aguarda os dados resolvidos
    await waitFor(() => {
      expect(fetchResourceName).toHaveBeenCalled();
    });

    expect(screen.getByTestId("homeworld")).toHaveTextContent("Resolved Name");
  });

  it("exibe listas resolvidas (filmes, veículos, naves, espécies) no drawer", async () => {
    render(<CharacterList searchQuery="" />);

    // Aguarda o personagem aparecer
    expect(await screen.findByText("Luke Skywalker")).toBeInTheDocument();

    // Encontra o botão com ícone Eye
    const detailsBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(detailsBtn);

    await waitFor(() => {
      expect(fetchResourceName).toHaveBeenCalledTimes(5); // homeworld + 4 categorias
    });

    expect(screen.getAllByText("Resolved Name").length).toBeGreaterThan(1);
  });

  it("exibe mensagem quando não há personagens", async () => {
    (fetchCharacters as jest.Mock).mockResolvedValue({
      count: 0,
      results: [],
    });

    render(<CharacterList searchQuery="xyz" />);

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum personagem encontrado")
      ).toBeInTheDocument();
    });
  });

  it("exibe skeleton durante o carregamento", () => {
    const { container } = render(<CharacterList searchQuery="" />);

    // Verifica se os skeletons estão renderizados usando Testing Library
    const skeletons = container.querySelectorAll(
      ".character-card.skeleton-card"
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
