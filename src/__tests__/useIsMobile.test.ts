import { renderHook, act } from "@testing-library/react-hooks";
import useIsMobile from "../hooks/useIsMobile";

describe("useIsMobile", () => {
  const originalInnerWidth = global.innerWidth;

  beforeEach(() => {
    global.innerWidth = 1024; // padrão
  });

  afterEach(() => {
    global.innerWidth = originalInnerWidth;
    jest.restoreAllMocks();
  });

  const triggerResize = () => {
    act(() => {
      global.dispatchEvent(new Event("resize"));
    });
  };

  it("retorna false quando a largura inicial é maior que 600px", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("retorna true quando a largura inicial é menor ou igual a 600px", () => {
    global.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("atualiza o valor após o resize", () => {
    const { result } = renderHook(() => useIsMobile(800));

    expect(result.current).toBe(false);

    global.innerWidth = 700;
    triggerResize();

    expect(result.current).toBe(true);
  });

  it("respeita maxWidth customizado", () => {
    const { result } = renderHook(() => useIsMobile(1200));
    expect(result.current).toBe(true); // 1024 <= 1200
  });

  it("remove o listener ao desmontar", () => {
    const spy = jest.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(spy).toHaveBeenCalled();
  });
});
