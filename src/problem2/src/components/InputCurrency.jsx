import InputNumber from "rc-input-number";
import React, { memo } from "react";
import "../css/input-currency.css";
import Select from "./Select";

const InputCurrency = (props) => {
  const { onChangeTypeCurrency, typeCurrency, optionsCurrency, ...restProps } =
    props;

  return (
    <InputNumber
      addonAfter={
        <Select
          labelInValue
          optionFilterProp="price"
          value={typeCurrency}
          onChange={(value) => {
            onChangeTypeCurrency(value);
          }}
          options={optionsCurrency}
          style={{ width: 100 }}
        />
      }
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
      prefixCls="rc-input-number"
      {...restProps}
    />
  );
};

export default memo(InputCurrency);
