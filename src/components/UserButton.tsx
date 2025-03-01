import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export function UserButton() {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          userButtonBox: 'h-8 w-8',
          userButtonTrigger: 'h-8 w-8',
          userButtonAvatarBox: 'h-8 w-8',
          userButtonPopoverCard: 'shadow-lg border rounded-lg',
          userPreviewMainIdentifier: 'font-semibold',
          userPreviewSecondaryIdentifier: 'text-gray-600',
          userButtonPopoverActionButton: 'hover:bg-gray-50',
          userButtonPopoverActionButtonText: 'text-gray-600',
          userButtonPopoverActionButtonIcon: 'text-gray-600',
          userButtonPopoverFooter: 'border-t',
        },
      }}
    />
  );
} 