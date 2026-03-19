import React, { useState } from "react";
import Icon from "./Icons";
import { IconArrowUp, IconArrowDown } from "./Icons";
import { IconRss } from "./Icons";
import { liveFeedItems, trendingTopics } from "../../data/dashboardMock";

const FILTERS = [
  { key: "all", label: "All" }, { key: "legislator", label: "Congress" },
  { key: "agency", label: "Agency" }, { key: "bill", label: "Bills" }, { key: "news", label: "News" },
];
const SRC = { legislator: "\u{1F3DB}\uFE0F", agency: "\u{1F3E2}", bill: "\u{1F4CB}", news: "\u{1F4F0}" };
const REL = { high: "High relevance", medium: "Medium", low: "Low" };

export default function LiveFeedPanel({ open }) {
  const [filter, setFilter] = useState("all");
  const items = filter === "all" ? liveFeedItems : liveFeedItems.filter((f) => f.source === filter);

  if (!open) return <div className="feed-panel feed-panel--closed" />;

  return (
    <div className="feed-panel">
      <div className="feed-panel__header">
        <span className="feed-panel__title"><IconRss size={16} color="#3A6FF7" /> Live Feed</span>
        <span className="feed-panel__live-badge">LIVE</span>
      </div>
      <div className="feed-filters">
        {FILTERS.map((f) => (
          <button key={f.key} className={`feed-filter${filter === f.key ? " feed-filter--active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>
      <div className="feed-items">
        {items.map((item) => (
          <div key={item.id} className="feed-item">
            <div className="feed-item__header">
              <span className="feed-item__source-icon">{SRC[item.source]}</span>
              <span className="feed-item__author">{item.author}</span>
              <span className="feed-item__time">{item.time}</span>
            </div>
            <p className="feed-item__text">{item.text}</p>
            <div className="feed-item__tags">
              {item.tags.map((tag) => (<span key={tag} className="feed-tag">#{tag}</span>))}
              <span className={`feed-relevance feed-relevance--${item.relevance}`}>{REL[item.relevance]}</span>
            </div>
            <div className="feed-item__actions">
              {["Save", "Link Issue", "Add Activity"].map((a) => (<button key={a} className="feed-action-btn">{a}</button>))}
            </div>
          </div>
        ))}
      </div>
      <div className="feed-trending">
        <div className="feed-trending__title">Trending Topics</div>
        {trendingTopics.map((t, i) => (
          <div key={i} className="trending-row">
            <span className="trending-row__topic">{t.topic}</span>
            <div className="trending-row__stats">
              <span className="trending-row__count">{t.mentions}</span>
              {t.trend === "up" && <IconArrowUp size={10} color="#059669" />}
              {t.trend === "down" && <IconArrowDown size={10} color="#DC2626" />}
              {t.trend === "stable" && <span style={{ fontSize: 10, color: "#9CA3AF" }}>&mdash;</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
