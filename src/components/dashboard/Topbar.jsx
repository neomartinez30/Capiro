import React from "react";
import Icon from "./Icons";
import { currentUser, quarterInfo } from "../../data/dashboardMock";

export default function Topbar({ feedOpen, onToggleFeed }) {
  return (
    <div className="topbar">
      <div className="topbar__selector">
        <Icon name="mail" size={14} color="#6B7280" />
        <span>{quarterInfo.label} &bull; {quarterInfo.entity}</span>
        <Icon name="chevron" size={12} color="#6B7280" />
      </div>
      <button className="topbar__btn"><Icon name="plus" size={14} color="#fff" /> New Filing</button>
      <div className="topbar__search"><Icon name="search" size={16} color="#D1D5DB" /><span>Search filings, entities, issues&hellip;</span></div>
      <div className="topbar__actions">
        <button className="topbar__icon-btn" title="Alerts"><Icon name="bell" size={18} color="#6B7280" /><span className="topbar__badge" /></button>
        <button className="topbar__icon-btn" title="AI Copilot"><Icon name="sparkle" size={18} color="#3A6FF7" /></button>
        <button className={`topbar__icon-btn${feedOpen ? " topbar__icon-btn--active" : ""}`} title="Live Feed" onClick={onToggleFeed}><Icon name="rss" size={18} color={feedOpen ? "#3A6FF7" : "#6B7280"} /></button>
        <div className="topbar__avatar">{currentUser.initials}</div>
      </div>
    </div>
  );
}
