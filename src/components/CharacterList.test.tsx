import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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

beforeEach(() => {
  // @ts-ignore
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renderiza lista de personagens e mostra Luke", async () => {
  render(<CharacterList />);
  expect(screen.getByPlaceholderText(/Filtrar por nome/i)).toBeInTheDocument();
  // aguarda o fetch e a tabela aparecer
  await waitFor(() =>
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
  );
});
