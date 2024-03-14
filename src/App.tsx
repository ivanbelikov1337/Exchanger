import './App.css'
import {useCallback, useEffect, useState} from "react";

type Themes = "switch-on" |  null

const App = () => {
    const [mode, setMode] = useState<Themes>(null)
    const [enterValue, setEnterValue] = useState<number>(0)
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const toggle = () => setMode((prev) => (prev === "switch-on" ? null : "switch-on"))

    useEffect(() => {
        const socket = new WebSocket("wss://fstream.binance.com/ws/ethusdt@bookTicker")
        calcSum()
        socket.onmessage = event => {
            !mode ?  setCurrentPrice(JSON.parse(event.data).a) : setCurrentPrice(JSON.parse(event.data).b)
        }
        return () => socket.close()
    },[])

    const calcSum = useCallback(() => {
        return currentPrice * enterValue
    }, [currentPrice, mode,enterValue])

    return (
        <main className="wrapper">
            <p className="currentPrice">Current price ETN: {currentPrice} $</p>
                <form className="form">
                    <div className="box">
                        <label htmlFor="name" className="label">ETH amount:</label>
                        <input onChange={(e) => setEnterValue(+e.target.value)}
                               className="input"
                               type="number"
                        />
                    </div>
                    <div className="box">
                        <label htmlFor="name" className="label">Action:</label>
                        <div className="selector">
                            <span onClick={toggle} className={`switch-btn ${mode}`}></span>
                            {!mode ? <span>Sell</span> : <span>Buy</span>}
                        </div>
                    </div>
                    <div className="box">
                        <p className="label">
                            {!mode ?
                                <span>You will receive: {calcSum()} $</span> :
                                <span>Must give: {calcSum()} $</span>}
                        </p>
                    </div>
                </form>
        </main>
    )
}

export default App
