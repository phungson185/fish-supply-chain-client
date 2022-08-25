import React from 'react';
import NumberFormat from 'react-number-format';

const InputNumber = React.forwardRef(({ onChange, ...props }, ref) => (
  <NumberFormat
    {...props}
    getInputRef={ref}
    allowNegative={false}
    onValueChange={({ floatValue }) => {
      onChange({ target: { value: floatValue } });
    }}
  />
));

export default InputNumber;
