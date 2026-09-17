export interface Country {
  code: string;
  name: string;
  dial: string;
}

export const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "JO", name: "Jordan", dial: "+962" },
  { code: "MA", name: "Morocco", dial: "+212" },
];
