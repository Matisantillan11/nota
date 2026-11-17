export interface OptionPickerProps {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}
