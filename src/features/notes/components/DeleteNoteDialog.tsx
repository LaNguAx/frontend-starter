import { AlertDialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

// Radix AlertDialog: the accessible confirm-before-destructive-action pattern.
// Focus is trapped, Esc cancels, and screen readers announce it per the WAI-ARIA
// alertdialog spec — none of which a hand-rolled modal gets for free.
export function DeleteNoteDialog({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useTranslation();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger className="text-sm text-red-600 hover:underline">{t('notes.delete')}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded border border-gray-300 bg-white p-6 shadow-lg">
          <AlertDialog.Title className="font-semibold">{t('notes.deleteConfirm.title')}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
            {t('notes.deleteConfirm.description')}
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialog.Cancel className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">
              {t('notes.deleteConfirm.cancel')}
            </AlertDialog.Cancel>
            <AlertDialog.Action
              onClick={onConfirm}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
            >
              {t('notes.deleteConfirm.confirm')}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
