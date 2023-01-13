export const formatAmount = (amount, decimals = 2) => {
  const val = Number(amount);

  if (Math.trunc(val / 1_000_000) > 0) {
    return `${(val / 1_000_000).toFixed(2)}M`;
  } else if (Math.trunc(val / 1_000) > 0) {
    return `${(val / 1_000).toFixed(2)}K`;
  }

  return String(val.toFixed(decimals));
};

export const formatAddress = (address, length = address.length / 2) => {
  return `${address.slice(0, length / 2)}...${address.slice(-length / 2)}`;
};

export const trimTrailingSlash = (str) => {
  return str.replace(/\/$/, '');
};