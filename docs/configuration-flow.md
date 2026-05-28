# Clampography Configuration Flow

This document illustrates how the Clampography plugin processes configuration options (`base`, `extra`, `forms`, `kbd`, `themes`) and how they interact to generate the final CSS.

## Plugin Architecture Diagram

```mermaid
flowchart TD
    %% Input
    Config([plugin.withOptions]) --> O_Base{base?}
    Config --> O_Extra{extra?}
    Config --> O_Forms{forms?}
    Config --> O_Kbd{kbd?}
    Config --> O_Themes{themes?}

    %% Base Logic
    O_Base -- true\n(default) --> B_Yes["Injects Structural CSS<br>- clamp() typography<br>- root font-size<br>- basic margins"]
    O_Base -- false --> B_No["No base styles injected"]

    %% Extra Logic
    O_Extra -- true --> E_Yes["Injects Opinionated UI<br>- blockquote borders<br>- table zebra stripes<br>- link & code styling"]
    O_Extra -- false\n(default) --> E_No["No extra styles injected"]

    %% Forms Logic
    O_Forms -- true --> F_Yes["Injects Form Styles<br>- buttons (default & primary)<br>- inputs, textarea, select<br>- checkbox, radio, range<br>- file, color, fieldset<br>- validation & readonly states"]
    O_Forms -- false\n(default) --> F_No["No form styles injected"]

    %% Kbd Logic
    O_Kbd -- true --> K_Yes["Injects <kbd> Styles<br>- 3D isometric key effect<br>- layered box-shadow depth<br>- :active press animation"]
    O_Kbd -- false\n(default) --> K_No["No kbd styles injected"]

    %% Themes Logic
    O_Themes -- "'all' or ['theme1']" --> T_Yes["Generates Color Variables<br>--clampography-primary<br>--clampography-surface<br>etc."]
    O_Themes -- false\n(default) --> T_No["No colors generated<br>Bring Your Own Theme mode"]

    %% Dependencies & Interactions
    B_Yes -.-> Output((Tailwind AST))

    E_Yes -. "Consumes CSS Variables" .-> T_Yes
    E_Yes -. "Missing Variables?" .-> UserCSS[/User's Custom CSS/]
    E_Yes -.-> Output

    F_Yes -. "Consumes CSS Variables" .-> T_Yes
    F_Yes -.-> Output

    K_Yes -. "Consumes CSS Variables" .-> T_Yes
    K_Yes -.-> Output

    T_Yes -.-> Output

    %% User interaction in BYOT
    UserCSS -. "Provides Custom Colors" .-> Output

    classDef default fill:#1e1e1e,stroke:#333,stroke-width:2px,color:#ddd
    classDef input fill:#2563eb,stroke:#1d4ed8,stroke-width:2px,color:#fff
    classDef yes fill:#166534,stroke:#14532d,stroke-width:2px,color:#fff
    classDef no fill:#991b1b,stroke:#7f1d1d,stroke-width:2px,color:#fff
    classDef output fill:#7e22ce,stroke:#581c87,stroke-width:2px,color:#fff
    classDef user fill:#ea580c,stroke:#c2410c,stroke-width:2px,color:#fff

    class Config input
    class B_Yes,E_Yes,F_Yes,K_Yes,T_Yes yes
    class B_No,E_No,F_No,K_No,T_No no
    class Output output
    class UserCSS user
```

## How It Works

1. **`base` (Structural)**: On by default. Provides the responsive mathematical foundation. It doesn't add colors, just sizes, spacing, and fluid `clamp()` functions.
2. **`extra` (Opinionated)**: Off by default. Adds advanced visual polish to specific HTML elements (like borders, shadows, backgrounds). It relies on CSS variables for its colors.
3. **`forms` (Form Elements)**: Off by default. Styles all native HTML form controls — buttons, inputs, textarea, select, checkboxes, radios, range, file, color picker, fieldset, legend, label, output, meter, and progress. Includes `:focus`, `:disabled`, `[readonly]`, and `:user-invalid` states.
4. **`kbd` (Keyboard Keys)**: Off by default. Applies a 3D isometric effect to `<kbd>` elements using layered `box-shadow`. Includes an `:active` press animation.
5. **`themes` (Colors)**: Off by default. Automatically generates and injects color palettes.
   - If `extra`, `forms`, or `kbd` are **ON** but `themes` is **OFF**, the plugin enters **Bring Your Own Theme (BYOT)** mode. The structures will render, but the developer must define `--clampography-*` variables in their own CSS to colorize the components.
