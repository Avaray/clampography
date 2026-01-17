export default (options = {}) => {
  const root = options.root || ":root";

  // Helper to scope selectors safely
  const scope = (selector) => {
    const parts = [];
    let current = "";
    let depth = 0;

    for (let i = 0; i < selector.length; i++) {
      const char = selector[i];
      if (char === "(") depth++;
      if (char === ")") depth--;
      if (char === "," && depth === 0) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    return parts
      .filter(Boolean)
      .map((part) => {
        if (part === ":root" || part === "body") return root;
        return `${root} ${part}`;
      })
      .join(", ");
  };

  return {
    // Forms
    [scope("input, button, textarea, select, optgroup")]: {
      "font-family": "inherit",
      "font-size": "100%",
      "line-height": "inherit",
    },

    [scope("textarea")]: {
      "line-height": "1.5",
    },

    [scope("button, [type='button'], [type='reset'], [type='submit']")]: {
      cursor: "pointer",
    },

    // Buttons
    [scope(":where(button, [type='button'], [type='reset'], [type='submit'])")]:
      {
        "padding": "var(--spacing-xs) var(--spacing-sm)",
        "background-color": "var(--clampography-background)",
        "color": "var(--clampography-text)",
        "border": "1px solid var(--clampography-border)",
        "border-radius": "0.375rem",
        "transition-property": "background-color, border-color",
        "transition-duration": "150ms",
      },

    [
      scope(
        ":where(button, [type='button'], [type='reset'], [type='submit']):hover",
      )
    ]: {
      "background-color": "var(--clampography-surface)",
    },

    // Inputs
    [
      scope(
        ":where(input:not([type='checkbox'], [type='radio']), textarea, select)",
      )
    ]: {
      "padding": "var(--spacing-xs) var(--spacing-sm)",
      "background-color": "var(--clampography-background)",
      "color": "var(--clampography-text)",
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
      "transition-property": "border-color, box-shadow",
      "transition-duration": "150ms",
    },

    [
      scope(
        ":where(input:not([type='checkbox'], [type='radio']), textarea, select):focus",
      )
    ]: {
      "outline": "none",
      "border-color": "var(--clampography-primary)",
      "box-shadow":
        "0 0 0 3px color-mix(in oklab, var(--clampography-primary) 20%, transparent)",
    },

    // Select
    [scope("select")]: {
      "appearance": "none",
      "background-image":
        `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
      "background-position": "right 0.5rem center",
      "background-repeat": "no-repeat",
      "background-size": "1.5em 1.5em",
      "padding-right": "2.5rem",
    },

    // Fieldset & Legend
    [scope("fieldset")]: {
      "border": "1px solid var(--clampography-border)",
      "border-radius": "0.375rem",
    },

    [scope("legend")]: {
      "color": "var(--clampography-heading)",
    },
  };
};
