"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/** 어드민 섹션 헤더 */
export function AdminControlLabel({
  label,
  description,
  htmlFor,
  className,
}: {
  readonly label: string;
  readonly description?: string;
  readonly htmlFor?: string;
  readonly className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-widest text-white/50 cursor-pointer"
      >
        {label}
      </Label>
      {description && (
        <p className="text-[10px] text-white/30 leading-relaxed italic">
          {description}
        </p>
      )}
    </div>
  );
}

/** 텍스트/숫자 입력 컨트롤 */
export function AdminInputControl({
  label,
  description,
  value,
  onChange,
  type = "text",
  placeholder,
  id,
  unit,
  className,
}: {
  readonly label: string;
  readonly description?: string;
  readonly value: string | number;
  readonly onChange: (val: string) => void;
  readonly type?: string;
  readonly placeholder?: string;
  readonly id?: string;
  readonly unit?: string;
  readonly className?: string;
}) {
  const inputId = id || `input-${label.replaceAll(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className={cn(
        "space-y-3 p-4 border border-white/5 rounded-lg bg-white/2",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <AdminControlLabel
          label={label}
          description={description}
          htmlFor={inputId}
        />
        {unit && value !== undefined && (
          <span className="text-[10px] text-white/30 uppercase font-black">
            {unit}
          </span>
        )}
      </div>
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 bg-black/60 border-white/10 text-white text-sm focus:border-white/30 placeholder:text-white/10 transition-colors focus:bg-black/80"
      />
    </div>
  );
}

/** 토글(Switch) 컨트롤 */
export function AdminToggleControl({
  label,
  description,
  checked,
  onCheckedChange,
  id,
  className,
}: {
  readonly label: string;
  readonly description?: string;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly id?: string;
  readonly className?: string;
}) {
  const switchId =
    id || `switch-${label.replaceAll(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border border-white/5 rounded-lg bg-white/2",
        className,
      )}
    >
      <AdminControlLabel
        label={label}
        description={description}
        htmlFor={switchId}
      />
      <Switch
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-white/20"
      />
    </div>
  );
}

/** 텍스트 영역(Textarea) 컨트롤 */
export function AdminTextareaControl({
  label,
  description,
  value,
  onChange,
  placeholder,
  id,
  className,
  rows = 4,
}: {
  readonly label: string;
  readonly description?: string;
  readonly value: string;
  readonly onChange: (val: string) => void;
  readonly placeholder?: string;
  readonly id?: string;
  readonly className?: string;
  readonly rows?: number;
}) {
  const textareaId =
    id || `textarea-${label.replaceAll(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className={cn(
        "space-y-3 p-4 border border-white/5 rounded-lg bg-white/2",
        className,
      )}
    >
      <AdminControlLabel
        label={label}
        description={description}
        htmlFor={textareaId}
      />
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white/80 focus:border-white/30 transition-colors outline-none resize-none"
      />
    </div>
  );
}

/** 슬라이더(Slider) 제어 컨트롤 */
export function AdminSliderControl({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "px",
  id,
  className,
}: {
  readonly label: string;
  readonly description?: string;
  readonly value: number;
  readonly onChange: (val: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly unit?: string;
  readonly id?: string;
  readonly className?: string;
}) {
  const sliderId =
    id || `slider-${label.replaceAll(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className={cn(
        "space-y-4 p-4 border border-white/5 rounded-lg bg-white/2",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <AdminControlLabel
          label={label}
          description={description}
          htmlFor={sliderId}
        />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">{value}</span>
          <span className="text-[10px] text-white/30 uppercase">{unit}</span>
        </div>
      </div>
      <Slider
        id={sliderId}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="py-2"
      />
    </div>
  );
}
