interface StatusDisplayProps {
  status: string;
  className?: string;
}

export const StatusDisplay = ({ status, className }: StatusDisplayProps) => {
  return (
    <div className={className || "mb-4"}>
      <p className="text-lg">
        ステータス: <span className="font-semibold">{status}</span>
      </p>
    </div>
  );
};