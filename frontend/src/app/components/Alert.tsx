import { AlertCircle, CheckCircle, X, Info } from "lucide-react";

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      iconColor: 'text-green-400'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      iconColor: 'text-orange-400'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 glass border ${config.borderColor} ${config.bgColor} rounded-lg`}>
      <Icon size={20} className={config.iconColor} />
      <span className={`flex-1 ${config.textColor} font-inter`} style={{ fontFamily: 'var(--font-inter)' }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 hover:bg-white/10 rounded transition-colors ${config.textColor}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
