import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ConfigContextType {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
  locale: string;
  theme: 'light' | 'dark';
  updateConfig: (config: Partial<ConfigContextType>) => void;
}

const defaultConfig: ConfigContextType = {
  appName: 'Farutech',
  appVersion: '1.0.0',
  apiBaseUrl: '',
  locale: 'es',
  theme: 'light',
  updateConfig: () => {},
};

const ConfigContext = createContext<ConfigContextType>(defaultConfig);

interface ConfigProviderProps {
  children: ReactNode;
  config?: Partial<ConfigContextType>;
}

export function ConfigProvider({ children, config }: ConfigProviderProps) {
  const [overrides, setOverrides] = useState<Partial<ConfigContextType>>({});

  const updateConfig = useCallback((newConfig: Partial<ConfigContextType>) => {
    setOverrides((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const value = useMemo(
    () => ({ ...defaultConfig, ...config, ...overrides, updateConfig }),
    [config, overrides, updateConfig],
  );

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig debe usarse dentro de un ConfigProvider');
  }
  return context;
}
