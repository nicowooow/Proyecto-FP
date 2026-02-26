// colorPicker.jsx
import { HexAlphaColorPicker, HexColorPicker } from "react-colorful";
import React, { useMemo } from "react";

export const HAPC = React.memo(function HAPC({ liveRef, onCommit }) {
  // traemos dos variables las cuales son
  // liveRef -> esto nos trae la referencia del color que es elegido
  // onComit -> trae la funcion de poner el color de referencia en la variable original 
  const handleLiveColor = useMemo(
    () => (newColor) => {
      liveRef.current = newColor; // no hay re-render del padre
    },
    [liveRef],
  );

  return (
    <div onMouseUp={onCommit} onTouchEnd={onCommit}>
      <HexAlphaColorPicker
        id="back_color"
        color={liveRef.current}
        onChange={handleLiveColor}
      />
    </div>
  );
});

export const HPC = React.memo(function HPC({ liveRef, onCommit }) {
  const handleLiveColorPage = useMemo(
    () => (newColor) => {
      liveRef.current = newColor;
    },
    [liveRef],
  );

  return (
    <div onMouseUp={onCommit} onTouchEnd={onCommit}>
      <HexColorPicker
        color={liveRef.current}
        onChange={handleLiveColorPage}
      />
    </div>
  );
});
