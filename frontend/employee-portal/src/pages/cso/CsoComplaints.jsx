import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplaints, handleComplaint, clearComplaintState } from '../../redux/slices/complaintSlice';
import { getCsoById } from '../../redux/slices/userSlice';
import { 
  FileQuestion, Search, Clock, CheckCircle2, AlertCircle, X, 
  ShieldAlert, Loader2, Calendar, User, MessageSquare
} from 'lucide-react';

const CsoComplaints = () => {
  const dispatch = useDispatch();

  // Redux States
  const { user } = useSelector((state) => state.auth);
  const { complaints, loading, error, success } = useSelector((state) => state.complaints);
  const { currentCso } = useSelector((state) => state.users);

  // Component states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Handle action state
  const [showHandleModal, setShowHandleModal] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('RESOLVED');
  const [rejectReason, setRejectReason] = useState('');
  
  const [validationError, setValidationError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const csoBranchId = currentCso?.branchId;

  useEffect(() => {
    dispatch(getAllComplaints());
    if (user?.id && !currentCso) {
      dispatch(getCsoById(user.id));
    }

    return () => {
      dispatch(clearComplaintState());
    };
  }, [dispatch, user, currentCso]);

  useEffect(() => {
    if (success) {
      setSuccessToast('Ticket updated successfully.');
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Filter complaints matching branch and search criteria
  const branchComplaints = complaints.filter((c) => 
    Number(c.branchId) === Number(csoBranchId)
  );

  const filteredComplaints = branchComplaints.filter((c) => {
    const matchesSearch = 
      c.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.complaintId?.toString().includes(searchTerm);
      
    const matchesStatus = c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openHandleModal = (ticket) => {
    setSelectedComplaint(ticket);
    setTicketStatus('RESOLVED');
    setRejectReason('');
    setValidationError('');
    setShowHandleModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (ticketStatus === 'REJECTED' && !rejectReason.trim()) {
      setValidationError('Please provide a reason for rejecting this complaint.');
      return;
    }

    dispatch(handleComplaint({
      complaintId: selectedComplaint.complaintId,
      status: ticketStatus,
      rejectReason: ticketStatus === 'REJECTED' ? rejectReason : null,
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setShowHandleModal(false);
        dispatch(getAllComplaints()); // Reload complaints ledger
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header bar */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Branch Support Complaints</h1>
        <p className="text-sm text-slate-400">
          Monitor and resolve support tickets submitted by customers at your branch.
        </p>
      </div>

      {successToast && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Ledger controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search tickets by ID or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 bg-slate-900/40 p-1 border border-slate-800 rounded-xl">
          {[
            { id: 'PENDING', label: 'Pending', icon: Clock },
            { id: 'RESOLVED', label: 'Resolved', icon: CheckCircle2 },
            { id: 'REJECTED', label: 'Rejected', icon: AlertCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                    : 'text-slate-450 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets Ledger list */}
      <div className="space-y-4">
        {loading && complaints.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center text-slate-500 border border-slate-850">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
            <p className="text-sm font-semibold">Fetching branch tickets...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="glass-panel rounded-xl p-12 text-center text-slate-500 border border-slate-850">
            <FileQuestion className="w-8 h-8 text-slate-650 mx-auto mb-2" />
            <p className="text-sm font-semibold">No complaints found in this segment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredComplaints.map((ticket) => (
              <div 
                key={ticket.complaintId}
                className="glass-card rounded-xl p-5 border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2.5 max-w-3xl">
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                    <span className="text-indigo-400 font-mono">TICKET ID: #{ticket.complaintId}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-500" /> {ticket.customerName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-normal font-sans">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> 
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{ticket.description}</p>

                  {/* Resolutions comment display if resolved/rejected */}
                  {ticket.status !== 'PENDING' && (
                    <div className="bg-slate-900/35 border border-slate-855 p-3 rounded-lg flex items-start gap-2.5 text-xs">
                      <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-350">
                          {ticket.status === 'RESOLVED' ? 'Resolution Action:' : 'Reason for Rejection:'}
                        </span>
                        <p className="text-slate-400 mt-1 italic">
                          {ticket.status === 'RESOLVED' ? 'Ticket resolved by customer service officer.' : ticket.rejectReason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status action button */}
                {ticket.status === 'PENDING' && (
                  <button
                    onClick={() => openHandleModal(ticket)}
                    className="px-4 py-2.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-900/30 hover:border-indigo-500 rounded-xl text-xs font-semibold cursor-pointer transition-all self-start md:self-auto shrink-0"
                  >
                    Action Ticket
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION TICKET MODAL OVERLAY */}
      {showHandleModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-indigo-400" />
                Process Support Ticket
              </h3>
              <button 
                onClick={() => setShowHandleModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error notifications */}
            {(validationError || error) && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Processing Error</p>
                  <p className="opacity-95">{validationError || error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block mb-1">CUSTOMER DESCRIPTION</span>
                <p className="text-slate-350 leading-relaxed font-medium italic">"{selectedComplaint.description}"</p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Action Status Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTicketStatus('RESOLVED')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      ticketStatus === 'RESOLVED'
                        ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Mark Resolved
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketStatus('REJECTED')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      ticketStatus === 'REJECTED'
                        ? 'bg-rose-600/15 text-rose-400 border-rose-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Reject Ticket
                  </button>
                </div>
              </div>

              {ticketStatus === 'REJECTED' && (
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Rejection Reason (Mandatory)</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Provide detailed reasons explaining why this ticket cannot be resolved..."
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs h-24 resize-none"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowHandleModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Submit Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CsoComplaints;
