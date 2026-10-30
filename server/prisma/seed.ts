/* ============================================================
   Seed Script — Fictional Demonstration Data
   ============================================================
   ALL records in this file are FICTIONAL and created solely for
   development / demonstration purposes. They do NOT represent
   real AICTE institutions, complaints, or individuals.
   ============================================================ */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with fictional demonstration data...\n');

  // ---- Bureaus ----
  console.log('Creating bureaus...');
  const bureauRB = await prisma.bureau.upsert({
    where: { code: 'RB' },
    update: {},
    create: {
      code: 'RB',
      name: 'Regulation Bureau',
      description: 'Handles regulation and compliance matters (FICTIONAL)',
    },
  });

  const bureauPGRC = await prisma.bureau.upsert({
    where: { code: 'PGRC' },
    update: {},
    create: {
      code: 'PGRC',
      name: 'Public Grievance Redressal Cell',
      description: 'Handles public grievances and complaints (FICTIONAL)',
    },
  });

  const bureauOther = await prisma.bureau.upsert({
    where: { code: 'OTHER' },
    update: {},
    create: {
      code: 'OTHER',
      name: 'Other Bureau / Cell',
      description: 'Miscellaneous administrative matters (FICTIONAL)',
    },
  });

  console.log(`  ✓ Created ${3} bureaus`);

  // ---- Complaint Categories ----
  console.log('Creating complaint categories...');
  const categories = await Promise.all([
    prisma.complaintCategory.upsert({
      where: { code: 'APPROVAL_VIOLATION' },
      update: {},
      create: {
        code: 'APPROVAL_VIOLATION',
        name: 'Approval Violation',
        description: 'Institution operating without proper AICTE approvals',
      },
    }),
    prisma.complaintCategory.upsert({
      where: { code: 'FEE_DISPUTE' },
      update: {},
      create: {
        code: 'FEE_DISPUTE',
        name: 'Fee Dispute',
        description: 'Disputes regarding tuition or other institutional fees',
      },
    }),
    prisma.complaintCategory.upsert({
      where: { code: 'FACULTY' },
      update: {},
      create: {
        code: 'FACULTY',
        name: 'Faculty Related',
        description: 'Issues related to faculty qualifications, ratio, or conduct',
      },
    }),
    prisma.complaintCategory.upsert({
      where: { code: 'INFRASTRUCTURE' },
      update: {},
      create: {
        code: 'INFRASTRUCTURE',
        name: 'Infrastructure',
        description: 'Facilities and infrastructure non-compliance',
      },
    }),
    prisma.complaintCategory.upsert({
      where: { code: 'RAGGING' },
      update: {},
      create: {
        code: 'RAGGING',
        name: 'Ragging',
        description: 'Ragging incidents and anti-ragging compliance',
      },
    }),
    prisma.complaintCategory.upsert({
      where: { code: 'OTHER' },
      update: {},
      create: {
        code: 'OTHER',
        name: 'Other',
        description: 'Miscellaneous complaints not covered by other categories',
      },
    }),
  ]);
  console.log(`  ✓ Created ${categories.length} categories`);

  // ---- Users (FICTIONAL) ----
  console.log('Creating fictional users with hashed passwords and explicit roles...');
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 1. System Administrator
  const userAdmin = await prisma.user.upsert({
    where: { email: 'admin.demo@fictional-aicte.example' },
    update: {
      role: 'SYSTEM_ADMIN',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'admin.demo@fictional-aicte.example',
      name: '[FICTIONAL] Rajesh Kumar (System Admin)',
      role: 'SYSTEM_ADMIN',
      bureauId: bureauRB.id,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 2. Regulation Bureau Officer
  const userOfficer1 = await prisma.user.upsert({
    where: { email: 'regulation.demo@fictional-aicte.example' },
    update: {
      role: 'REGULATION_BUREAU_OFFICER',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'regulation.demo@fictional-aicte.example',
      name: '[FICTIONAL] Priya Sharma (Regulation Bureau)',
      role: 'REGULATION_BUREAU_OFFICER',
      bureauId: bureauRB.id,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 3. PGRC Officer
  const userOfficer2 = await prisma.user.upsert({
    where: { email: 'pgrc.demo@fictional-aicte.example' },
    update: {
      role: 'PGRC_OFFICER',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'pgrc.demo@fictional-aicte.example',
      name: '[FICTIONAL] Amit Patel (PGRC Officer)',
      role: 'PGRC_OFFICER',
      bureauId: bureauPGRC.id,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 4. Other Bureau / Cell Officer
  const userOtherBureau = await prisma.user.upsert({
    where: { email: 'otherbureau.demo@fictional-aicte.example' },
    update: {
      role: 'OTHER_BUREAU_OFFICER',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'otherbureau.demo@fictional-aicte.example',
      name: '[FICTIONAL] Sunita Reddy (Other Bureau)',
      role: 'OTHER_BUREAU_OFFICER',
      bureauId: bureauOther.id,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 5. Regional Officer
  const userRegional = await prisma.user.upsert({
    where: { email: 'regional.demo@fictional-aicte.example' },
    update: {
      role: 'REGIONAL_OFFICER',
      passwordHash: defaultPasswordHash,
      region: 'Western',
    },
    create: {
      email: 'regional.demo@fictional-aicte.example',
      name: '[FICTIONAL] Vikram Singh (Regional Officer - Western)',
      role: 'REGIONAL_OFFICER',
      region: 'Western',
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 6. Senior Management
  const userSenior = await prisma.user.upsert({
    where: { email: 'senior.demo@fictional-aicte.example' },
    update: {
      role: 'SENIOR_MANAGEMENT',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'senior.demo@fictional-aicte.example',
      name: '[FICTIONAL] Dr. Arvind Swaminathan (Senior Management)',
      role: 'SENIOR_MANAGEMENT',
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 7. Read-Only Auditor
  const userViewer = await prisma.user.upsert({
    where: { email: 'auditor.demo@fictional-aicte.example' },
    update: {
      role: 'READ_ONLY_AUDITOR',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'auditor.demo@fictional-aicte.example',
      name: '[FICTIONAL] Meera Joshi (Read-Only Auditor)',
      role: 'READ_ONLY_AUDITOR',
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // Also maintain backward-compatible alias for officer1.demo if referenced
  await prisma.user.upsert({
    where: { email: 'officer1.demo@fictional-aicte.example' },
    update: {
      role: 'REGULATION_BUREAU_OFFICER',
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'officer1.demo@fictional-aicte.example',
      name: '[FICTIONAL] Priya Sharma (Regulation Bureau)',
      role: 'REGULATION_BUREAU_OFFICER',
      bureauId: bureauRB.id,
      isActive: true,
      passwordHash: defaultPasswordHash,
    },
  });

  // 8. Inactive Account for Validation Testing
  await prisma.user.upsert({
    where: { email: 'inactive.demo@fictional-aicte.example' },
    update: {
      role: 'REGULATION_BUREAU_OFFICER',
      passwordHash: defaultPasswordHash,
      isActive: false,
    },
    create: {
      email: 'inactive.demo@fictional-aicte.example',
      name: '[FICTIONAL] Inactive Test Officer',
      role: 'REGULATION_BUREAU_OFFICER',
      bureauId: bureauRB.id,
      isActive: false,
      passwordHash: defaultPasswordHash,
    },
  });

  console.log(`  ✓ Created fictional users representing all required roles + inactive test account with password 'Password@123'`);

  // ---- Institutions (FICTIONAL) ----
  console.log('Creating fictional institutions...');
  const inst1 = await prisma.institution.upsert({
    where: { aictePermanentId: 'FICT-1-4501234567' },
    update: {},
    create: {
      aictePermanentId: 'FICT-1-4501234567',
      name: '[FICTIONAL] Rajiv Gandhi Institute of Technology',
      address: '123 Demo Road, Andheri East',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      region: 'Western',
      city: 'Mumbai',
      type: 'ENGINEERING',
      approvalStatus: 'APPROVED',
    },
  });

  const inst2 = await prisma.institution.upsert({
    where: { aictePermanentId: 'FICT-1-4501234568' },
    update: {},
    create: {
      aictePermanentId: 'FICT-1-4501234568',
      name: '[FICTIONAL] National College of Pharmacy',
      address: '456 Sample Street, Koramangala',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      region: 'Southern',
      city: 'Bengaluru',
      type: 'PHARMACY',
      approvalStatus: 'UNDER_REVIEW',
    },
  });

  const inst3 = await prisma.institution.upsert({
    where: { aictePermanentId: 'FICT-2-7801234569' },
    update: {},
    create: {
      aictePermanentId: 'FICT-2-7801234569',
      name: '[FICTIONAL] Delhi School of Management',
      address: '789 Example Avenue, Hauz Khas',
      state: 'Delhi',
      district: 'South Delhi',
      region: 'Northern',
      city: 'New Delhi',
      type: 'MBA',
      approvalStatus: 'APPROVED',
    },
  });

  const inst4 = await prisma.institution.upsert({
    where: { aictePermanentId: 'FICT-1-4501234570' },
    update: {},
    create: {
      aictePermanentId: 'FICT-1-4501234570',
      name: '[FICTIONAL] Srinivasa Institute of Engineering & Technology',
      address: '101 Test Lane, T. Nagar',
      state: 'Tamil Nadu',
      district: 'Chennai',
      region: 'Southern',
      city: 'Chennai',
      type: 'ENGINEERING',
      approvalStatus: 'REVOKED',
    },
  });

  const inst5 = await prisma.institution.upsert({
    where: { aictePermanentId: 'FICT-3-9201234571' },
    update: {},
    create: {
      aictePermanentId: 'FICT-3-9201234571',
      name: '[FICTIONAL] Jaipur College of Architecture & Planning',
      address: '202 Mock Boulevard, C-Scheme',
      state: 'Rajasthan',
      district: 'Jaipur',
      region: 'Western',
      city: 'Jaipur',
      type: 'ARCHITECTURE',
      approvalStatus: 'PENDING',
    },
  });

  console.log(`  ✓ Created 5 fictional institutions`);

  // ---- Complaints (FICTIONAL) ----
  console.log('Creating fictional complaints...');
  const catApproval = categories[0];
  const catFee = categories[1];
  const catFaculty = categories[2];
  const catInfra = categories[3];
  const catRagging = categories[4];

  const complaint1 = await prisma.complaint.upsert({
    where: { trackingNumber: 'RB-2024-00147' },
    update: {},
    create: {
      trackingNumber: 'RB-2024-00147',
      institutionId: inst1.id,
      categoryId: catApproval.id,
      bureauId: bureauRB.id,
      assignedToId: userOfficer1.id,
      createdById: userAdmin.id,
      receivedDate: new Date('2024-09-20T10:30:00Z'),
      subject: '[FICTIONAL] Unauthorized engineering courses being offered without approval',
      description: 'FICTIONAL: The institution has started offering B.Tech in AI & ML and B.Tech in Data Science without obtaining the necessary approvals for these programs.',
      status: 'INVESTIGATION',
      priority: 'CRITICAL',
      complainantName: '[FICTIONAL] Arun Mehta',
      complainantContact: 'arun.demo@example.com',
      nextAction: 'Physical inspection scheduled',
      nextActionDueDate: new Date('2024-11-15T00:00:00Z'),
      expectedDisposalDate: new Date('2024-12-31T00:00:00Z'),
      lastActionAt: new Date('2024-10-18T14:00:00Z'),
    },
  });

  const complaint2 = await prisma.complaint.upsert({
    where: { trackingNumber: 'PGRC-2024-00389' },
    update: {},
    create: {
      trackingNumber: 'PGRC-2024-00389',
      institutionId: inst1.id,
      categoryId: catFee.id,
      bureauId: bureauPGRC.id,
      assignedToId: userOfficer2.id,
      createdById: userAdmin.id,
      receivedDate: new Date('2024-10-05T08:00:00Z'),
      subject: '[FICTIONAL] Excessive tuition fees charged beyond approved limit',
      description: 'FICTIONAL: Students report the institution is charging above the fee structure approved by the fee regulatory committee.',
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      complainantName: '[FICTIONAL] Sneha Patel',
      complainantContact: 'sneha.demo@example.com',
      nextAction: 'Fee structure verification',
      nextActionDueDate: new Date('2024-12-01T00:00:00Z'),
      expectedDisposalDate: new Date('2025-01-31T00:00:00Z'),
    },
  });

  const complaint3 = await prisma.complaint.upsert({
    where: { trackingNumber: 'RB-2024-00152' },
    update: {},
    create: {
      trackingNumber: 'RB-2024-00152',
      institutionId: inst2.id,
      categoryId: catFaculty.id,
      bureauId: bureauRB.id,
      assignedToId: null,
      createdById: userOfficer1.id,
      receivedDate: new Date('2024-10-10T09:15:00Z'),
      subject: '[FICTIONAL] Inadequate faculty-to-student ratio in pharmacy department',
      description: 'FICTIONAL: Inspection report indicates the institution has insufficient faculty members for the student body.',
      status: 'RECEIVED',
      priority: 'MEDIUM',
      complainantName: '[FICTIONAL] Dr. Ramesh Kumar',
      complainantContact: 'r.kumar.demo@example.org',
      nextAction: 'Assign to officer for review',
      nextActionDueDate: new Date('2024-11-30T00:00:00Z'),
    },
  });

  const complaint4 = await prisma.complaint.upsert({
    where: { trackingNumber: 'PGRC-2024-00412' },
    update: {},
    create: {
      trackingNumber: 'PGRC-2024-00412',
      institutionId: inst4.id,
      categoryId: catRagging.id,
      bureauId: bureauPGRC.id,
      assignedToId: userOfficer1.id,
      createdById: userOfficer2.id,
      receivedDate: new Date('2024-10-01T06:00:00Z'),
      subject: '[FICTIONAL] Severe ragging incidents reported by multiple students',
      description: 'FICTIONAL: Multiple complaints received from first-year students alleging systematic ragging. The anti-ragging committee has not taken any action.',
      status: 'ESCALATED',
      priority: 'CRITICAL',
      complainantName: 'Confidential',
      complainantContact: 'anti-ragging.demo@example.org',
      nextAction: 'Urgent committee hearing',
      nextActionDueDate: new Date('2024-10-25T00:00:00Z'),
      lastActionAt: new Date('2024-10-20T16:45:00Z'),
    },
  });

  const complaint5 = await prisma.complaint.upsert({
    where: { trackingNumber: 'RB-2024-00160' },
    update: {},
    create: {
      trackingNumber: 'RB-2024-00160',
      institutionId: inst3.id,
      categoryId: catInfra.id,
      bureauId: bureauRB.id,
      assignedToId: userAdmin.id,
      createdById: userOfficer1.id,
      receivedDate: new Date('2024-10-12T11:00:00Z'),
      subject: '[FICTIONAL] Library facilities do not meet prescribed norms',
      description: 'FICTIONAL: The library lacks sufficient digital resources and seating capacity.',
      status: 'AWAITING_RESPONSE',
      priority: 'LOW',
      complainantName: '[FICTIONAL] Prof. Anita Desai',
      complainantContact: 'a.desai.demo@example.edu',
      nextAction: 'Awaiting institution response',
      nextActionDueDate: new Date('2025-01-15T00:00:00Z'),
    },
  });

  const complaint6 = await prisma.complaint.upsert({
    where: { trackingNumber: 'PGRC-2024-00425' },
    update: {},
    create: {
      trackingNumber: 'PGRC-2024-00425',
      institutionId: inst1.id,
      categoryId: catApproval.id,
      bureauId: bureauPGRC.id,
      assignedToId: userOfficer2.id,
      createdById: userAdmin.id,
      receivedDate: new Date('2024-10-08T14:20:00Z'),
      subject: '[FICTIONAL] Operating unapproved courses — overlapping concern',
      description: 'FICTIONAL: Separate grievance filed regarding the same institution running courses without approval. Appears to overlap with RB-2024-00147.',
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      complainantName: '[FICTIONAL] Vikram Singh',
      complainantContact: 'vikram.demo@example.com',
      nextAction: 'Cross-reference with RB case',
      nextActionDueDate: new Date('2024-12-10T00:00:00Z'),
    },
  });

  console.log(`  ✓ Created 6 fictional complaints`);

  // ---- Case Actions (FICTIONAL) ----
  console.log('Creating fictional case actions...');
  await prisma.caseAction.createMany({
    data: [
      {
        complaintId: complaint1.id,
        actorId: userAdmin.id,
        actionType: 'STATUS_CHANGE',
        newStatus: 'RECEIVED',
        remarks: 'Complaint registered in the system',
      },
      {
        complaintId: complaint1.id,
        actorId: userOfficer1.id,
        actionType: 'STATUS_CHANGE',
        previousStatus: 'RECEIVED',
        newStatus: 'UNDER_REVIEW',
        remarks: 'Taken up for preliminary review',
      },
      {
        complaintId: complaint1.id,
        actorId: userOfficer1.id,
        actionType: 'STATUS_CHANGE',
        previousStatus: 'UNDER_REVIEW',
        newStatus: 'INVESTIGATION',
        remarks: 'Physical inspection ordered',
        nextAction: 'Schedule site visit',
        dueDate: new Date('2024-11-15T00:00:00Z'),
      },
      {
        complaintId: complaint4.id,
        actorId: userOfficer2.id,
        actionType: 'STATUS_CHANGE',
        newStatus: 'RECEIVED',
        remarks: 'Urgent ragging complaint received',
      },
      {
        complaintId: complaint4.id,
        actorId: userAdmin.id,
        actionType: 'ESCALATION',
        previousStatus: 'RECEIVED',
        newStatus: 'ESCALATED',
        remarks: 'Escalated due to severity — immediate action required',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`  ✓ Created 5 fictional case actions`);

  // ---- Notifications (FICTIONAL) ----
  console.log('Creating fictional notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: userOfficer1.id,
        type: 'DEADLINE_WARNING',
        title: 'Deadline Approaching',
        message: `PGRC-2024-00412 deadline is in 5 days. Current status: Escalated.`,
        referenceId: complaint4.id,
        referenceType: 'complaint',
        isRead: false,
      },
      {
        userId: userOfficer1.id,
        type: 'ASSIGNMENT',
        title: 'New Complaint Assigned',
        message: 'You have been assigned complaint PGRC-2024-00412 regarding ragging incidents.',
        referenceId: complaint4.id,
        referenceType: 'complaint',
        isRead: true,
      },
      {
        userId: userOfficer1.id,
        type: 'STATUS_CHANGE',
        title: 'Status Updated',
        message: 'RB-2024-00147 status changed from Under Review to Investigation.',
        referenceId: complaint1.id,
        referenceType: 'complaint',
        isRead: true,
      },
    ],
  });
  console.log(`  ✓ Created 3 fictional notifications`);

  console.log('\n✅ Seed complete! All records are FICTIONAL demonstration data.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
