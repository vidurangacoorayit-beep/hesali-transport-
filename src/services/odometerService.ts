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

function getOdometerErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code.replace(/^functions\//, '')
      : '';

  switch (code) {
    case 'unauthenticated':
      return 'ඔබගේ ගිණුමට නැවත Login වී උත්සාහ කරන්න.';

    case 'permission-denied':
      return 'මෙම Odometer Reading එක ඇතුළත් කිරීමට ඔබට අවසර නැහැ.';

    case 'invalid-argument':
      return 'ඇතුළත් කළ Odometer දත්ත පරීක්ෂා කර නැවත උත්සාහ කරන්න.';

    case 'failed-precondition':
      return 'මෙම Reading එක ඇතුළත් කළ නොහැකියි. පෙර Reading එක සහ අද දිනය පරීක්ෂා කරන්න.';

    case 'already-exists':
      return 'මෙම වාහනය සඳහා අද දින Odometer Reading එක දැනටමත් ඇතුළත් කර තිබෙනවා.';

    case 'not-found':
      return 'අදාළ වාහනයේ හෝ ගිණුමේ දත්ත සොයාගත නොහැකියි.';

    case 'resource-exhausted':
      return 'දැනට සේවාව භාවිත කිරීමේ සීමාව ඉක්මවා තිබෙනවා. පසුව නැවත උත්සාහ කරන්න.';

    case 'unavailable':
      return 'සේවාදායකය සමඟ සම්බන්ධ වීමට නොහැකියි. Internet connection එක පරීක්ෂා කර නැවත උත්සාහ කරන්න.';

    case 'internal':
    case 'unknown':
    default:
      return 'Odometer Reading එක යාවත්කාලීන කිරීම අසාර්ථක වුණා. නැවත උත්සාහ කරන්න.';
  }
}

export async function recordDailyManualOdometer(
  input: DailyManualOdometerInput,
): Promise<DailyManualOdometerResult> {
  try {
    const result = await recordOdometerCallable(input);
    return result.data;
  } catch (error: unknown) {
    throw new Error(getOdometerErrorMessage(error));
  }
}
