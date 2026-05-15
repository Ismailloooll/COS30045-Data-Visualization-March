// ============================================================
// SHARED CONSTANTS — Exercise 6
// ============================================================

// Chart dimensions
const margin = { top: 30, right: 30, bottom: 60, left: 70 };

// Colour scheme per screen technology
const techColors = {
  'LED':  '#10b981',
  'LCD':  '#0ea5e9',
  'OLED': '#f59e0b'
};

// Default bar colour (all)
const barColor = '#16a363';
const barColorMuted = '#d1fae5';

// Filter definitions — used by interactions.js to build buttons
const filters_screen = [
  { id: 'all',  label: 'All',  isActive: true  },
  { id: 'LED',  label: 'LED',  isActive: false },
  { id: 'LCD',  label: 'LCD',  isActive: false },
  { id: 'OLED', label: 'OLED', isActive: false }
];

// Bin generator — shared so interactions.js can reuse it
// Column: energyConsumption
const binGenerator = d3.bin()
  .value(d => d.energyConsumption)
  .thresholds(30);

// Shared scales — declared here, assigned values in histogram.js
let xScale, yScale;

// Shared innerChart reference for histogram (assigned in histogram.js)
let innerChart;

// Shared scales for scatter (assigned in scatter.js)
let xScaleS, yScaleS, innerChartS;

// Colour scale for scatter plot
const colorScale = d3.scaleOrdinal()
  .domain(['LED', 'LCD', 'OLED'])
  .range(['#10b981', '#0ea5e9', '#f59e0b']);