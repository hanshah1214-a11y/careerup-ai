import { useCallback, useEffect, useState } from "react";

const KEY = "careerup_usage_v1";

function loadUsage() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function usePremium() {
  const [usage, setUsage] = useState(loadUsage);
  const [isPremium, setIsPremium] = useState(
    () => sessionStorage.getItem("careerup_premium") === "1"
  );

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(usage));
  }, [usage]);

  const today = new Date().toISOString().slice(0, 10);

  const unlocksToday = useCallback(
    (feature) => {
      const u = usage[today] || {};
      return u[feature] || 0;
    },
    [usage, today]
  );

  const consume = useCallback(
    (feature) => {
      setUsage((prev) => {
        const u = { ...(prev[today] || {}) };
        u[feature] = (u[feature] || 0) + 1;
        return { ...prev, [today]: u };
      });
      return true;
    },
    [today]
  );

  const upgrade = useCallback(() => {
    sessionStorage.setItem("careerup_premium", "1");
    setIsPremium(true);
  }, []);

  const remaining = (feature, limit) => Math.max(0, limit - unlocksToday(feature));

  return { isPremium, upgrade, remaining, unlocksToday, consume };
}
