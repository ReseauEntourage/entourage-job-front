import { AnyCantFix } from 'src/utils/Types';

declare global {
  interface Window {
    lintrk: AnyCantFix;
  }
}

export const linkEvent = ({ conversionId }: { conversionId: number }) => {
  if (window.lintrk) window.lintrk('track', { conversion_id: conversionId });
};
