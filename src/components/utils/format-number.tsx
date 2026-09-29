export function formatNumber(number: number): string {
  // Format the number with commas first
  let formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Convert digits to Persian
  const persianDigits: string[] = [
    "۰",
    "۱",
    "۲",
    "۳",
    "۴",
    "۵",
    "۶",
    "۷",
    "۸",
    "۹",
  ];

  formattedNumber = formattedNumber.replace(
    /\d/g,
    (digit) => persianDigits[parseInt(digit)]
  );

  return formattedNumber;
}
