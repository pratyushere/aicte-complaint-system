import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { PageHeader, Card, CardHeader, Badge, Button, Modal } from '@/components/ui';
import {
  GitCompareArrows,
  CheckCircle2,
  Shield,
  Calendar,
  Send,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface CoordinationMessage {
  id: string;
  author: string;
  bureau: string;
  role: string;
  text: string;
  timestamp: string;
}

export function CoordinationPage() {
  const { overlapAlerts, addToast, currentUser } = useAppStore();

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [sessionAgenda, setSessionAgenda] = useState('');

  // Coordination chat state
  const [chatMessages, setChatMessages] = useState<CoordinationMessage[]>([
    {
      id: 'm1',
      author: 'Priya Sharma',
      bureau: 'Regulation Bureau (RB)',
      role: 'Regulation Officer',
      text: 'Our preliminary audit of Rajiv Gandhi Institute indicates unapproved seats in AI & ML. Has PGRC received separate complaints from admitted students regarding course recognition?',
      timestamp: '2024-10-18T10:15:00Z',
    },
    {
      id: 'm2',
      author: 'Amit Patel',
      bureau: 'Public Grievance Redressal (PGRC)',
      role: 'PGRC Officer',
      text: 'Yes Priya, we have 2 students reporting they were charged ₹2.5 Lakh fee for unapproved batches. Linking our dockets so we issue a joint show-cause notice.',
      timestamp: '2024-10-18T11:40:00Z',
    },
    {
      id: 'm3',
      author: 'Dr. Arvind Swaminathan',
      bureau: 'Senior Management (HQ)',
      role: 'Executive Member',
      text: 'Joint hearing authorized under Regulation 14. Ensure inspection squad includes an academic expert from IIT Bombay.',
      timestamp: '2024-10-19T09:00:00Z',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Cross-bureau evidence dossier consolidated', done: true },
    { id: '2', title: 'Joint show-cause notice dispatched to Institution Registrar', done: true },
    { id: '3', title: 'Institution compliance affidavit received & evaluated', done: false },
    { id: '4', title: 'Joint inquiry committee virtual hearing conducted', done: false },
    { id: '5', title: 'Final unified order signed by both Bureau Directors', done: false },
  ]);

  // Linked overlaps
  const linkedAlerts = overlapAlerts.filter((a) => a.status === 'LINKED');

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
    addToast({
      title: 'Milestone Updated',
      message: 'Coordination task list refreshed.',
      type: 'info',
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: CoordinationMessage = {
      id: `m-${Date.now()}`,
      author: currentUser.name,
      bureau: currentUser.bureau?.name || 'Headquarters',
      role: currentUser.role.replace(/_/g, ' '),
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessage('');
    addToast({
      title: 'Communication Dispatched',
      message: 'Logged to Inter-Bureau Coordination Ledger.',
      type: 'success',
    });
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionModalOpen(false);
    addToast({
      title: 'Joint Session Scheduled',
      message: `Cross-bureau inquiry conference arranged for ${sessionDate}. Invitations sent to officers.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inter-Bureau Coordination Hub"
        subtitle="Collaborative multi-agency workspace synchronizing Regulation Bureau (RB) and Public Grievance Cell (PGRC)"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Coordination' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Calendar className="w-4 h-4" />}
              onClick={() => setSessionModalOpen(true)}
            >
              Schedule Joint Session
            </Button>
          </div>
        }
      />

      {/* Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Joint Taskforces
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">2 Inquiries</p>
            <span className="text-xs text-blue-600 font-medium">RB + PGRC Combined</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <GitCompareArrows className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Linked Case Dockets
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {Math.max(2, linkedAlerts.length)} Pairs
            </p>
            <span className="text-xs text-emerald-600 font-medium">Zero duplicate orders</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Harmonization Ratio
            </span>
            <p className="text-2xl font-bold text-slate-900 mt-1">98.4%</p>
            <span className="text-xs text-purple-600 font-medium">Statutory alignment</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Active Taskforce & Chat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Case Group Header */}
          <Card padding="lg">
            <CardHeader
              subtitle="Joint oversight proceeding for Rajiv Gandhi Institute of Technology"
              action={
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200" dot>
                  Active Joint Proceeding
                </Badge>
              }
            >
              Taskforce Alpha: Rajiv Gandhi Institute
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Regulation Bureau Case
                </span>
                <p className="font-mono text-xs font-bold text-blue-700">RB-2024-00147</p>
                <p className="text-xs font-medium text-slate-800">
                  Unauthorized engineering programs conducted
                </p>
                <span className="text-[10px] text-slate-500">Lead: Priya Sharma</span>
              </div>
              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  PGRC Grievance Case
                </span>
                <p className="font-mono text-xs font-bold text-purple-700">PGRC-2024-00425</p>
                <p className="text-xs font-medium text-slate-800">
                  Excess tuition fee charged for unapproved intake
                </p>
                <span className="text-[10px] text-slate-500">Lead: Amit Patel</span>
              </div>
            </div>

            {/* Joint Inquiry Checklist */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Joint Investigation Milestones
              </h4>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer select-none text-xs"
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-md flex items-center justify-center border text-xs font-bold shrink-0',
                        item.done
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white',
                      )}
                    >
                      {item.done && '✓'}
                    </div>
                    <span
                      className={cn(
                        'flex-1',
                        item.done ? 'line-through text-slate-400 font-normal' : 'font-medium text-slate-800',
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Inter-Bureau Communication Log */}
          <Card padding="lg" className="space-y-4">
            <CardHeader subtitle="Secure communication channel between case officers and leadership">
              Inter-Bureau Coordination Ledger
            </CardHeader>

            <div className="space-y-3 max-h-80 overflow-y-auto p-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{msg.author}</span>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {msg.bureau}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mt-1">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Send Message */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type an official remark or question to the coordinated bureau..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
              <Button
                variant="primary"
                type="submit"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Dispatch
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Coordination Protocols & Sign-Off */}
        <div className="space-y-6">
          <Card padding="lg">
            <CardHeader subtitle="Dual-signature validation required">
              Joint Resolution Sign-Off
            </CardHeader>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Before final case closure, both Bureau Directors must formally endorse the resolution
                findings to ensure uniform regulatory penalties and student remediation.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Regulation Bureau (RB)</span>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200">
                    Endorsed
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Priya Sharma • Verified on Oct 19</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Public Grievance (PGRC)</span>
                  <Badge className="bg-amber-50 text-amber-800 border-amber-200">
                    Pending Hearing
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">Amit Patel • Awaiting committee notes</p>
              </div>

              <Button
                variant="saffron"
                size="md"
                className="w-full"
                onClick={() => {
                  addToast({
                    title: 'Resolution Approved',
                    message: 'Official AICTE joint order signed and scheduled for gazette release.',
                    type: 'success',
                  });
                }}
              >
                Sign Off & Release Joint Order
              </Button>
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader subtitle="Standard operating guidelines">Statutory Protocols</CardHeader>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Single inspection squad dispatched for shared campus grounds.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Synchronized penalty notice preventing conflicting sanctions.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Consolidated communication to the complainant regarding restitution.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL: Schedule Joint Session */}
      <Modal
        isOpen={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        title="Schedule Inter-Bureau Coordination Session"
        subtitle="Arrange a joint inquiry conference between RB and PGRC officers"
      >
        <form onSubmit={handleScheduleSession} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Conference Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">
              Agenda & Matters for Determination *
            </label>
            <textarea
              required
              rows={3}
              value={sessionAgenda}
              onChange={(e) => setSessionAgenda(e.target.value)}
              placeholder="e.g. Reconciliation of fee audit receipts vs unauthorized course enrollments at Rajiv Gandhi Institute"
              className="w-full px-3 py-2 rounded-xl text-xs bg-white border border-slate-300 text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setSessionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" size="sm">
              Confirm & Dispatch Invites
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
