import { useCallback, useEffect, useState } from 'react';
import './App.css';
import InputCurrency from './components/InputCurrency';
import ArrowsUpDownIcon from './icons/ArrowsUpDownIcon';

async function getListCurrency() {
  const response = await fetch("https://interview.switcheo.com/prices.json");
  const data = await response.json();
  return data;
}

function App() {
  const [fromCurrency, setFromCurrency] = useState(0);
  const [toCurrency, setToCurrency] = useState(0);
  const [fromTypeCurrency, setFromTypeCurrency] = useState({ value: null, label: '', title: null });
  const [toTypeCurrency, setToTypeCurrency] = useState({ value: null, label: '', title: null });
  const [options, setOptions] = useState([]);
  const [isChangeFromCurrency, setIsChangeFromCurrency] = useState(false);
  const [isChangeToCurrency, setIsChangeToCurrency] = useState(false);


  const onExchangeFromCurrency = useCallback((value) => {
    const exchangeRate = toTypeCurrency?.title / fromTypeCurrency?.title;
    const exchangeCurrency = Number((value * exchangeRate).toFixed(2))
    setToCurrency(exchangeCurrency)
  }, [fromTypeCurrency, toTypeCurrency])

  const onExchangeToCurrency = useCallback((value) => {
    const exchangeRate = fromTypeCurrency?.title / toTypeCurrency?.title;
    const exchangeCurrency = Number((value * exchangeRate).toFixed(2))
    setFromCurrency(exchangeCurrency)
  }, [toTypeCurrency, fromTypeCurrency])

  useEffect(() => {
    isChangeFromCurrency && onExchangeFromCurrency(fromCurrency)
  }, [isChangeFromCurrency, onExchangeFromCurrency, fromCurrency])

  useEffect(() => {
    isChangeToCurrency && onExchangeToCurrency(toCurrency)
  }, [isChangeToCurrency, onExchangeToCurrency, toCurrency])


  useEffect(() => {
    getListCurrency().then((data) => {
      const convertOptions = data?.map((item, index) => ({
        label: item.currency,
        title: item.price,
        value: index,
      }));
      setOptions(convertOptions);
    });
  }, []);

  useEffect(() => {
    setFromTypeCurrency(options?.[0])
    setToTypeCurrency(options?.[1])
  }, [options]);

  const handleSwapUI = () => {
    setFromTypeCurrency(toTypeCurrency)
    setToTypeCurrency(fromTypeCurrency)
  }

  const onChangeFromType = useCallback((value) => setFromTypeCurrency(value), [])
  const onChangeToType = useCallback((value) => setToTypeCurrency(value), [])

  return (
    <div className="wrapper">
      <h1 className='title'>Crypto Swap</h1>
      <div className='container-form'>
        <div className='wrapper-input'>

          <div className='container-input'>
            <p className='input-title'>From</p>
            <InputCurrency value={fromCurrency} onChange={(value) => {
              setFromCurrency(value)
              setIsChangeFromCurrency(true)
              setIsChangeToCurrency(false)
            }}
              onChangeTypeCurrency={onChangeFromType}
              typeCurrency={fromTypeCurrency} optionsCurrency={options} />
            <p className='input-helper'>{fromCurrency} {fromTypeCurrency?.label} = {toCurrency} {toTypeCurrency?.label}</p>
          </div>

          <div className='container-input'>
            <p className='input-title'>To</p>
            <InputCurrency value={toCurrency} onChange={(value) => {
              setToCurrency(value)
              setIsChangeFromCurrency(false)
              setIsChangeToCurrency(true)
            }} onChangeTypeCurrency={onChangeToType} typeCurrency={toTypeCurrency} optionsCurrency={options} />
          </div>

        </div>
        <button className='btn-converter' onClick={handleSwapUI}><i className='icon-converter'><ArrowsUpDownIcon width="3em"
          height="3em" /></i></button>
      </div>
    </div >
  );
}

export default App;
