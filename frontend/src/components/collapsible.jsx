import React,{ useState, useEffect, useMemo } from "react";

export const Collapsible = React.memo(({ title, section, children }) => {
  let [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((v) => !v);
  };
  const buttonTitle = useMemo(() => `${title} ${open ? "▲" : "▼"}`, [title, open]);
  return (
    <section className={`collapsible_${section} ${open ? "open" : ""}`}>
      <button type="button" onClick={handleToggle}>
        {buttonTitle}
      </button>
      <div className={`collapsible_body_${section}`}>{children}</div>
    </section>
  );
});
