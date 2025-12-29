export default {
  "hr": {
    "height": "1px",
    "border-width": "0",
    "margin-top": "3rem", /* my-12 (12 * 0.25rem) */
    "margin-bottom": "3rem", /* my-12 */
    "background-color": "var(--clampography-secondary)",
  },

  "blockquote": {
    "border-left-width": "4px",
    "border-color": "var(--clampography-primary)",
    "padding-left": "1rem", /* pl-4 */
    "padding-top": "0.5rem", /* py-2 */
    "padding-bottom": "0.5rem", /* py-2 */
    "padding-right": "0.5rem", /* pr-2 */
  },

  "a": {
    "color": "var(--clampography-link)",
    "font-weight": "700", /* font-bold */
    "letter-spacing": "0.025em", /* tracking-wide */
    "text-decoration-line": "underline",
    "text-decoration-thickness": "2px", /* decoration-2 */
    "text-underline-offset": "4px", /* underline-offset-4 */
    "transition-property": "color, text-decoration-color",
    "transition-duration": "150ms", /* duration-150 */
  },

  "a:hover": {
    // Używamy zmiennej zdefiniowanej w themes.js (bez prefixu --color-)
    "text-decoration-color": "var(--clampography-primary)",
  },
};
