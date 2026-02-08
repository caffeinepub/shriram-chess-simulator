# Specification

## Summary
**Goal:** Fix pawn promotion by adding an in-board overlay selection popup and strengthen the chess rules engine so validation (check, castling, legal moves, draws) matches standard rules.

**Planned changes:**
- Implement a new human pawn-promotion flow: detect a pawn reaching the last rank, pause move completion, and show an in-board overlay popup to choose Queen/Rook/Bishop/Knight.
- Expose “pending promotion” state from the game hook to the UI and wire selection to the existing promotion executor so the pending move completes and state clears.
- Ensure promotion behavior works in both 2D and 3D board modes, and that AI promotions complete with a valid promotion (defaulting to queen when unspecified).
- Fix and strengthen rules validation: correct pawn attack detection (diagonals only), enforce castling safety (not in/through/into check plus path/rook validation), and prevent illegal moves that leave the king in check (including en passant edge cases).
- Update draw validation to improve threefold repetition tracking (full relevant position state) and insufficient material detection (basic insufficient cases without false draws).

**User-visible outcome:** When a pawn reaches the last rank, players get an in-board promotion popup to select the piece before the move completes; gameplay correctly enforces check, castling legality, legal move constraints, and more accurate draw detection.
