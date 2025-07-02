interface WarningMessageProps {
  show: boolean;
  message?: string;
  className?: string;
}

export const WarningMessage = ({ 
  show, 
  message = "人物検知機能を使用するには、TensorFlow.jsとCOCO-SSDモデルが必要です。",
  className 
}: WarningMessageProps) => {
  if (!show) return null;

  return (
    <div className={className || "mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded"}>
      <p className="text-sm">{message}</p>
    </div>
  );
};