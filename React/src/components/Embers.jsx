import { useMemo } from "react";

function Embers() {
  const embers = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      scale: 0.6 + Math.random() * 1.2
    }));
  }, []);

  return (
    <div className="embers">
      {embers.map((ember) => (
        <span
          key={ember.id}
          className="ember"
          style={{
            left: ember.left,
            animationDelay: ember.delay,
            animationDuration: ember.duration,
            transform: `scale(${ember.scale})`
          }}
        />
      ))}
    </div>
  );
}

export default Embers;