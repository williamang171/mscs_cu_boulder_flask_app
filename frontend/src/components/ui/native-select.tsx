import type { CollectionItem } from '@chakra-ui/react';
import { NativeSelect as ChakraNativeSelect } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface NativeSelectRootProps extends ChakraNativeSelect.RootProps {
  icon?: React.ReactNode;
}

export const NativeSelectRoot = forwardRef<
  HTMLDivElement,
  NativeSelectRootProps
>(function NativeSelectRoot(props, ref) {
  const { icon, children, ...rest } = props;
  return (
    <ChakraNativeSelect.Root ref={ref} {...rest}>
      {children}
      <ChakraNativeSelect.Indicator>{icon}</ChakraNativeSelect.Indicator>
    </ChakraNativeSelect.Root>
  );
});

interface NativeSelectFieldProps extends ChakraNativeSelect.FieldProps {
  items?: CollectionItem[];
}

export const NativeSelectField = forwardRef<
  HTMLSelectElement,
  NativeSelectFieldProps
>(function NativeSelectField(props, ref) {
  const { items, children, ...rest } = props;
  return (
    <ChakraNativeSelect.Field ref={ref} {...rest}>
      {items?.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
      {children}
    </ChakraNativeSelect.Field>
  );
});
