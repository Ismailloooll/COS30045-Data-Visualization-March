// ============================================================
// INTERACTIONS — Exercise 6
// 6.1: Filter buttons for histogram
// 6.2: Tooltip for scatter plot
// ============================================================


// ============================================================
// EXERCISE 6.1 — FILTER BUTTONS
// ============================================================

function populateFilters(data) {

  const container = document.getElementById('filter-buttons');
  if (!container) return;

  // Step 7.3: Create buttons from filters_screen array
  const buttons = d3.select('#filter-buttons')
    .selectAll('button')
    .data(filters_screen)
    .join('button')
    .attr('class', d => {
      if (d.isActive && d.id === 'all') return 'filter-btn active';
      return 'filter-btn';
    })
    .text(d => d.label);

  // Event listener for click
  buttons.on('click', function(event, d) {

    // Update isActive state
    filters_screen.forEach(f => {
      if (f.id === d.id) {
        f.isActive = !f.isActive;
        // If clicking All, deactivate others
        if (d.id === 'all') { f.isActive = true; }
      } else {
        if (d.id === 'all') { f.isActive = false; }
        else if (f.id === 'all') { f.isActive = false; }
      }
    });

    // If nothing active, set All to active
    const anyActive = filters_screen.filter(f => f.id !== 'all').some(f => f.isActive);
    if (!anyActive) {
      filters_screen.find(f => f.id === 'all').isActive = true;
    }

    // Update button classes
    d3.select('#filter-buttons').selectAll('button')
      .data(filters_screen)
      .attr('class', f => {
        if (!f.isActive) return 'filter-btn';
        if (f.id === 'all') return 'filter-btn active';
        if (f.id === 'LED')  return 'filter-btn active-led';
        if (f.id === 'LCD')  return 'filter-btn active-lcd';
        if (f.id === 'OLED') return 'filter-btn active-oled';
        return 'filter-btn active';
      });

    // Determine which tech filters are active
    const activeTechs = filters_screen.filter(f => f.isActive && f.id !== 'all').map(f => f.id);
    const showAll = filters_screen.find(f => f.id === 'all').isActive;

    // Pass active id to update histogram
    updateHistogram(d.id, data);
  });


  // Step 7.4: Update histogram function
  function updateHistogram(activeId, data) {

    // Filter data based on active buttons
    const activeTechs = filters_screen.filter(f => f.isActive && f.id !== 'all').map(f => f.id);
    const showAll = filters_screen.find(f => f.id === 'all').isActive;

    let updatedData;
    if (showAll || activeTechs.length === 0) {
      updatedData = data;
    } else {
      updatedData = data.filter(d => activeTechs.includes(d.screenTech));
    }

    // Generate updated bins
    const updatedBins = binGenerator(updatedData);

    // Update y scale domain
    yScale.domain([0, d3.max(updatedBins, d => d.length) * 1.15]);

    // Determine bar colour based on active filter
    let fillColor = barColor;
    if (activeTechs.length === 1) {
      fillColor = techColors[activeTechs[0]] || barColor;
    }

    // Update bars with smooth transition
    innerChart.selectAll('.bar')
      .data(updatedBins)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.x0) + 1)
      .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
      .attr('rx', 3)
      .attr('fill', fillColor)
      .transition().duration(500).ease(d3.easeCubicInOut)
      .attr('y', d => yScale(d.length))
      .attr('height', d => {
        const cont = document.getElementById('histogram-container');
        const H = 440;
        const h = H - margin.top - margin.bottom;
        return h - yScale(d.length);
      });

    // Update left axis
    innerChart.select('.y-axis')
      .transition().duration(500)
      .call(d3.axisLeft(yScale).ticks(6));
  }
}


// ============================================================
// EXERCISE 6.2 — TOOLTIP
// ============================================================

function createTooltip(data) {

  const tip = document.getElementById('tip');

  // Attach mouse events to all scatter dots
  handleMouseEvents(tip);
}

function handleMouseEvents(tip) {

  // Select all circles in the scatter plot
  d3.selectAll('.dot')
    .on('mouseenter', function(event, d) {

      console.log('Mouse enter:', d);

      // Highlight dot
      d3.select(this)
        .transition().duration(100)
        .attr('r', 8)
        .attr('opacity', 1)
        .attr('stroke-width', 2);

      // Get circle position
      const cx = +this.getAttribute('cx');
      const cy = +this.getAttribute('cy');

      // Show tooltip
      tip.style.opacity = 1;
      tip.innerHTML = `
        <b>${d.brand.toUpperCase()} ${d.model}</b>
        Tech: ${d.screenTech}<br>
        Size: ${d.screenSize}"<br>
        Energy: ${d.energyConsumption} kWh/yr<br>
        Stars: ★${d.star}
      `;
    })
    .on('mousemove', function(event) {
      tip.style.left = (event.clientX + 14) + 'px';
      tip.style.top  = (event.clientY - 10) + 'px';
    })
    .on('mouseleave', function() {
      console.log('Mouse leave');

      d3.select(this)
        .transition().duration(100)
        .attr('r', 4.5)
        .attr('opacity', 0.65)
        .attr('stroke-width', 0.5);

      tip.style.opacity = 0;
    });
}