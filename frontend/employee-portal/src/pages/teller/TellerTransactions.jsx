import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAccountByNumber, cashDeposit, cashWithdraw, 
  internalTransfer, chequeDeposit, clearAccountState 
} from '../../redux/slices/accountSlice';
import { 
  ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, 
  CheckCircle2, Search, Building2, User, CreditCard, Calendar, 
  ShieldCheck, ShieldAlert, Loader2
} from 'lucide-react';

const TABS = [
  { id: 'DEPOSIT', label: 'Cash Deposit', icon: ArrowUpRight },
  { id: 'WITHDRAW', label: 'Cash Withdrawal', icon: ArrowDownRight },
  { id: 'TRANSFER', label: 'Internal Transfer', icon: RefreshCw },
  { id: 'CHEQUE', label: 'Cheque Deposit', icon: Building2 },
];

const TellerTransactions = () => {
  const dispatch = useDispatch();

  // Redux States
  const { selectedAccount, loading, error, success, successMessage } = useSelector((state) => state.accounts);

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState('DEPOSIT');

  // Input states
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [validatedAccount, setValidatedAccount] = useState(null);
  
  // Transfer-specific states
  const [senderNumber, setSenderNumber] = useState('');
  const [receiverNumber, setReceiverNumber] = useState('');
  const [validatedSender, setValidatedSender] = useState(null);
  const [validatedReceiver, setValidatedReceiver] = useState(null);
  const [verifyingSender, setVerifyingSender] = useState(false);
  const [verifyingReceiver, setVerifyingReceiver] = useState(false);

  // Cheque-specific states
  const [chequeNumber, setChequeNumber] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [issuerNumber, setIssuerNumber] = useState('');
  const [payeeNumber, setPayeeNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');

  // UI state feedback
  const [clientError, setClientError] = useState('');
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  // Reset tab states
  useEffect(() => {
    dispatch(clearAccountState());
    setAccountNumber('');
    setAmount('');
    setValidatedAccount(null);
    setSenderNumber('');
    setReceiverNumber('');
    setValidatedSender(null);
    setValidatedReceiver(null);
    setChequeNumber('');
    setIssuingBank('');
    setBranchCode('');
    setIssuerNumber('');
    setPayeeNumber('');
    setIssueDate('');
    setClientError('');
  }, [activeTab, dispatch]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  // Perform a single account validation
  const handleVerifyAccount = () => {
    if (!accountNumber) return;
    setVerifyingAccount(true);
    setClientError('');
    dispatch(getAccountByNumber(accountNumber)).then((res) => {
      setVerifyingAccount(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setValidatedAccount(res.payload);
      } else {
        setValidatedAccount(null);
      }
    });
  };

  // Verify Sender for Transfer
  const handleVerifySender = () => {
    if (!senderNumber) return;
    setVerifyingSender(true);
    setClientError('');
    dispatch(getAccountByNumber(senderNumber)).then((res) => {
      setVerifyingSender(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setValidatedSender(res.payload);
      } else {
        setValidatedSender(null);
      }
    });
  };

  // Verify Receiver for Transfer
  const handleVerifyReceiver = () => {
    if (!receiverNumber) return;
    setVerifyingReceiver(true);
    setClientError('');
    dispatch(getAccountByNumber(receiverNumber)).then((res) => {
      setVerifyingReceiver(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setValidatedReceiver(res.payload);
      } else {
        setValidatedReceiver(null);
      }
    });
  };

  // Submit Cash Deposit
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!validatedAccount) {
      setClientError('Please verify the account before processing.');
      return;
    }
    if (Number(amount) <= 0) {
      setClientError('Amount must be greater than zero.');
      return;
    }

    dispatch(cashDeposit({ accountNumber, amount: Number(amount) })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setValidatedAccount(res.payload); // Update displayed balance
        setAmount('');
      }
    });
  };

  // Submit Cash Withdrawal
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!validatedAccount) {
      setClientError('Please verify the account before processing.');
      return;
    }
    if (Number(amount) <= 0) {
      setClientError('Amount must be greater than zero.');
      return;
    }
    if (Number(amount) > validatedAccount.balance) {
      setClientError(`Insufficient balance. Available: ${formatCurrency(validatedAccount.balance)}`);
      return;
    }

    dispatch(cashWithdraw({ accountNumber, amount: Number(amount) })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setValidatedAccount(res.payload); // Update displayed balance
        setAmount('');
      }
    });
  };

  // Submit Internal Fund Transfer
  const handleTransferSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (!validatedSender || !validatedReceiver) {
      setClientError('Please verify both sender and receiver accounts.');
      return;
    }
    if (validatedSender.accountNumber === validatedReceiver.accountNumber) {
      setClientError('Sender and Receiver accounts must be different.');
      return;
    }
    if (Number(amount) <= 0) {
      setClientError('Amount must be greater than zero.');
      return;
    }
    if (Number(amount) > validatedSender.balance) {
      setClientError(`Insufficient balance in Sender account. Available: ${formatCurrency(validatedSender.balance)}`);
      return;
    }

    dispatch(internalTransfer({
      fromAccountNumber: senderNumber,
      toAccountNumber: receiverNumber,
      amount: Number(amount),
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        // Reset balances and inputs
        setAmount('');
        setValidatedSender(null);
        setValidatedReceiver(null);
        setSenderNumber('');
        setReceiverNumber('');
      }
    });
  };

  // Submit Cheque clearing request
  const handleChequeSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    if (Number(amount) <= 0) {
      setClientError('Cheque amount must be greater than zero.');
      return;
    }

    dispatch(chequeDeposit({
      chequeNumber,
      issuingBank,
      branchCode,
      issuerAccountNumber: issuerNumber,
      payeeAccountNumber: payeeNumber,
      amount: Number(amount),
      issueDate,
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setChequeNumber('');
        setIssuingBank('');
        setBranchCode('');
        setIssuerNumber('');
        setPayeeNumber('');
        setAmount('');
        setIssueDate('');
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Teller Cash Desk</h1>
        <p className="text-sm text-slate-400">
          Process customer ledger updates: deposits, withdrawals, internal transfers, and cheques.
        </p>
      </div>

      {/* Tabs selectors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                isSelected 
                  ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-600/5' 
                  : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Messages Alerts */}
      {(clientError || error) && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transaction Warning</p>
            <p className="opacity-95">{clientError || error}</p>
          </div>
        </div>
      )}

      {success && successMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* DESK WORKSPACE PANEL */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800/85">
        
        {/* VIEW 1: CASH DEPOSIT */}
        {activeTab === 'DEPOSIT' && (
          <form onSubmit={handleDepositSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Account Verification */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Validation</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="Enter 12-digit account number..."
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={verifyingAccount || !accountNumber}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {verifyingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Verify
                  </button>
                </div>

                {/* Account Details Box */}
                {validatedAccount ? (
                  <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase">{validatedAccount.branchName || 'Account Details'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span>Account Holder ID:</span>
                        <strong className="block text-slate-200 mt-0.5">{validatedAccount.customerId}</strong>
                      </div>
                      <div>
                        <span>Account Type:</span>
                        <strong className="block text-slate-200 mt-0.5 font-mono">{validatedAccount.accountType}</strong>
                      </div>
                      <div>
                        <span>Available Balance:</span>
                        <strong className="block text-emerald-400 mt-0.5 font-mono text-xs">
                          {formatCurrency(validatedAccount.balance)}
                        </strong>
                      </div>
                      <div>
                        <span>Account Status:</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold mt-0.5 ${
                          validatedAccount.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {validatedAccount.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Input account number and click verify to load holder details.
                  </div>
                )}
              </div>

              {/* Right Column: Amount entry */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deposit Details</h3>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Deposit Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono font-bold"
                      required
                      disabled={!validatedAccount}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !validatedAccount}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute Cash Deposit
                </button>
              </div>

            </div>
          </form>
        )}

        {/* VIEW 2: CASH WITHDRAWAL */}
        {activeTab === 'WITHDRAW' && (
          <form onSubmit={handleWithdrawSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Account Verification */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Validation</h3>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="Enter 12-digit account number..."
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={verifyingAccount || !accountNumber}
                    className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {verifyingAccount ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    Verify
                  </button>
                </div>

                {/* Account Details Box */}
                {validatedAccount ? (
                  <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-white uppercase">{validatedAccount.branchName || 'Account Details'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span>Account Holder ID:</span>
                        <strong className="block text-slate-200 mt-0.5">{validatedAccount.customerId}</strong>
                      </div>
                      <div>
                        <span>Account Type:</span>
                        <strong className="block text-slate-200 mt-0.5 font-mono">{validatedAccount.accountType}</strong>
                      </div>
                      <div>
                        <span>Available Balance:</span>
                        <strong className="block text-emerald-400 mt-0.5 font-mono text-xs">
                          {formatCurrency(validatedAccount.balance)}
                        </strong>
                      </div>
                      <div>
                        <span>Account Status:</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold mt-0.5 ${
                          validatedAccount.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {validatedAccount.accountStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    Input account number and click verify to load holder details.
                  </div>
                )}
              </div>

              {/* Right Column: Amount entry */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Withdrawal Details</h3>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono font-bold"
                      required
                      disabled={!validatedAccount}
                    />
                  </div>
                  {validatedAccount && Number(amount) > validatedAccount.balance && (
                    <span className="text-[10px] text-rose-400 font-semibold block mt-1.5">
                      Warning: Withdrawal exceeds available account balance.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !validatedAccount || Number(amount) > validatedAccount.balance}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute Cash Withdrawal
                </button>
              </div>

            </div>
          </form>
        )}

        {/* VIEW 3: INTERNAL TRANSFER */}
        {activeTab === 'TRANSFER' && (
          <form onSubmit={handleTransferSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Senders & Receivers validation */}
              <div className="space-y-5">
                
                {/* Sender */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Debit Source (Sender)</h4>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="Sender account number..."
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border glass-input text-xs font-mono"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifySender}
                      disabled={verifyingSender || !senderNumber}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {verifyingSender ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                  {validatedSender && (
                    <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[10px] text-slate-400 flex justify-between items-center">
                      <span>Sender balance: <strong className="text-slate-200">{formatCurrency(validatedSender.balance)}</strong></span>
                      <span className="text-indigo-400 uppercase font-semibold">Holder: #{validatedSender.customerId}</span>
                    </div>
                  )}
                </div>

                {/* Receiver */}
                <div className="space-y-3.5 border-t border-slate-800/40 pt-4">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Credit Target (Receiver)</h4>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="Receiver account number..."
                        value={receiverNumber}
                        onChange={(e) => setReceiverNumber(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl border glass-input text-xs font-mono"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyReceiver}
                      disabled={verifyingReceiver || !receiverNumber}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {verifyingReceiver ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                  {validatedReceiver && (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-slate-400 flex justify-between items-center">
                      <span>Target name: <strong className="text-slate-200">{validatedReceiver.branchName}</strong></span>
                      <span className="text-indigo-400 uppercase font-semibold">Holder: #{validatedReceiver.customerId}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Amount entry & Execute */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transfer Details</h3>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Transfer Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-7 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono font-bold"
                      required
                      disabled={!validatedSender || !validatedReceiver}
                    />
                  </div>
                  {validatedSender && Number(amount) > validatedSender.balance && (
                    <span className="text-[10px] text-rose-400 font-semibold block mt-1.5">
                      Warning: Transfer exceeds available sender account balance.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !validatedSender || !validatedReceiver || Number(amount) > validatedSender.balance}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Execute Ledger Transfer
                </button>
              </div>

            </div>
          </form>
        )}

        {/* VIEW 4: CHEQUE DEPOSIT */}
        {activeTab === 'CHEQUE' && (
          <form onSubmit={handleChequeSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cheque Specifications</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Cheque Number</label>
                <input
                  type="text"
                  placeholder="e.g. CHQ-2026-001"
                  value={chequeNumber}
                  onChange={(e) => setChequeNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Issuing Bank</label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India"
                  value={issuingBank}
                  onChange={(e) => setIssuingBank(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Branch Code (6-digit)</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 100001"
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Issuer Account (Source)</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="Debit Account number"
                  value={issuerNumber}
                  onChange={(e) => setIssuerNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Payee Account (Target)</label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="Credit Account number"
                  value={payeeNumber}
                  onChange={(e) => setPayeeNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2">
              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Clearing Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-lg border glass-input font-mono font-bold text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-550 uppercase tracking-wider text-[10px] mb-1.5">Issue Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4  flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Cheque to Clearing
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};

export default TellerTransactions;
