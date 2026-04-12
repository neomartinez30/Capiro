import React from "react";
import { IconSparkle, IconLightning, IconCircleAlert, IconLightbulb } from "./Icons";
import { aiInsights } from "../../data/dashboardMock";

const STYLE = {
  warning: <IconLightning size={16} color="#F59E0B" />,
  alert: <IconCircleAlert size={16} color="#EF4444" />,
  suggestion: <IconLightbulb size={16} color="#3A6FF7" />,
};

export default function InsightsCard() {
  return (
    <div className="card card--ai">
      <div className="card__header">
        <span className="card__title"><IconSparkle size={16} color="#3A6FF7" /> AI Insights</span>
        <span className="card__badge">BETA</span>
      </div>
      <div className="card__body">
        {aiInsights.map((ins) => (
          <div key={ins.id} className="insight-item">
            <span className="insight-item__icon">{STYLE[ins.type]}</span>
            <span className="insight-item__text">{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
