/**
 * Jurisdiction profiles and the never-collected list. Our reading of the main
 * laws, not legal advice; a lawyer would review this before any deployment.
 * Content follows the submission deck (legality slide) and the master
 * document's jurisdiction profiles.
 */

export type FeatureState = "on" | "off" | "agreement";

export interface JurisdictionProfile {
  id: string;
  name: string;
  summary: string;
  features: {
    security: FeatureState;
    sensor: FeatureState;
    scheduledCapture: FeatureState;
    triggeredCapture: FeatureState;
    workforce: FeatureState;
  };
}

export const PROFILE_FEATURES: { key: keyof JurisdictionProfile["features"]; label: string }[] = [
  { key: "security", label: "Security part (cloud activity)" },
  { key: "sensor", label: "Desktop app activity" },
  { key: "scheduledCapture", label: "Scheduled screenshots" },
  { key: "triggeredCapture", label: "Screenshots around a serious alert" },
  { key: "workforce", label: "HR part" },
];

export const JURISDICTION_PROFILES: JurisdictionProfile[] = [
  {
    id: "full",
    name: "India / US: Full",
    summary: "Everything on, on company devices, with notice to staff at onboarding.",
    features: { security: "on", sensor: "on", scheduledCapture: "on", triggeredCapture: "on", workforce: "on" },
  },
  {
    id: "eu",
    name: "EU standard",
    summary: "No regular screenshots. Workforce reporting limited to aggregates.",
    features: { security: "on", sensor: "on", scheduledCapture: "off", triggeredCapture: "on", workforce: "on" },
  },
  {
    id: "de",
    name: "Germany",
    summary: "Monitoring features stay off until a works agreement with employee representatives is signed.",
    features: { security: "on", sensor: "agreement", scheduledCapture: "off", triggeredCapture: "agreement", workforce: "agreement" },
  },
  {
    id: "forensic",
    name: "Security only",
    summary: "Security part only. No desktop app and no HR part.",
    features: { security: "on", sensor: "off", scheduledCapture: "off", triggeredCapture: "off", workforce: "off" },
  },
];

export interface LawRow {
  law: string;
  requires: string;
  response: string;
}

export const LAW_ROWS: LawRow[] = [
  {
    law: "India DPDP Act, s.7(i)",
    requires: "Allows processing for employment and to prevent corporate espionage without consent.",
    response: "Runs only on company devices, with notice to staff.",
  },
  {
    law: "India DPDP Act, s.8",
    requires: "Reasonable security, and deletion once the purpose ends.",
    response: "Encryption, retention limits and automatic deletion.",
  },
  {
    law: "EU GDPR",
    requires: "Necessary and proportionate; strict on biometrics and automated decisions.",
    response: "Metadata only, no biometrics, and a person makes every decision.",
  },
  {
    law: "Germany: works councils",
    requires: "Monitoring tools need an agreement with employee representatives.",
    response: "Ships with a draft agreement and an app exclusion list.",
  },
  {
    law: "United States",
    requires: "Company-device monitoring with notice and acknowledgement.",
    response: "Notice at onboarding, with the policy kept on record.",
  },
];

/** Never collected, in any profile. */
export const NEVER_COLLECTED = [
  "Keystrokes",
  "Message and email text",
  "File contents",
  "Source code",
];

export const PROFILE_CHANGE_NOTE =
  "The profile is chosen at setup. Changing it is a logged administrative act that needs two approvals.";

export const LEGAL_DISCLAIMER =
  "This is our reading of the main laws, not legal advice. A lawyer would review it before any real deployment.";
