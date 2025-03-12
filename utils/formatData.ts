export function formatCurrencyAmount(amount:{currency:string, minorUnits:number}){
  const { currency, minorUnits } = amount
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(minorUnits / 100)
}

export function formatUpperSnakeCaseToTitleString(str:string){
  if (!str) return '';

  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(' '); 
}

export function extractTime(isoString: string){
  if (!isoString) return '';

  const date = new Date(isoString);  

  return date.toLocaleString('en-GB', {dateStyle: "medium",
    timeStyle: "short",});
}