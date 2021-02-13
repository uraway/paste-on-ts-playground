import { createContext, FC, useContext, useMemo, useState } from 'react';

export interface TabsContextType {
  currentIndex: number;
  onChange: (index: number) => void;
}

const TabsContext = createContext<TabsContextType>({
  currentIndex: 0,
  onChange: () => void 0,
});

export const useTabsContext = () => useContext(TabsContext);

export const Tabs: FC = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const _ctx = useMemo(
    () => ({
      currentIndex,
      onChange: (index: number) => setCurrentIndex(index),
    }),
    [currentIndex, setCurrentIndex]
  );
  return <TabsContext.Provider value={_ctx}>{children}</TabsContext.Provider>;
};
