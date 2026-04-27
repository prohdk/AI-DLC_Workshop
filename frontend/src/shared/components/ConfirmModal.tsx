import { useTranslation } from 'react-i18next';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="confirm-modal">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <p className="text-lg mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded border min-h-[44px]" data-testid="confirm-modal-cancel">
            {t('common.cancel')}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-blue-600 text-white min-h-[44px]" data-testid="confirm-modal-confirm">
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
