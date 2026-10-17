/**
 * Plain-language names for the technical terms the fixtures use.
 *
 * The fixtures keep their technical keys (the verifier and the master
 * document refer to them), and the interface shows these names instead, with
 * the technical name as a small secondary label for readers who want it.
 */

export const SIGNAL_PLAIN: Record<string, { name: string; hint: string }> = {
  "Base rate (intercept)": {
    name: "Starting point",
    hint: "Every account starts from the same point before any signal is added.",
  },
  "Trajectory surprisal": {
    name: "Unusual order of actions",
    hint: "How rare this sequence of steps is in this company.",
  },
  "Volumetric deviation": {
    name: "Unusual amount of activity",
    hint: "How much more this account did than teammates in the same role.",
  },
  "Resource novelty": {
    name: "First time touching this",
    hint: "Systems or files this account had never used before.",
  },
  "Geo / ASN novelty": {
    name: "New location or network",
    hint: "Logins from a place or internet provider not seen before.",
  },
  "Presence divergence": {
    name: "Activity while the laptop was locked",
    hint: "Cloud actions while the person's own laptop was locked or idle.",
  },
  "Composition drift": {
    name: "Change in type of work",
    hint: "The mix of apps used has shifted compared with a few months ago.",
  },
  "Cohort divergence": {
    name: "Drifting away from teammates",
    hint: "A gradual change over weeks, compared with others in the same role.",
  },
  "Employment signal": {
    name: "HR status",
    hint: "For example a recent resignation or transfer.",
  },
  "Novel egress path": {
    name: "Data sent somewhere new",
    hint: "Data went to a destination outside the company never used before.",
  },
  "Context verification": {
    name: "Approval check",
    hint: "Whether a genuine ticket, on-call shift or HR record explains the activity.",
  },
  "Manufactured-context indicator": {
    name: "Wrote their own approval",
    hint: "Created a ticket and assigned it to themselves just before the activity.",
  },
  "Deception trigger": {
    name: "Used a decoy",
    hint: "A fake password or file planted as a trap was used.",
  },
  "Graph topology change": {
    name: "New outside contacts",
    hint: "Started contacting outside companies it never contacted before.",
  },
  "Off-hours activity": {
    name: "Unusual hours",
    hint: "Active well outside this person's normal working hours.",
  },
  "Privilege change": {
    name: "Permission changes",
    hint: "Gave itself or others more access outside the approved change window.",
  },
  "Device novelty": {
    name: "New device",
    hint: "Logged in from a device not seen before.",
  },
};

export function signalPlain(feature: string) {
  return SIGNAL_PLAIN[feature] ?? { name: feature, hint: "" };
}

export const CHECK_PLAIN = {
  precedence: {
    name: "Made before?",
    question: "Was the record created at least 30 minutes before the activity?",
    technical: "Precedence",
  },
  provenance: {
    name: "Made by someone else?",
    question: "Was it created or assigned by someone other than this account?",
    technical: "Provenance",
  },
  scope: {
    name: "Names this system?",
    question: "Does it mention the exact system that was touched?",
    technical: "Scope",
  },
  proportionality: {
    name: "Right amount?",
    question: "Does the amount of activity fit the task?",
    technical: "Proportionality",
  },
} as const;

/** Approval verdicts, as shown in chips and tables. */
export const VERDICT_PLAIN = {
  authorised: "Approved",
  partial: "Partly approved",
  absent: "No approval",
  suspicious: "Fake approval",
} as const;

/** Case severity labels. */
export const SEVERITY_PLAIN: Record<string, string> = {
  CRITICAL: "Urgent",
  HIGH: "High",
  ELEVATED: "Medium",
  LOW: "Low",
  SUPPRESSED: "Closed: explained",
  MONITORING: "Watching",
};

/** Plain descriptions of the event names connectors report. */
export const ACTION_PLAIN: Record<string, string> = {
  "agent.token.issue": "Agent started a run",
  "aws.iam.policy.put": "Changed an access policy",
  "aws.iam.role.attach": "Gave a role more access",
  "aws.s3.get_object": "Downloaded a file from cloud storage",
  "aws.s3.put_object": "Uploaded a file to cloud storage",
  "aws.ssm.start_session": "Opened a remote session on a server",
  "aws.sts.assume_role": "Switched to another access role",
  "bigquery.job.query": "Ran a database query",
  "confluence.page.view": "Read a wiki page",
  "db.query": "Queried a database",
  "dropbox.file.upload": "Uploaded a file to Dropbox",
  "dropbox.folder.sync": "Synced a folder to Dropbox",
  "gcs.bucket.share": "Shared a storage bucket",
  "gcs.object.export": "Exported data to cloud storage",
  "gdrive.file.download": "Downloaded files from Google Drive",
  "gdrive.file.upload": "Uploaded a file to Google Drive",
  "gdrive.folder.list": "Browsed a shared folder",
  "gdrive.folder.share": "Shared a folder by link",
  "github.archive.create": "Packed code into an archive",
  "github.branch.create": "Started a new code branch",
  "github.pr.open": "Opened a code review",
  "github.pr.review": "Reviewed someone's code",
  "github.repo.clone": "Copied a code repository",
  "gws.contact.export": "Exported the contact list",
  "gws.mail.filter.create": "Set up email auto-forwarding",
  "gws.mail.send_external": "Emailed outside the company",
  "http.post": "Sent data to a web address",
  "jenkins.job.trigger": "Started a deployment job",
  "jira.issue.comment": "Commented on a ticket",
  "jira.issue.transition": "Updated a ticket",
  "jira.ticket.assign": "Assigned a ticket",
  "jira.ticket.create": "Created a ticket",
  "netsuite.export.csv": "Exported finance data to a file",
  "netsuite.record.fetch": "Opened finance records",
  "netsuite.report.run": "Ran a finance report",
  "netsuite.search.saved_run": "Ran a saved finance search",
  "okta.mfa.challenge": "Approved a login prompt",
  "okta.session.start": "Logged in",
  "okta.token.refresh": "Login renewed",
  "rds.snapshot.create": "Copied a whole database",
  "repo.file.read": "Read a file",
  "repo.pr.open": "Opened a code review",
  "slack.channel.join": "Joined a Slack channel",
  "slack.channel.message": "Posted in Slack",
  "zendesk.macro.apply": "Updated support tickets in bulk",
  "zendesk.ticket.bulk_export": "Exported support tickets",
  "zendesk.ticket.update": "Updated a support ticket",
};

export function actionPlain(action: string): string {
  return ACTION_PLAIN[action] ?? action;
}
