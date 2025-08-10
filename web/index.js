import { dates } from '/utils/dates'

const tickersArr = []

const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    const label = document.getElementsByTagName('label')[0]

    if (tickersArr.length >= 3) {
        label.style.color = '#e74c3c'
        label.textContent = '⚠️ Maximum of 3 tickers allowed. Please generate your report or refresh to start over.'
        return
    }

    if (tickerInput.value.length > 2) {
        // Reset label styling
        label.style.color = '#333'
        label.textContent = '📈 Add up to 3 stock tickers below to get a super accurate stock predictions report 👇'

        generateReportBtn.disabled = false
        const newTickerStr = tickerInput.value
        tickersArr.push(newTickerStr.toUpperCase())
        tickerInput.value = ''
        renderTickers()

        // Add some visual feedback
        tickerInput.style.backgroundColor = '#e8f5e8'
        setTimeout(() => {
            tickerInput.style.backgroundColor = ''
        }, 300)
    } else {
        label.style.color = '#e74c3c'
        label.textContent = '❌ You must add at least one ticker. A ticker is a 3+ letter code for a stock (e.g., TSLA for Tesla).'
    }
})

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display')

    if (tickersArr.length === 0) {
        tickersDiv.innerHTML = 'Your tickers will appear here...'
        tickersDiv.style.color = '#999'
        return
    }

    tickersDiv.innerHTML = ''
    tickersDiv.style.color = '#333'

    tickersArr.forEach((ticker, index) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        newTickerSpan.setAttribute('role', 'listitem')
        newTickerSpan.setAttribute('aria-label', `Stock ticker ${ticker}`)

        // Add click to remove functionality
        newTickerSpan.style.cursor = 'pointer'
        newTickerSpan.title = 'Click to remove'
        newTickerSpan.addEventListener('click', () => {
            tickersArr.splice(index, 1)
            renderTickers()
            if (tickersArr.length === 0) {
                generateReportBtn.disabled = true
            }
            // Reset label when ticker is removed
            const label = document.getElementsByTagName('label')[0]
            label.style.color = '#333'
            label.textContent = '📈 Add up to 3 stock tickers below to get a super accurate stock predictions report 👇'
        })

        tickersDiv.appendChild(newTickerSpan)
    })
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

async function fetchStockData() {
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    try {
        const stockData = await Promise.all(tickersArr.map(async (ticker) => {
            const url = `https://polygon-api-worker.r-salehjan.workers.dev?ticker=${ticker}&startDate=${dates.startDate}&endDate=${dates.endDate}`
            const response = await fetch(url)
            if (!response.ok) {
                const errMsg = await response.text()
                throw new Error('Worker error: ' + errMsg)
            }
            apiMessage.innerText = '🤖 Creating your report...'
            return response.text()
        }))
        fetchReport(stockData.join(''))
    } catch (err) {
        loadingArea.innerHTML = `
            <img src="images/loader.svg" alt="error" style="filter: hue-rotate(0deg);">
            <div style="color: #e74c3c; font-weight: 500;">❌ There was an error fetching stock data. Please try again.</div>
        `
        console.error(err.message)
    }
}

async function fetchReport(data) {
    const messages = [
        {
            role: 'system',
            content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'
        },
        {
            role: 'user',
            content: `${data}
            ###
            OK baby, hold on tight! You are going to haate this! Over the past three days, Tesla (TSLA) shares have plummetted. The stock opened at $223.98 and closed at $202.11 on the third day, with some jumping around in the meantime. This is a great time to buy, baby! But not a great time to sell! But I'm not done! Apple (AAPL) stocks have gone stratospheric! This is a seriously hot stock right now. They opened at $166.38 and closed at $182.89 on day three. So all in all, I would hold on to Tesla shares tight if you already have them - they might bounce right back up and head to the stars! They are volatile stock, so expect the unexpected. For APPL stock, how much do you need the money? Sell now and take the profits or hang on and wait for more! If it were me, I would hang on because this stock is on fire right now!!! Apple are throwing a Wall Street party and y'all invited!
            ###
            Apple (AAPL) is the supernova in the stock sky – it shot up from $150.22 to a jaw-dropping $175.36 by the close of day three. We’re talking about a stock that’s hotter than a pepper sprout in a chilli cook-off, and it’s showing no signs of cooling down! If you’re sitting on AAPL stock, you might as well be sitting on the throne of Midas. Hold on to it, ride that rocket, and watch the fireworks, because this baby is just getting warmed up! Then there’s Meta (META), the heartthrob with a penchant for drama. It winked at us with an opening of $142.50, but by the end of the thrill ride, it was at $135.90, leaving us a little lovesick. It’s the wild horse of the stock corral, bucking and kicking, ready for a comeback. META is not for the weak-kneed So, sugar, what’s it going to be? For AAPL, my advice is to stay on that gravy train. As for META, keep your spurs on and be ready for the rally.
            ###
            `
        }
    ]

    try {
        const url = 'https://openai-stock-predictions-worker.r-salehjan.workers.dev'

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages)
        })
        const data = await response.json()

        if (!response.ok) {
            throw new Error(`Worker Error: ${data.error}`)
        }
        renderReport(data.content)
    } catch (err) {
        console.error(err.message)
        loadingArea.innerHTML = `
            <img src="images/loader.svg" alt="error" style="filter: hue-rotate(0deg);">
            <div style="color: #e74c3c; font-weight: 500;">🤖 Unable to access AI. Please refresh and try again.</div>
        `
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = output
    outputArea.style.display = 'flex'
}
