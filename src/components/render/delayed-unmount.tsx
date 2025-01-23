import { useEffect, useState } from 'react';

interface DelayedUnmountProps {
  children: React.ReactNode;
  delay: number;
  show: boolean;
}

const DelayedUnmount: React.FC<DelayedUnmountProps> = ({ children, delay, show }) => {
  const [shouldRender, setShouldRender] = useState(false);
  let timer: number;

  useEffect(() => {
    if (show) {
      window.clearTimeout(timer);
      setShouldRender(true);
      return;
    }

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      setShouldRender(false);
    }, delay);
  }, [show, shouldRender]);

  return shouldRender ? children : null;
};
DelayedUnmount.displayName = 'DelayedUnmount';

export default DelayedUnmount;
