import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClipboardList, Wallet, ChartNoAxesCombined, ShieldAlert, ChevronDown, X, ArrowLeft, Check } from 'lucide-react';
import './styles.css';
import TaskCenter from './TaskCenter';
import ApprovalDetail from './ApprovalDetail';

const shortcuts = [
  { title: '任务中心', icon: ClipboardList, badge: '99+' },
  { title: '账户查询', icon: Wallet },
  { title: '统计数据', icon: ChartNoAxesCombined },
  { title: '风险管理', icon: ShieldAlert, badge: '99+' }
];
const accountData = [
  { name: '集团主账户', number: '6222 **** **** 8001', bank: '中国工商银行', balance: 655112999999.99 },
  { name: '日常结算账户', number: '6217 **** **** 6018', bank: '中国建设银行', balance: 12400 }
];

function Filter({ label, options, value, onChange }) {
  return <label className="filter"><select aria-label={label} value={value} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={20} aria-hidden="true" /></label>;
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  useEffect(() => { const sync = () => setPathname(window.location.pathname); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  const navigate = path => { window.history.pushState({}, '', path); setPathname(path); };
  const [account, setAccount] = useState('all');
  const [unit, setUnit] = useState('auto');
  const [currency, setCurrency] = useState('CNY');
  const [selectedMetric, setSelectedMetric] = useState('total');
  const [view, setView] = useState(null);
  const [completed, setCompleted] = useState([]);
  const accountOptions = [{ value: 'all', label: '账号' }, { value: 'main', label: '主账户' }, { value: 'settlement', label: '结算户' }];
  const currencyOptions = [{ value: 'CNY', label: '币种' }, { value: 'RMB', label: '人民币' }];
  const settlement = account === 'settlement';
  const total = settlement ? 12400 : 655113000000;
  const debt = settlement ? 0 : 50000;
  const current = selectedMetric === 'debt' ? debt : selectedMetric === 'net' ? total - debt : total;
  const format = amount => {
    const divisor = unit === 'yuan' ? 1 : unit === 'wan' ? 10000 : amount >= 100000000 ? 100000000 : 10000;
    return <><strong>{(amount / divisor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong><span>{divisor === 1 ? '元' : divisor === 10000 ? '万' : '亿'}</span></>;
  };
  const activeAccounts = account === 'all' ? accountData : accountData.filter((item, index) => index === (settlement ? 1 : 0));

  if (pathname.startsWith('/approvalDetail/')) return <ApprovalDetail onBack={() => navigate('/taskCenter')} />;
  if (pathname.replace(/\/$/, '') === '/taskCenter') return <TaskCenter onBack={() => navigate('/')} onProcess={id => navigate('/approvalDetail/' + encodeURIComponent(id))} />;
  return <div className="app">
    <header className="masthead">
      <div className="customer">CUST-001</div>
      <nav className="shortcuts" aria-label="快捷入口">{shortcuts.map(({ title, icon: Icon, badge }) => <button key={title} onClick={() => title === '任务中心' ? navigate('/taskCenter') : setView(title)} className="shortcut"><span className="shortcut-icon"><Icon strokeWidth={1.8} />{badge && <span className="badge">{badge}</span>}</span><span>{title}</span></button>)}</nav>
    </header>

    <main>
      <section className="panel funds" aria-labelledby="funds-title">
        <div className="section-heading"><h1 id="funds-title">资金总览</h1><div className="filters"><Filter label="资金账号" options={accountOptions} value={account} onChange={setAccount} /><Filter label="金额单位" options={[{ value: 'auto', label: '单位' }, { value: 'wan', label: '万元' }, { value: 'yuan', label: '元' }]} value={unit} onChange={setUnit} /><Filter label="资金币种" options={currencyOptions} value={currency} onChange={setCurrency} /></div></div>
        <div className="equation">
          <button className={`metric ${selectedMetric === 'total' ? 'selected' : ''}`} onClick={() => setSelectedMetric('total')}><span className="metric-label">资金总额</span><span className="amount">{format(total)}</span></button>
          <span className="operator">-</span>
          <button className={`metric ${selectedMetric === 'debt' ? 'selected' : ''}`} onClick={() => setSelectedMetric('debt')}><span className="metric-label">资金负债</span><span className="amount">{format(debt)}</span></button>
          <span className="operator">=</span>
          <button className={`metric ${selectedMetric === 'net' ? 'selected' : ''}`} onClick={() => setSelectedMetric('net')}><span className="metric-label">资金净额</span><span className="amount">{format(total - debt)}</span></button>
        </div>
        <div className="comparison"><span>较昨日 <b>↑{settlement ? '0.00' : '6,532.16'}</b><em>亿</em></span><span>较年初 <b>↑{settlement ? '0.00' : '6,550.55'}</b><em>亿</em></span></div>
        <div className="distribution"><div className="donut" role="img" aria-label="资金分布：活期占比约100%，理财占比约0%" /><div className="legend"><div><span className="legend-label"><i />活期</span><span className="legend-amount">{format(current)}</span><span className="percent">100.00%</span></div><div><span className="legend-label"><i className="cyan" />理财</span><span className="legend-amount">{format(settlement || selectedMetric === 'debt' ? 0 : 12400)}</span><span className="percent">0.00%</span></div></div></div>
        <p className="updated">数据更新时间：2026-10-21 11:57:40</p>
      </section>

      <section className="panel accounts" id="accounts" aria-labelledby="accounts-title"><div className="section-heading"><h2 id="accounts-title">账户总览</h2><div className="filters"><Filter label="账户账号" options={accountOptions} value={account} onChange={setAccount} /><Filter label="账户币种" options={currencyOptions} value={currency} onChange={setCurrency} /></div></div><div className="account-summary"><div><span>账户总数</span><strong>{activeAccounts.length}<small> 个</small></strong></div><div><span>正常账户</span><strong>{activeAccounts.length}<small> 个</small></strong></div><div><span>异常账户</span><strong>0<small> 个</small></strong></div></div>{activeAccounts.map(item => <div className="account-row" key={item.number}><span className="bank-icon"><Wallet size={23} /></span><div className="account-info"><strong>{item.name}</strong><span>{item.bank} · {item.number}</span></div><span className="status">正常</span></div>)}</section>
    </main>

    {view && <div className="modal-backdrop" onClick={() => setView(null)}><section className="modal" role="dialog" aria-modal="true" aria-label={view} onClick={event => event.stopPropagation()}><div className="modal-heading"><h2>{view}</h2><button className="icon-button" title="关闭" aria-label="关闭" onClick={() => setView(null)}><X /></button></div>{view === '任务中心' ? <div className="task-list">{['账户信息核验', '资金日报确认', '收支记录复核'].map((task, index) => <button key={task} onClick={() => setCompleted(previous => previous.includes(index) ? previous.filter(item => item !== index) : [...previous, index])}><span className={`task-check ${completed.includes(index) ? 'checked' : ''}`}>{completed.includes(index) && <Check size={16} />}</span><span>{task}</span><small>{completed.includes(index) ? '已完成' : '待处理'}</small></button>)}</div> : view === '账户查询' ? activeAccounts.map(item => <div className="detail-row" key={item.number}><strong>{item.name}</strong><p>{item.bank}</p><p>{item.number}</p><span className="detail-balance">{format(item.balance)}</span></div>) : view === '统计数据' ? <><p className="modal-subtitle">资金结构</p><div className="analysis-row"><span>活期</span><div className="bar"><i /></div><strong>100.00%</strong></div><div className="analysis-row"><span>理财</span><div className="bar" /><strong>0.00%</strong></div><p className="updated">统计日期：2026-10-21</p></> : <><div className="risk-status"><ShieldAlert /><strong>账户运行正常</strong></div><div className="detail-row">异常账户 <strong>0 个</strong></div><div className="detail-row">待复核事项 <strong>{3 - completed.length} 项</strong></div></>}<button className="back-button" onClick={() => setView(null)}><ArrowLeft size={17} />返回总览</button></section></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
