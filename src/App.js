import React, {useEffect, useState} from 'react';
import './App.css';
import CurrencyRow from './components/CurrencyRow';

const URL = "https://api.exchangeratesapi.io/latest";

function App() {

  const[currOptions, setCurrOptions] = useState([]);
  const[fromCurrency, setFromCurrency] = useState();
  const[toCurrency, setToCurrency] = useState();
  const[exchangeRate, setExchangeRate] = useState();
  const[amount, setAmount] = useState(1);
  const[amountIsFromCurrency, setAmountIsFromCurrency] = useState(true);
  
  let toAmount, fromAmount
  if(amountIsFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else{
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(URL)
    .then(res => res.json())
    .then(data => {

      const firstCurrency = Object.keys(data.rates)[0];
    
      setCurrOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency]);
      

    })

  }, [])


  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){

  fetch(`${URL}?base=${fromCurrency}&symbols=${toCurrency}`)
  .then(res => res.json())
    .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])
 

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountIsFromCurrency(true)

  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountIsFromCurrency(false)

  }

  return (
    <div className="container">
     <header>
       <h1>Quick Currency Converter</h1>
     </header>
     <div className="converter">
       <h2>Convert</h2>
       <CurrencyRow 
       currencyOptions = {currOptions.sort()}
       selectedCurrency= {fromCurrency}
       onChangeCurrency = { e => setFromCurrency (e.target.value)}
       amount = {fromAmount}
       onChangeAmount = {handleFromAmountChange}
       />
       <div className="equal"> = </div>
       <CurrencyRow 
       currencyOptions = {currOptions.sort()}
       selectedCurrency= {toCurrency}
       onChangeCurrency = { e => setToCurrency (e.target.value)}
       amount = {toAmount}
       onChangeAmount = {handleToAmountChange}
       />
     </div>
    </div>
  );
}

export default App;
