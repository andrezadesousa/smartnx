import React from "react";
import { render, screen } from "@testing-library/react";
import CharacterList from "./CharacterList";

const mockResponse = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      gender: "male",
      birth_year: "19BBY",
      url: "1",
    },
  ],
};

const mockFetch = () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });

beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation(mockFetch as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renderiza lista de personagens e mostra Luke Skywalker", async () => {
  render(<CharacterList />);

  // já está presente imediatamente
  expect(screen.getByPlaceholderText(/filtrar por nome/i)).toBeInTheDocument();

  // aguarda a requisição e renderização — sem waitFor!
  const luke = await screen.findByText(/luke skywalker/i);
  expect(luke).toBeInTheDocument();
});
