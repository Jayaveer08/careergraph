interface Props {
  name: string;
  category: string;
  onRemove?: () => void;
}

export default function SkillChip({ name, category, onRemove }: Props) {
  return (
    <span className={`chip cat-${category}`}>
      {name}
      {onRemove && (
        <button className="chip-remove" onClick={onRemove} aria-label={`Remove ${name}`}>
          ×
        </button>
      )}
    </span>
  );
}
