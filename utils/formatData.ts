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
  const hours = String(date.getHours()).padStart(2, '0'); 
  const minutes = String(date.getMinutes()).padStart(2, '0'); 

  return `${hours}:${minutes}`;
}