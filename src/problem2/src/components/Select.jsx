import React from "react";
import ChevronDownIcon from "../icons/ChervonDownIcon";
import "rc-select/assets/index.css";
import "../css/select.css";
import RcSelect from "rc-select";

const Select = (props) => {
  return (
    <RcSelect
      animation="slide-up"
      choiceTransitionName="rc-select-selection__choice-zoom"
      suffixIcon={<ChevronDownIcon width="1.2em" height="1.2em" />}
      {...props}
    />
  );
};

export default Select;
