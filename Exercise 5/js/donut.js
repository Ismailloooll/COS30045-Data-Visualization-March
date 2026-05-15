// DONUT — Energy by tech all sizes
(function() {
  const tip = document.getElementById('tip');
  const C = ['#10b981','#0ea5e9','#f59e0b'];

  d3.csv('data/Ex5_TV_energy_Allsizes_byScreenType.csv', d => ({
    tech: d['Screen_Tech'],
    value: +d['Mean(Labelled energy consumption (kWh/year))']
  })).then(data => {
    const cont = document.getElementById('donut-container');
    const W = Math.max(cont.clientWidth||0, 340);
    const H = 320;
    const cx = W*0.44, cy = H/2;
    const OR = Math.min(cx, cy) - 20;
    const IR = OR * 0.52;

    const cSc = d3.scaleOrdinal().domain(data.map(d=>d.tech)).range(C);
    const pie = d3.pie().value(d=>d.value).sort(null).padAngle(0.025);
    const arc = d3.arc().innerRadius(IR).outerRadius(OR).cornerRadius(5);
    const arcH = d3.arc().innerRadius(IR).outerRadius(OR+12).cornerRadius(5);

    const svg = d3.select('#donut-container').append('svg').attr('viewBox',`0 0 ${W} ${H}`);
    const g = svg.append('g').attr('transform',`translate(${cx},${cy})`);

    // Background ring
    g.append('circle').attr('r',OR+2).attr('fill','none').attr('stroke','#f0f0f0').attr('stroke-width',2);

    const sl = g.selectAll('.sl').data(pie(data)).join('g').attr('class','sl');

    sl.append('path')
      .attr('fill', d=>cSc(d.data.tech))
      .attr('stroke','#fff').attr('stroke-width',3)
      .style('cursor','pointer')
      .transition().duration(1000).delay((_,i)=>i*180)
      .attrTween('d', function(d){ const i=d3.interpolate({startAngle:0,endAngle:0},d); return t=>arc(i(t)); });

    sl.select('path')
      .on('mouseover',function(e,d){
        d3.select(this).transition().duration(150).attr('d',arcH);
        tip.style.opacity=1;
        tip.innerHTML=`<b>${d.data.tech}</b>Mean: ${Math.round(d.data.value)} kWh/yr<br>${Math.round(d.data.value/d3.sum(data,d=>d.value)*100)}% of total`;
      })
      .on('mousemove',e=>{ tip.style.left=(e.clientX+14)+'px'; tip.style.top=(e.clientY-10)+'px'; })
      .on('mouseout',function(){ d3.select(this).transition().duration(150).attr('d',arc); tip.style.opacity=0; });

    // Centre text
    g.append('text').attr('text-anchor','middle').attr('dy','-0.4em')
      .style('font-family','Syne,sans-serif').style('font-weight','800').style('font-size','15px').style('fill','#333')
      .text('Mean');
    g.append('text').attr('text-anchor','middle').attr('dy','1.1em')
      .style('font-family','Inter,sans-serif').style('font-size','12px').style('fill','#aaa')
      .text('kWh / year');

    // Legend right side
    const lx = cx*1.68, ly = cy - (data.length*44)/2;
    const leg = svg.append('g').attr('transform',`translate(${lx},${ly})`);
    data.forEach((d,i)=>{
      const row = leg.append('g').attr('transform',`translate(0,${i*48})`);
      row.append('rect').attr('width',14).attr('height',14).attr('rx',4).attr('fill',cSc(d.tech));
      row.append('text').attr('x',20).attr('y',12).style('font-family','Syne,sans-serif').style('font-weight','700').style('font-size','14px').style('fill','#222').text(d.tech);
      row.append('text').attr('x',20).attr('y',28).style('font-family','Inter,sans-serif').style('font-size','12px').style('fill','#aaa').text(`${Math.round(d.value)} kWh/yr`);
    });
  }).catch(e=>console.log('donut:',e));
})();