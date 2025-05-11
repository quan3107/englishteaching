import * as React from "react";
import { createComponent } from "@toolpad/studio/browser";

export interface AppbarProps {
  msg: string;
}

function Appbar({ msg }: AppbarProps) {
  return <div>{msg}</div>;
}

export default createComponent(Appbar, {
  argTypes: {
    msg: {
      type: "string",
      default: "Hello world!",
    },
  },
});
