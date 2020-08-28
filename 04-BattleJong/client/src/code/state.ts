import React from "react";

interface ISelectedTile {
  layer: number;
  row: number;
  column: number;
  type: number;
}
interface IScores {
  player: number;
  opponent: number;
}

export function createState(inParentComponent: React.Component) {
  return {
    layout: <number[][][]>[],
    selectedTiles: <ISelectedTile[]>[],
    scores: <IScores>{ player: 0, opponent: 0 },
    gameState: <string>"awaitingOpponent",
    gameOutcome: <string>"",
  };
}
