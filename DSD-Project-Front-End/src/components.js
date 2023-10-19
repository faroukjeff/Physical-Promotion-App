import React from "react";
import mcqcomponent from "./components/form/McqComponent";
import openanscomponent from "./components/form/OpenAnsComponent";

const Components = {
  mcqcomponent: mcqcomponent,
  openanscomponent: openanscomponent,
};

// eslint-disable-next-line
export default (block) => {
  // component does exist
  if (typeof Components[block.component] !== "undefined") {
    return React.createElement(Components[block.component], {
      formdata: block.formdata,
    });
  }
  // component doesn't exist yet do nothing
};
