import { Slider } from "@/components/ui/slider";
import { roundToHundreds } from "@/lib/utils";

const marks = [
  { label: "30s", value: 30 },
  { label: "1m", value: 60 },
  { label: "5m", value: 300 },
  { label: "30m", value: 1800 },
  { label: "1h", value: 3600 },
  { label: "12h", value: 43200 },
  { label: "24h", value: 86400 },
];

const uiPositions = marks.map((_, i) => i * (100 / (marks.length - 1)));

// Precompute pairs to simplify interpolation loops
const markPairs = marks.slice(0, -1).map((m, i) => ({
  a: m,
  b: marks[i + 1],
  uiA: uiPositions[i],
  uiB: uiPositions[i + 1],
}));

const interpolate = (
  x: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number
) => y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);

const realToUI = (real: number): number => {
  for (const { a, b, uiA, uiB } of markPairs) {
    if (real >= a.value && real <= b.value) {
      return interpolate(real, a.value, b.value, uiA, uiB);
    }
  }
  return 0;
};

const uiToReal = (pct: number): number => {
  for (const { a, b, uiA, uiB } of markPairs) {
    if (pct >= uiA && pct <= uiB) {
      return interpolate(pct, uiA, uiB, a.value, b.value);
    }
  }
  return 0;
};

const formatLabel = (v: number) => {
  if (v < 60) return `${v}s`;
  if (v < 3600) return `${Math.round(v / 60)}m`;
  return `${Math.round(v / 3600)}h`;
};

export default function IntervalSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: { value: number; label: string }) => void;
}) {
  const uiValue = realToUI(value);

  const handleSliderChange = (vals: number[]) => {
    const pct = vals[0];
    const realValue = Math.round(uiToReal(pct));

    onChange({
      value: roundToHundreds(realValue),
      label: formatLabel(realValue),
    });
  };

  return (
    <div className="w-full">
      <Slider
        value={[uiValue]}
        onValueChange={handleSliderChange}
        min={0}
        max={100}
        step={0.1}
        className="w-full transition-all duration-300 ease-out"
      />

      <div className="relative w-full mt-4 h-5">
        {marks.map((mark, index) => (
          <span
            key={mark.value}
            className="absolute text-xs text-gray-500 whitespace-nowrap transition-all duration-300 ease-out"
            style={{ left: `calc(${uiPositions[index]}% - 14px)` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  );
}
