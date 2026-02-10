export const vars = {};

export function initVars(initialVars = {}) {
  // fully reset vars
  for (const k of Object.keys(vars)) delete vars[k];
  for (const [k, v] of Object.entries(initialVars)) vars[k] = v;
}

export function applyEffects(effects = {}) {
  for (const [k, delta] of Object.entries(effects)) {
    const current = Number(vars[k] ?? 0);
    vars[k] = current + Number(delta);
  }
}

export function checkCondition(cond) {
  const left = Number(vars[cond.var] ?? 0);
  const right = Number(cond.value ?? 0);

  switch (cond.op) {
    case ">=": return left >= right;
    case "<=": return left <= right;
    case ">": return left > right;
    case "<": return left < right;
    case "==": return left === right;
    case "!=": return left !== right;
    default: return false;
  }
}

// NEW: used by save system
export function exportVars() {
  return { ...vars };
}
