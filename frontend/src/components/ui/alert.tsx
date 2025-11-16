import { Alert as ChakraAlert } from '@chakra-ui/react';
import { forwardRef } from 'react';

export interface AlertProps extends ChakraAlert.RootProps {
  title?: string;
  icon?: React.ReactElement;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  const { title, children, icon, ...rest } = props;
  return (
    <ChakraAlert.Root ref={ref} {...rest}>
      {icon && <ChakraAlert.Indicator>{icon}</ChakraAlert.Indicator>}
      {!icon && <ChakraAlert.Indicator />}
      {children && (
        <ChakraAlert.Content>
          {title && <ChakraAlert.Title>{title}</ChakraAlert.Title>}
          {children && (
            <ChakraAlert.Description>{children}</ChakraAlert.Description>
          )}
        </ChakraAlert.Content>
      )}
    </ChakraAlert.Root>
  );
});
