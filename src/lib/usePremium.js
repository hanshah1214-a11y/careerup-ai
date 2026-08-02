import { useCallback, useEffect, useState } from "react";
import { loadEntitlement, saveEntitlement, clearEntitlement } from "./unlock.js";

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
  const [entitlement, setEntitlement] = useState(() => loadEntitlement());
  const [isPremium, setIsPremium] = useState(
    () => sessionStorage.getItem("careerup_premium") === "1" || !!loadEntitlement()
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

  const upgrade = useCallback(
    (plan = "Premium", expiresAt = null) => {
      if (expiresAt) {
        const ent = { plan, expiresAt };
        saveEntitlement(ent);
        setEntitlement(ent);
      }
      sessionStorage.setItem("careerup_premium", "1");
      setIsPremium(true);
    },
    []
  );

  const downgrade = useCallback(() => {
    sessionStorage.removeItem("careerup_premium");
    clearEntitlement();
    setEntitlement(null);
    setIsPremium(false);
  }, []);

  const remaining = (feature, limit) => Math.max(0, limit - unlocksToday(feature));

  return {
    isPremium,
    plan: entitlement?.plan || (isPremium ? "Premium" : "Free"),
    expiresAt: entitlement?.expiresAt || null,
    upgrade,
    downgrade,
    remaining,
    unlocksToday,
    consume,
  };
}
