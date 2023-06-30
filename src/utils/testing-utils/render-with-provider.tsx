import { render } from "@testing-library/react";
import { AppStore } from "../../redux/store";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";

export function renderWithProvider(ui: React.ReactElement, store: AppStore) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
