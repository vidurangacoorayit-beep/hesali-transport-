import {initializeApp, getApps} from "firebase-admin/app";
import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";

if (getApps().length === 0) {
  initializeApp();
}

const db = getFirestore();

export const recordDailyManualOdometer = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Please sign in before updating the odometer.",
    );
  }

  const uid = request.auth.uid;
  const data = request.data as Record<string, unknown>;

  const vehicleId = data.vehicleId;
  const readingKm = data.readingKm;
  const readingDate = data.readingDate;
  const suppliedReason = data.reason;

  if (
    typeof vehicleId !== "string" ||
    !/^[A-Za-z0-9_-]{1,64}$/.test(vehicleId)
  ) {
    throw new HttpsError("invalid-argument", "Invalid vehicle ID.");
  }

  if (
    typeof readingKm !== "number" ||
    !Number.isSafeInteger(readingKm) ||
    readingKm < 0
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Odometer reading must be a valid whole number.",
    );
  }

  if (
    typeof readingDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(readingDate) ||
    Number.isNaN(Date.parse(`${readingDate}T00:00:00.000Z`)) ||
    new Date(`${readingDate}T00:00:00.000Z`)
      .toISOString()
      .slice(0, 10) !== readingDate
  ) {
    throw new HttpsError(
      "invalid-argument",
      "A valid reading date is required.",
    );
  }

  const sriLankaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  if (readingDate !== sriLankaDate) {
    throw new HttpsError(
      "invalid-argument",
      "Only today's Sri Lanka odometer reading date is allowed.",
    );
  }

  const reason = typeof suppliedReason === "string" ?
    suppliedReason.trim().slice(0, 500) :
    "";

  const userRef = db.collection("users").doc(uid);

  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    throw new HttpsError("permission-denied", "User profile not found.");
  }

  const userData = userSnapshot.data();
  const companyID = userData?.companyID;
  const role = userData?.role;

  if (
    userData?.isActive !== true ||
    typeof companyID !== "string" ||
    !companyID ||
    typeof role !== "string"
  ) {
    throw new HttpsError(
      "permission-denied",
      "Your account is not active or is missing company information.",
    );
  }

  if (role !== "accountant") {
    throw new HttpsError(
      "permission-denied",
      "Only an authorized Accountant can record daily manual odometer readings.",
    );
  }

  const companyRef = db.collection("companies").doc(companyID);
  const vehicleRef = companyRef.collection("vehicles").doc(vehicleId);
  const dailyRef = vehicleRef.collection("odometerDaily").doc(readingDate);
  const historyRef = vehicleRef.collection("odometerHistory").doc();

  let previousReadingKm = 0;

  await db.runTransaction(async (transaction) => {
    const [
      transactionUserSnapshot,
      companySnapshot,
      vehicleSnapshot,
      dailySnapshot,
    ] = await Promise.all([
      transaction.get(userRef),
      transaction.get(companyRef),
      transaction.get(vehicleRef),
      transaction.get(dailyRef),
    ]);

    if (!transactionUserSnapshot.exists) {
      throw new HttpsError(
        "permission-denied",
        "User profile not found.",
      );
    }

    const transactionUserData = transactionUserSnapshot.data();

    if (
      transactionUserData?.isActive !== true ||
      transactionUserData?.companyID !== companyID ||
      transactionUserData?.role !== "accountant"
    ) {
      throw new HttpsError(
        "permission-denied",
        "Your Accountant access is no longer authorized.",
      );
    }

    if (
      !companySnapshot.exists ||
      companySnapshot.data()?.status !== "Active"
    ) {
      throw new HttpsError(
        "failed-precondition",
        "Company is not active.",
      );
    }

    if (!vehicleSnapshot.exists) {
      throw new HttpsError("not-found", "Vehicle not found.");
    }

    const vehicleData = vehicleSnapshot.data();

    if (vehicleData?.status !== "Active") {
      throw new HttpsError(
        "failed-precondition",
        "Vehicle is not active.",
      );
    }

    if (dailySnapshot.exists) {
      throw new HttpsError(
        "already-exists",
        "A daily odometer entry already exists for this vehicle and date.",
      );
    }

    const currentManualReading = vehicleData?.manualOdometerKm;

    if (
      typeof currentManualReading !== "number" ||
      !Number.isSafeInteger(currentManualReading) ||
      currentManualReading < 0
    ) {
      throw new HttpsError(
        "failed-precondition",
        "The existing manual odometer reading must be verified first.",
      );
    }

    previousReadingKm = currentManualReading;

    if (readingKm < previousReadingKm) {
      throw new HttpsError(
        "failed-precondition",
        "A lower reading requires the authorized correction process.",
      );
    }

    transaction.create(dailyRef, {
      vehicleId,
      readingDate,
      previousReadingKm,
      readingKm,
      actorUid: uid,
      actorRole: role,
      source: "accountant",
      reason: reason || "Daily manual odometer entry",
      createdAt: FieldValue.serverTimestamp(),
    });

    transaction.create(historyRef, {
      action: "DAILY_MANUAL_ODOMETER_RECORDED",
      vehicleId,
      readingDate,
      previousReadingKm,
      newReadingKm: readingKm,
      actorUid: uid,
      actorRole: role,
      source: "accountant",
      reason: reason || "Daily manual odometer entry",
      createdAt: FieldValue.serverTimestamp(),
    });

    transaction.update(vehicleRef, {
      manualOdometerKm: readingKm,
      manualOdometerDate: readingDate,
      manualOdometerUpdatedAt: FieldValue.serverTimestamp(),
      manualOdometerUpdatedBy: uid,
    });
  });

  return {
    success: true,
    vehicleId,
    previousReadingKm,
    manualOdometerKm: readingKm,
    readingDate,
    message: "Daily manual odometer reading saved successfully.",
  };
});
