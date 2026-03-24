export type UnitCategory = {
  id: string;
  namebn: string;
  nameen: string;
  icon: string;
  color: string;
  units: Unit[];
};

export type Unit = {
  id: string;
  namebn: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
};

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    namebn: 'দৈর্ঘ্য',
    nameen: 'Length',
    icon: 'ruler',
    color: '#1B6CA8',
    units: [
      { id: 'mm', namebn: 'মিলিমিটার', symbol: 'মিমি', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'cm', namebn: 'সেন্টিমিটার', symbol: 'সেমি', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'm', namebn: 'মিটার', symbol: 'মি', toBase: v => v, fromBase: v => v },
      { id: 'km', namebn: 'কিলোমিটার', symbol: 'কিমি', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'inch', namebn: 'ইঞ্চি', symbol: 'ইঞ্চি', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'foot', namebn: 'ফুট', symbol: 'ফুট', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yard', namebn: 'গজ', symbol: 'গজ', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mile', namebn: 'মাইল', symbol: 'মাইল', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ],
  },
  {
    id: 'weight',
    namebn: 'ওজন/ভর',
    nameen: 'Weight/Mass',
    icon: 'scale',
    color: '#7C3AED',
    units: [
      { id: 'mg', namebn: 'মিলিগ্রাম', symbol: 'মিগ্রা', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 'g', namebn: 'গ্রাম', symbol: 'গ্রা', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'kg', namebn: 'কিলোগ্রাম', symbol: 'কেজি', toBase: v => v, fromBase: v => v },
      { id: 'ton', namebn: 'টন', symbol: 'টন', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', namebn: 'পাউন্ড', symbol: 'পা', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'oz', namebn: 'আউন্স', symbol: 'আউ', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: 'tola', namebn: 'তোলা', symbol: 'তোলা', toBase: v => v * 0.01166, fromBase: v => v / 0.01166 },
      { id: 'maund', namebn: 'মণ', symbol: 'মণ', toBase: v => v * 37.3242, fromBase: v => v / 37.3242 },
    ],
  },
  {
    id: 'temperature',
    namebn: 'তাপমাত্রা',
    nameen: 'Temperature',
    icon: 'thermometer',
    color: '#DC2626',
    units: [
      { id: 'celsius', namebn: 'সেলসিয়াস', symbol: '°সে', toBase: v => v, fromBase: v => v },
      { id: 'fahrenheit', namebn: 'ফারেনহাইট', symbol: '°ফা', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'kelvin', namebn: 'কেলভিন', symbol: 'কে', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'area',
    namebn: 'ক্ষেত্রফল',
    nameen: 'Area',
    icon: 'square',
    color: '#059669',
    units: [
      { id: 'sqmm', namebn: 'বর্গ মিলিমিটার', symbol: 'মিমি²', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { id: 'sqcm', namebn: 'বর্গ সেন্টিমিটার', symbol: 'সেমি²', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
      { id: 'sqm', namebn: 'বর্গ মিটার', symbol: 'মি²', toBase: v => v, fromBase: v => v },
      { id: 'sqkm', namebn: 'বর্গ কিলোমিটার', symbol: 'কিমি²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { id: 'sqft', namebn: 'বর্গফুট', symbol: 'ফুট²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { id: 'acre', namebn: 'একর', symbol: 'একর', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { id: 'bigha', namebn: 'বিঘা', symbol: 'বিঘা', toBase: v => v * 1337.8, fromBase: v => v / 1337.8 },
      { id: 'katha', namebn: 'কাঠা', symbol: 'কাঠা', toBase: v => v * 66.89, fromBase: v => v / 66.89 },
    ],
  },
  {
    id: 'volume',
    namebn: 'আয়তন',
    nameen: 'Volume',
    icon: 'cube',
    color: '#D97706',
    units: [
      { id: 'ml', namebn: 'মিলিলিটার', symbol: 'মিলি', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'l', namebn: 'লিটার', symbol: 'লি', toBase: v => v, fromBase: v => v },
      { id: 'cum', namebn: 'ঘন মিটার', symbol: 'মি³', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'gallon', namebn: 'গ্যালন (US)', symbol: 'গ্যা', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'pint', namebn: 'পাইন্ট', symbol: 'পাইন্ট', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { id: 'floz', namebn: 'ফ্লু. আউন্স', symbol: 'ফ্লাউ', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    ],
  },
  {
    id: 'speed',
    namebn: 'গতিবেগ',
    nameen: 'Speed',
    icon: 'zap',
    color: '#0891B2',
    units: [
      { id: 'mps', namebn: 'মিটার/সেকেন্ড', symbol: 'মি/সে', toBase: v => v, fromBase: v => v },
      { id: 'kmph', namebn: 'কিমি/ঘণ্টা', symbol: 'কিমি/ঘ', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', namebn: 'মাইল/ঘণ্টা', symbol: 'মাইল/ঘ', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'knot', namebn: 'নট', symbol: 'নট', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
      { id: 'mach', namebn: 'ম্যাক', symbol: 'ম্যাক', toBase: v => v * 340.29, fromBase: v => v / 340.29 },
    ],
  },
  {
    id: 'time',
    namebn: 'সময়',
    nameen: 'Time',
    icon: 'clock',
    color: '#7C3AED',
    units: [
      { id: 'ms', namebn: 'মিলিসেকেন্ড', symbol: 'মিসে', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 's', namebn: 'সেকেন্ড', symbol: 'সে', toBase: v => v, fromBase: v => v },
      { id: 'min', namebn: 'মিনিট', symbol: 'মিনিট', toBase: v => v * 60, fromBase: v => v / 60 },
      { id: 'hour', namebn: 'ঘণ্টা', symbol: 'ঘ', toBase: v => v * 3600, fromBase: v => v / 3600 },
      { id: 'day', namebn: 'দিন', symbol: 'দিন', toBase: v => v * 86400, fromBase: v => v / 86400 },
      { id: 'week', namebn: 'সপ্তাহ', symbol: 'সপ্তাহ', toBase: v => v * 604800, fromBase: v => v / 604800 },
      { id: 'month', namebn: 'মাস', symbol: 'মাস', toBase: v => v * 2628000, fromBase: v => v / 2628000 },
      { id: 'year', namebn: 'বছর', symbol: 'বছর', toBase: v => v * 31536000, fromBase: v => v / 31536000 },
    ],
  },
  {
    id: 'data',
    namebn: 'ডেটা স্টোরেজ',
    nameen: 'Data Storage',
    icon: 'hard-drive',
    color: '#BE185D',
    units: [
      { id: 'bit', namebn: 'বিট', symbol: 'বি', toBase: v => v, fromBase: v => v },
      { id: 'byte', namebn: 'বাইট', symbol: 'বাই', toBase: v => v * 8, fromBase: v => v / 8 },
      { id: 'kb', namebn: 'কিলোবাইট', symbol: 'কেবি', toBase: v => v * 8192, fromBase: v => v / 8192 },
      { id: 'mb', namebn: 'মেগাবাইট', symbol: 'এমবি', toBase: v => v * 8388608, fromBase: v => v / 8388608 },
      { id: 'gb', namebn: 'গিগাবাইট', symbol: 'জিবি', toBase: v => v * 8589934592, fromBase: v => v / 8589934592 },
      { id: 'tb', namebn: 'টেরাবাইট', symbol: 'টিবি', toBase: v => v * 8796093022208, fromBase: v => v / 8796093022208 },
    ],
  },
];

export function convert(value: number, fromUnit: Unit, toUnit: Unit): number {
  if (fromUnit.id === toUnit.id) return value;
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
}

export function formatResult(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '০';
  if (value === 0) return '০';
  if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(4);
  }
  const str = parseFloat(value.toPrecision(8)).toString();
  return str;
}

export function toBengaliDigits(str: string): string {
  const map: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return str.replace(/[0-9]/g, d => map[d] || d);
}
