export const formatPriceNumber = (_number) => {
const formatted = new Intl.NumberFormat('en-US').format(parseFloat(_number));
return formatted
}
