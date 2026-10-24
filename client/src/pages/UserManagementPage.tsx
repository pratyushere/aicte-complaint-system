import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, Badge, Button, Modal, DataTable, type Column } from '@/components/ui';
import { DEMO_ACCOUNTS, ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import {
  Plus,
  Search,
  UserCheck,
  CheckCircle2,
  XCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface OfficerRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bureau: string;
  region: string;
  isActive: boolean;
  canMutate: boolean;
}

export function UserManagementPage() {
  const { currentUser, switchPersona, addToast } = useAppStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Add Officer Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('REGULATION_BUREAU_OFFICER');
  const [newBureau, setNewBureau] = useState('Regulation Bureau (RB)');

  // Sample officer roster initialized from DEMO_ACCOUNTS
  const [officers, setOfficers] = useState<OfficerRecord[]>([
    {
      id: 'usr-1',
      name: 'Rajesh Kumar',
      email: 'admin.demo@fictional-aicte.example',
      role: 'SYSTEM_ADMIN',
      bureau: 'System Administration',
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: true,
    },
    {
      id: 'usr-2',
      name: 'Priya Sharma',
      email: 'regulation.demo@fictional-aicte.example',
      role: 'REGULATION_BUREAU_OFFICER',
      bureau: 'Regulation Bureau (RB)',
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: true,
    },
    {
      id: 'usr-3',
      name: 'Amit Patel',
      email: 'pgrc.demo@fictional-aicte.example',
      role: 'PGRC_OFFICER',
      bureau: 'Public Grievance Cell (PGRC)',
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: true,
    },
    {
      id: 'usr-4',
      name: 'Sunita Reddy',
      email: 'otherbureau.demo@fictional-aicte.example',
      role: 'OTHER_BUREAU_OFFICER',
      bureau: 'Specialized Bureau & Cells',
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: true,
    },
    {
      id: 'usr-5',
      name: 'Vikram Singh',
      email: 'regional.demo@fictional-aicte.example',
      role: 'REGIONAL_OFFICER',
      bureau: 'Western Regional Directorate',
      region: 'Mumbai, Maharashtra',
      isActive: true,
      canMutate: true,
    },
    {
      id: 'usr-6',
      name: 'Dr. Arvind Swaminathan',
      email: 'senior.demo@fictional-aicte.example',
      role: 'SENIOR_MANAGEMENT',
      bureau: 'Executive Council',
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: false,
    },
    {
      id: 'usr-7',
      name: 'Meera Joshi',
      email: 'auditor.demo@fictional-aicte.example',
      role: 'READ_ONLY_AUDITOR',
      bureau: 'Statutory Audit Cell',
      region: 'National Jurisdiction',
      isActive: true,
      canMutate: false,
    },
  ]);

  const filteredOfficers = useMemo(() => {
    return officers.filter((o) => {
      const matchSearch =
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.bureau.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === 'ALL' || o.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [officers, search, roleFilter]);

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newOfficer: OfficerRecord = {
      id: `usr-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      bureau: newBureau,
      region: 'Headquarters (New Delhi)',
      isActive: true,
      canMutate: newRole !== 'READ_ONLY_AUDITOR',
    };

    setOfficers((prev) => [newOfficer, ...prev]);
    setAddModalOpen(false);
    setNewName('');
    setNewEmail('');

    addToast({
      title: 'Officer Enrolled',
      message: `${newName} added to the AICTE officer roster.`,
      type: 'success',
    });
  };

  const columns: Column<OfficerRecord>[] = [
    {
      key: 'name',
      header: 'Officer Name & Identity',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
            {r.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold text-xs">{r.name}</span>
              {currentUser.email === r.email && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 border border-purple-200">
                  CURRENT
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{r.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role Assignment',
      render: (r) => (
        <Badge className={ROLE_COLORS[r.role] || 'bg-slate-100 text-slate-700'}>
          {ROLE_LABELS[r.role] || r.role}
        </Badge>
      ),
    },
    {
      key: 'bureau',
      header: 'Bureau / Division',
      render: (r) => (
        <div>
          <span className="text-xs text-slate-800 font-medium block">{r.bureau}</span>
          <span className="text-[10px] text-slate-400">{r.region}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: () => (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200" dot>
          Active
        </Badge>
      ),
    },
    {
      key: 'action',
      header: 'Impersonate Persona',
      render: (r) => (
        <button
          onClick={() => switchPersona(r.role)}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1',
            currentUser.role === r.role
              ? 'bg-purple-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{currentUser.role === r.role ? 'Active' : 'Test Persona'}</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Directory & Role-Based Access Control"
        subtitle="Manage administrative credentials, bureau scopes, and test multi-tier RBAC authorization"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'User Management' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
          >
            Enroll Officer
          </Button>
        }
      />

      {/* 1-Click Persona Switcher Banner */}
      <Card padding="lg" className="border-purple-200 bg-gradient-to-r from-purple-50/50 via-white to-blue-50/30">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold text-purple-950 uppercase tracking-wider">
            1-Click Live Persona Impersonator (RBAC Testing)
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4 max-w-2xl">
          Instantly test the application interface under any of the 7 official AICTE security roles.
          Your current active identity is <span className="font-bold text-purple-900">{currentUser.name}</span> (
          {ROLE_LABELS[currentUser.role]}).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = currentUser.role === acc.role;
            return (
              <button
                key={acc.role}
                onClick={() => switchPersona(acc.role as UserRole)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all cursor-pointer group flex flex-col justify-between',
                  isSelected
                    ? 'border-purple-600 bg-purple-600 text-white shadow-md'
                    : 'border-slate-200 bg-white hover:border-purple-300 text-slate-800',
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate block">{acc.name}</span>
                    {isSelected && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-purple-900">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-[10px] block mt-0.5',
                      isSelected ? 'text-purple-200' : 'text-purple-700 font-semibold',
                    )}
                  >
                    {acc.label}
                  </span>
                  <p
                    className={cn(
                      'text-[11px] line-clamp-1 mt-1 leading-snug',
                      isSelected ? 'text-purple-100' : 'text-slate-500',
                    )}
                  >
                    {acc.desc}
                  </p>
                </div>

                <div
                  className={cn(
                    'mt-2 pt-2 border-t text-[10px] flex items-center justify-between',
                    isSelected ? 'border-purple-500/50 text-purple-200' : 'border-slate-100 text-slate-400',
                  )}
                >
                  <span>{isSelected ? 'Currently Viewing' : 'Switch to Persona'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Filter and Officer Roster Table */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search officers by name, email, bureau..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700"
          >
            <option value="ALL">All Roles ({officers.length})</option>
            {DEMO_ACCOUNTS.map((a) => (
              <option key={a.role} value={a.role}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filteredOfficers}
        keyExtractor={(r) => r.id}
        emptyMessage="No officers match your search filter."
      />

      {/* Role Capabilities Matrix */}
      <Card padding="none">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Official RBAC Capability Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Backend-enforced permission scopes across administrative roles
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-left">
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">Role Tier</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">Intake Complaints</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">Status Mutation</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">Overlap Linking</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">User Admin</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase">Audits & Reports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { role: 'SYSTEM_ADMIN', label: 'System Admin', canIntake: true, canMutate: true, canOverlap: true, canUser: true, canAudit: true },
                { role: 'REGULATION_BUREAU_OFFICER', label: 'Regulation Bureau Officer', canIntake: true, canMutate: true, canOverlap: true, canUser: false, canAudit: true },
                { role: 'PGRC_OFFICER', label: 'PGRC Redressal Officer', canIntake: true, canMutate: true, canOverlap: true, canUser: false, canAudit: true },
                { role: 'REGIONAL_OFFICER', label: 'Regional Officer', canIntake: true, canMutate: true, canOverlap: false, canUser: false, canAudit: true },
                { role: 'SENIOR_MANAGEMENT', label: 'Senior Management', canIntake: false, canMutate: false, canOverlap: true, canUser: true, canAudit: true },
                { role: 'READ_ONLY_AUDITOR', label: 'Read-Only Auditor', canIntake: false, canMutate: false, canOverlap: false, canUser: false, canAudit: true },
              ].map((r) => (
                <tr key={r.role} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{r.label}</td>
                  <td className="px-6 py-3.5">{r.canIntake ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
                  <td className="px-6 py-3.5">{r.canMutate ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
                  <td className="px-6 py-3.5">{r.canOverlap ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
                  <td className="px-6 py-3.5">{r.canUser ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
                  <td className="px-6 py-3.5">{r.canAudit ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-300" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: Enroll Officer */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Enroll Regulatory Officer"
        subtitle="Grant operational portal credentials and assign jurisdiction"
      >
        <form onSubmit={handleAddOfficer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Dr. Anita Desai"
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Official Email Address *
            </label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="anita.desai@aicte.gov.in"
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Assigned Security Role *
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            >
              {DEMO_ACCOUNTS.map((a) => (
                <option key={a.role} value={a.role}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Bureau / Cell Designation *
            </label>
            <input
              type="text"
              required
              value={newBureau}
              onChange={(e) => setNewBureau(e.target.value)}
              placeholder="e.g. Regulation Bureau (RB)"
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Enroll Officer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
