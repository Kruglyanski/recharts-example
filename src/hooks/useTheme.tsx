import { useCallback, useEffect, useState } from "react";

export const useTheme = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.style.setProperty("--bg", "#000027");
      root.style.setProperty("--btn-bg", "#000027");
      root.style.setProperty("--btn-text", "#eee");
    } else {
      root.style.setProperty("--bg", "#eee");
      root.style.setProperty("--btn-bg", "#eee");
      root.style.setProperty("--btn-text", "#000");
    }
  }, [dark]);

  const toggleTheme = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  return {
    dark,
    toggleTheme,
  };
};
