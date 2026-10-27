import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Filter, Check, ChevronDown } from 'lucide-react';
import './task-center.css';

const initialTasks = [
  { id: 'balance', title: '银企余额对账办理', type: 'balance', fields: [['单位名称', '--'], ['对账月份', '2026-09'], ['余额核对结果', '--']], applicant: '系统', channel: '自动', time: '10-17 13:40' },
  { id: 'contract', title: '合同签署办理', type: 'contract', fields: [['申请单编号', 'CSET202610130001']], applicant: '而我在...', channel: '网页端', time: '10-13 16:39' }
];
export default function TaskCenter({ onBack, onProcess }) {
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState([]);
  const [done, setDone] = useState([]);
  const [type, setType] = useState('');
  const [time, setTime] = useState('');
  const [company, setCompany] = useState('');
  const [hidden, setHidden] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [notice, setNotice] = useState('');
  const tasks = initialTasks.filter(task => (tab === 'done' ? done.includes(task.id) : !done.includes(task.id)) && (!type || type === task.type) && (!time || task.time.startsWith('10-17')) && (!company || task.type === company));
  const toggle = id => setSelected(ids => ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]);
  const allSelected = tasks.length > 0 && tasks.every(task => selected.includes(task.id));
  const finish = action => { setDone(ids => [...new Set([...ids, ...selected])]); setNotice('已' + action + '所选任务（本地演示）'); setSelected([]); setDetail(null); };
  const changeTab = value => { setTab(value); setSelected([]); setNotice(''); };
  const selectFilter = (label, value, setter, options) => <label className="tc-filter"><select aria-label={label} value={value} onChange={event => { setter(event.target.value); setSelected([]); }}><option value="">{label}</option>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select><ChevronDown size={17} /></label>;
  return <div className="task-center">
    <header className="tc-header"><button aria-label="返回首页" onClick={onBack}><ChevronLeft /></button><h1>任务中心 <button aria-label={hidden ? '显示信息' : '隐藏信息'} onClick={() => setHidden(value => !value)}>{hidden ? <EyeOff /> : <Eye />}</button></h1></header>
    <section className="tc-controls">
      <div className="tc-tabs" role="tablist" aria-label="任务状态"><button role="tab" aria-selected={tab === 'pending'} className={tab === 'pending' ? 'active' : ''} onClick={() => changeTab('pending')}>待办任务 <span>({2226 - done.length})</span></button><button role="tab" aria-selected={tab === 'done'} className={tab === 'done' ? 'active' : ''} onClick={() => changeTab('done')}>我的已办</button></div>
      <div className="tc-filters">{selectFilter('时间', time, setTime, [['recent', '最近一周']])}{selectFilter('业务类型', type, setType, [['balance', '银企余额对账'], ['contract', '合同签署']])}{selectFilter('企业/账户', company, setCompany, [['balance', '集团主账户'], ['contract', '日常结算账户']])}<button className="tc-filter-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(value => !value)}>筛选<Filter size={21} /></button></div>
      {filtersOpen && <div className="tc-filter-panel"><span>筛选条件在上方选择</span><button onClick={() => { setTime(''); setType(''); setCompany(''); setSelected([]); setFiltersOpen(false); }}>重置筛选</button></div>}
    </section>
    <div className="tc-list">
      {notice && <p className="tc-notice" role="status">{notice}</p>}
      {tasks.map(task => <article className="tc-card" key={task.id}>
        <div className="tc-card-title"><button className={'tc-check ' + (selected.includes(task.id) ? 'checked' : '')} role="checkbox" aria-checked={selected.includes(task.id)} aria-label={'选择' + task.title} onClick={() => toggle(task.id)}>{selected.includes(task.id) && <Check size={17} />}</button><h2>{task.title}</h2></div>
        <div className="tc-card-content"><dl>{task.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{hidden && value !== '--' ? '******' : value}</dd></div>)}</dl><button className="tc-handle" onClick={() => onProcess(task.id)}>{tab === 'done' ? '查看' : '处理'}<ChevronRight size={23} /></button></div>
        <footer className="tc-card-footer"><span>申请人:{hidden ? '***' : task.applicant} <em>{task.channel}</em></span><span>任务时间:{task.time}</span></footer>
      </article>)}
      {!tasks.length && <div className="tc-empty">暂无{tab === 'pending' ? '待办' : '已办'}任务</div>}
    </div>
    {tab === 'pending' && <footer className="tc-actions"><div className="tc-total">合计 CNY --</div><div className="tc-action-row"><button className="tc-select-all" onClick={() => setSelected(allSelected ? [] : tasks.map(task => task.id))}><span className={'tc-check ' + (allSelected ? 'checked' : '')}>{allSelected && <Check size={18} />}</span>全选</button><button className="tc-action" disabled={!selected.length} onClick={() => finish('拒绝')}>拒绝</button><button className="tc-action" disabled={!selected.length} onClick={() => finish('同意')}>同意</button></div></footer>}
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><section className="modal" role="dialog" aria-modal="true" aria-label="任务详情" onClick={event => event.stopPropagation()}><div className="modal-heading"><h3>{detail.title}</h3><button onClick={() => setDetail(null)} aria-label="关闭">×</button></div>{detail.fields.map(([label,value]) => <p key={label}>{label}：{hidden ? '******' : value}</p>)}<p>当前为本地演示数据，尚未接入处理接口。</p><button className="back-button" onClick={() => setDetail(null)}>返回列表</button></section></div>}
  </div>;
}
