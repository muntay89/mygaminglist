import { useMemo } from "react";

function Embers() {
  const embers = useMemo(() => {
    const duration = 12 + Math.random() * 1.5
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * duration}s`,
      duration: `${duration}s`,
      scale: 0.5 + Math.random() * 1,
      size: `${4 + Math.random() * 5}px`,
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