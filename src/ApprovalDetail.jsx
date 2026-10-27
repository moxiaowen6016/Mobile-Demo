import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import './approval-detail.css';

const businessTypes = '申购申请、赎回申请、申购申请结果登记、申购交易登记、赎回申请结果登记、赎回交易登记、现金分红交易登记、分红再投资交易登记、理财产品维护、存入申请、支取申请、存入交易登记、支取交易登记';
export default function ApprovalDetail({ onBack }) {
  const [expanded, setExpanded] = useState(false);
  const [showBusiness, setShowBusiness] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [notice, setNotice] = useState('');
  return <div className="approval-detail">
    <header className="ad-header"><button onClick={onBack} aria-label="返回任务中心"><ChevronLeft /></button><h1>审批流程详情</h1></header>
    <div className="ad-body">
      <section className="ad-status"><div><strong>流程状态</strong><span>审批中</span></div><button aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? '收起业务流程' : '展开业务流程'}<ChevronDown className={expanded ? 'expanded' : ''} size={18} /></button></section>
      {expanded && <section className="ad-flow"><h2>业务流程</h2><p>暂不支持移动端查看流程图，请前往PC端查看</p></section>}
      <section className="ad-section"><h2>基本信息</h2><dl>
        <div><dt>审批名称</dt><dd>申购申请</dd></div>
        <div><dt>发起渠道</dt><dd>全部</dd></div>
        <div><dt>适用单位</dt><dd>理财测试0001</dd></div>
        <div className="ad-business"><dt>业务类型</dt><dd><button className={showBusiness ? '' : 'ad-clamped'} aria-expanded={showBusiness} onClick={() => setShowBusiness(value => !value)}>{businessTypes}</button></dd></div>
        <div><dt>免审批</dt><dd>否</dd></div>
      </dl></section>
      <section className="ad-section"><h2>高级设置</h2><dl>
        <div><dt>异常处理</dt><dd>报错提示</dd></div>
        <div><dt>自动审批</dt><dd>每个节点都需要审批</dd></div>
        <div><dt>审批限时处理</dt><dd>否</dd></div>
      </dl></section>
      <section className="ad-section ad-process"><h2>审批流程</h2><p>暂不支持移动端查看流程图，请前往PC端查看</p></section>
      {notice && <p className="ad-notice" role="status">{notice}</p>}
    </div>
    <footer className="ad-actions"><button onClick={() => setConfirmation(true)}>撤销</button><button onClick={() => setNotice('当前为演示数据，催办功能待接入接口。')}>催办</button></footer>
    {confirmation && <div className="modal-backdrop" onClick={() => setConfirmation(false)}><section className="modal ad-confirm" role="dialog" aria-modal="true" aria-labelledby="ad-confirm-title" onClick={event => event.stopPropagation()}><h3 id="ad-confirm-title">撤销审批</h3><p>当前为演示数据，尚未接入撤销接口，无法撤销真实审批。</p><button onClick={() => setConfirmation(false)}>我知道了</button></section></div>}
  </div>;
}
