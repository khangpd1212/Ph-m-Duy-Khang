## GetPriority function inefficiency

##### The getPriority function is called repeatedly within the sortedBalances useMemo hook. This function's execution is based on a switch statement with multiple cases. Instead of using switch statement, we use object

#### From

```javascript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};
```

#### To

```javascript
const blockchainPriorities = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain) => {
  return blockchainPriorities[blockchain] || -99;
};
```

## Use a variable that doesn't exist

##### Inside the sortedBalances function, the lhsPriority variable is an undefined, the balancePriority variable must be used instead

#### From

```javascript
	const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		})
```

#### To

```javascript
const sortedBalances = useMemo(() => {
  return balances.filter((balance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (balancePriority > -99) {
      if (balance.amount <= 0) {
        return true;
      }
    }
    return false;
  })
```

## Using the sort function is not good

##### Inside the sortedBalances function, the sort function is not good, We don't need to use if else conditionals, instead we use simpler code

#### From

```javascript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
}, [balances, prices]);
```

#### To

```javascript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority;
    });
}, [balances, prices]);
```

## Mapping inefficiency

##### Because both operations use map to iterate: once to add property 'formatted' and once to render component WalletRow, that is not necessary, we will combine them to map once.

#### From

```javascript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});

const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);
```

#### To

```javascript
const rows = sortedBalances.map((balance, index) => {
  const usdValue = prices[balance.currency] * balance.amount;
  const formatted = balance.amount.toFixed();
  return (
    <WalletRow
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={formatted}
    />
  );
});
```
