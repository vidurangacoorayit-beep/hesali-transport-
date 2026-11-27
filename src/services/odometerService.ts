import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebaseConfig';

export type DailyManualOdometerInput = {
  vehicleId: string;
  readingKm: number;
  readingDate: string;
  reason?: string;
};

export type DailyManualOdometerResult = {
  success: boolean;
  vehicleId: string;
  previousReadingKm: number;
  manualOdometerKm: number;
  readingDate: string;
  message: string;
};

const recordOdometerCallable = httpsCallable<
  DailyManualOdometerInput,
  DailyManualOdometerResult
>(functions, 'recordDailyManualOdometer');

export async function recordDailyManualOdometer(
  input: DailyManualOdometerInput,
): Promise<DailyManualOdometerResult> {
  const result = await recordOdometerCallable(input);
  return result.data;
}
