# Clampography Configuration Flow

This document illustrates how the Clampography plugin processes configuration options (`base`, `extra`, `themes`) and how they interact to generate the final CSS.

## Plugin Architecture Diagram

```mermaid
flowchart TD
    %% Input
    Config([plugin.withOptions]) --> O_Base{base?}
    Config --> O_Extra{extra?}
    Config --> O_Themes{themes?}

    %% Base Logic
    O_Base -- true\n(default) --> B_Yes["Injects Structural CSS<br>- clamp() typography<br>- root font-size<br>- basic margins"]
    O_Base -- false --> B_No["No base styles injected"]

    %% Extra Logic
    O_Extra -- true --> E_Yes["Injects Opinionated UI<br>- blockquote borders<br>- table zebra stripes<br>- form inputs styling"]
    O_Extra -- false\n(default) --> E_No["No extra styles injected"]
    
    %% Themes Logic
    O_Themes -- "'all' or ['theme1']" --> T_Yes["Generates Color Variables<br>--clampography-primary<br>--clampography-surface<br>etc."]
    O_Themes -- false\n(default) --> T_No["No colors generated<br>Bring Your Own Theme mode"]

    %% Dependencies & Interactions
    B_Yes -.-> Output((Tailwind AST))
    
    E_Yes -. "Consumes CSS Variables" .-> T_Yes
    E_Yes -. "Missing Variables?" .-> UserCSS[/User's Custom CSS/]
    E_Yes -.-> Output
    
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
    class B_Yes,E_Yes,T_Yes yes
    class B_No,E_No,T_No no
    class Output output
    class UserCSS user
```

## How It Works

1. **`base` (Structural)**: On by default. Provides the responsive mathematical foundation. It doesn't add colors, just sizes, spacing, and fluid `clamp()` functions.
2. **`extra` (Opinionated)**: Off by default. Adds advanced visual polish to specific HTML elements (like borders, shadows, backgrounds). It relies heavily on CSS variables for its colors.
3. **`themes` (Colors)**: Off by default. Automatically generates and injects color palettes. 
   - If `extra` is **ON** but `themes` is **OFF**, the plugin enters **Bring Your Own Theme (BYOT)** mode. The structures will render, but the developer must define `--clampography-*` variables in their own CSS to colorize the components.
