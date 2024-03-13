import './App.css'
import {useEffect, useState} from "react";

type Themes = "switch-on" |  null

const App = () => {
    const [mode, setMode] = useState<Themes>(null)
    const [finallySum, setFinallySum] = useState(0)
    const [currentPrice, setCurrentPrice] = useState<number>(0)
    const toggle = () => setMode((prev) => (prev === "switch-on" ? null : "switch-on"))
    const price = { USD:currentPrice, ETN: "1"}


    const calcSum = (val: number) => {
        let sum = 0;
        sum = val * +price["USD"]
        setFinallySum(Math.ceil((sum / +price["ETN"]) * 100) / 100)
    }


    useEffect(() => {
        const socket = new WebSocket("wss://fstream.binance.com/ws/ethusdt@aggTrade")
        socket.onmessage = event => setCurrentPrice(JSON.parse(event.data).p)
    },[])

    return (
        <main className="wrapper">
            <p className="currentPrice">Current price ETN: {currentPrice}</p>
                <form className="form">
                    <div className="box">
                        <label htmlFor="name" className="label">ETH amount:</label>
                        <input onChange={(e) => calcSum(+e.target.value)}
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
                                <span>You will receive: {finallySum} $</span> :
                                <span>Must give: {finallySum} $</span>}
                        </p>
                    </div>
                </form>
        </main>
    )
}

export default App
