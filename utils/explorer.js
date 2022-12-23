class Explorer {
  constructor(url) {
    this.url = url;
  }

  contractLink(address) {
    return `${this.url}/account/${address}`;
  }

  transactionLink(address) {
    return `${this.url}/tx/${address}`;
  }

  accountLink(address) {
    return `${this.url}/account/${address}`;
  }
}

class AppExplorer {
  constructor(url) {
    this.url = url;
  }

  addLiquidityLink(address1, address2 = '') {
    const params = [address1, address2].filter(Boolean);
    const path = params.length ? params.join('/') : '';

    return `${this.url}/liquidity/add/${path}`;
  }

  swapLink(address1, address2 = '') {
    const input = address1 ? `inputCurrency=${address1}` : '';
    const output = address2 ? `&outputCurrency=${address2}` : '';

    return `${this.url}/swap?${input}${output}`;
  }
}

export const NetworkExplorer = new Explorer(process.env.explorerEndpoint);
export const ExchangeExplorer = new AppExplorer(process.env.exchangeEndpoint);
