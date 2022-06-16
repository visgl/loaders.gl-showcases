// https://styled-components.com/docs/api#typescript
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    name?: 0 | 1;
    colors: { [name: string]: string };
  }
}
