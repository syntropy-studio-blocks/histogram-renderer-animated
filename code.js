import Chart from 'chart.js'

export const run = ({ state, element }) => {
	// set up a data store
  state.data = []
  state.runningMin = null
  state.runningMax = null
  
  // create the canvas
  const c = document.createElement('canvas')
  c.width = element.clientWidth
  c.height = c.width * 0.75
  const ctx = c.getContext('2d')
  element.appendChild(c)
  
  // do some styling
  Chart.defaults.global.defaultFontColor = '#c4cecf'
	Chart.defaults.global.defaultFontFamily = '"IBM Plex Sans Condensed",sans-serif'
  element.style.backgroundColor = 'transparent'
  
  // create the chart
  state.chart = new Chart(ctx, {
    type: 'line',
    data: {
			labels: state.xTicks,
      datasets: [{
				label: 'Input Frequency',
        data: [],
        borderColor: '#188da4',
        backgroundColor: 'rgba(255,255,255,0.05)',
        fill: true
      }]
    },
    options: {
			responsive: true,
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Input Value'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.05)' 
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Frequency'
          },
          gridLines: {
            color: 'rgba(255,255,255,0.05)' 
          }
        }]
      }
    }
  })
}

export const update = ({ state }) => {
  const { numBuckets } = state
  const incomingVal = state.inputStream
  
  // Update the store  
  state.data.push(incomingVal)
  // Update the range
  if(state.runningMin === null || incomingVal < state.runningMin) {
		state.runningMin = incomingVal
  }
  if(state.runningMax === null || incomingVal > state.runningMax) {
		state.runningMax = incomingVal
  }
  const range = state.runningMax - state.runningMin
  const bucketSize = range / numBuckets
  // Update the buckets
  const xTicks = []
  const newData = new Array(numBuckets)
  newData.fill(0)
  for(var i=0; i<numBuckets; i++) {
		const bucketMin = state.runningMin + i * bucketSize
    const bucketMax = bucketMin + bucketSize
    xTicks.push(`${bucketMin.toFixed(2)} - ${bucketMax.toFixed(2)}`)
    state.data.forEach(point => {
      if(point >= bucketMin && point < bucketMax) {
       	newData[i] += 1
      }
    })
  }
  
  // Update the chart
  state.chart.data.datasets[0].data = newData
  state.chart.data.labels = xTicks
  state.chart.update()
  
}

