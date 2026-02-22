import { useEffect, useState } from "react";

export default function Bogey({ count, object, show }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!show) {
      setVisibleCount(0);
      return;
    }

    let i = 0;
    setVisibleCount(0);

    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= count) clearInterval(interval);
    }, 700);

    return () => clearInterval(interval);
  }, [show, count]);

return (
  <div className="bogey-wrapper">
    {/* trailing connector */}
    <div className="bogey-trail" />

    <div className="bogey">
      <div className="bogey-body">
        {show &&
          Array.from({ length: visibleCount }).map((_, i) => (
            <span key={i} className="bogey-object fade-in">
              {object}
            </span>
          ))}
      </div>
    </div>

    <div className="bogey-wheels">
      <div className="wheel" />
      <div className="wheel" />
    </div>
  </div>
);


}
