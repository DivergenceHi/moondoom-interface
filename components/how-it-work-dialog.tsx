import * as Dialog from '@radix-ui/react-dialog';

export default function HowItWorkDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className={'bg-primary px-6 py-1 rounded-lg text-xl border-2 border-black ml-4'}>How it works</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={'DialogOverlay'} />
        <Dialog.Content className={'DialogContent font-roboto'}>
          <div className={'text-2xl font-bold text-center mb-4'}>How it works¿</div>
          <div className={'font-medium mb-4'}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lectus dui. Nulla facilisi. Fusce
            imperdiet arcu ut massa posuere, vitae ultricies elit facilisis.
          </div>
          <div className={'flex mb-4'}>
            <div className={'w-[100px] font-bold'}>Step 1:</div>
            <div className={'font-medium'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lectus dui.
            </div>
          </div>
          <div className={'flex'}>
            <div className={'w-[100px] font-bold'}>Step 2:</div>
            <div className={'font-medium'}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet lectus dui.
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Dialog.Close>
              <button className={'btn-md-primary !w-[120px] !drop-shadow-md'}>Start Trading</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
