export const defaultLocale = 'en-GB' //set to en-GB since starling is based in UK

export function formatCurrencyAmount(amount:{currency:string, minorUnits:number}){
  const { currency, minorUnits } = amount
  return new Intl.NumberFormat(defaultLocale, {
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

  return date.toLocaleTimeString(defaultLocale, 
    {timeStyle: "short"});
}

export function extractDate(isoString: string){
  if (!isoString) return '';

  const date = new Date(isoString.split('T')[0])

  return date.toLocaleDateString(defaultLocale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}