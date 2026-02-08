# Specification

## Summary
**Goal:** Improve the Game Settings layout consistency across screen sizes and enhance 3D piece clarity (fix knight deformation and improve black piece top-view contrast).

**Planned changes:**
- Update the Game Settings panel layout so Board Mode, Difficulty Setting, and Player Mode are always aligned side-by-side in a single horizontal row on all screen sizes, while keeping Player Name available and preserving the existing restart-confirm behavior when changing settings mid-game.
- Redesign and replace the 3D Knight geometry to remove deformation artifacts while keeping the existing clean 3D style and ensuring the knight is clearly recognizable from a top-down view.
- Adjust 3D materials/colors for black pieces to add a consistent light-gray treatment on top-facing/upper surfaces across all black piece types, while keeping the main body dark and leaving white pieces unchanged.

**User-visible outcome:** The Settings panel shows the three key selects in one row on mobile/tablet/desktop, and in 3D mode the knight looks correct and black pieces are easier to distinguish from above due to improved top-surface contrast.
