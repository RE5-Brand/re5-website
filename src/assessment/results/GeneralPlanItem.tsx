import React from "react";
import { PlanItem } from "../../../lib/assessment/copy";

interface GeneralPlanItemProps {
  item: PlanItem;
  index: number;
}

export function GeneralPlanItem({ item, index }: GeneralPlanItemProps) {
  return (
    <div className="plan-item">
      <div className="mono plan-item-number">{index + 1}</div>
      <div className="plan-item-content">
        <h4 className="plan-item-title">{item.title}</h4>
        <p className="plan-item-body">{item.body}</p>
        <p className="plan-item-caveat">{item.caveat}</p>
      </div>
    </div>
  );
}
