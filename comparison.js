$(document).ready(function(){
    $('.combine').on('change', function(){
        var combinedStates = 'data/' + $('#filter').val() + $('#state1').val() + $('#state2').val() + $('#gender').val() + '.json';
        $('#combinedStates').val(combinedStates);
        console.log(combinedStates);
    });
})

const width = 800,
        height = 700,
        maxRadius = 400;
    
    const formatNumber = d3version4.format(',d');

    const x1 = d3version4.scaleLinear()
        .range([0, 2 * Math.PI])
        .clamp(true);

    const y1 = d3version4.scaleSqrt()
        .range([maxRadius*.1, maxRadius]);

    const color = d3version4.scaleOrdinal(d3version4.schemeCategory20);

    const partition = d3version4.partition();

    const arc = d3version4.arc()
        .startAngle(d => x1(d.x0))
        .endAngle(d => x1(d.x1))
        .innerRadius(d => Math.max(0, y1(d.y0)))
        .outerRadius(d => Math.max(0, y1(d.y1)));

    const middleArcLine = d => {
        const halfPi = Math.PI/2;
        const angles = [x1(d.x0) - halfPi, x1(d.x1) - halfPi];
        const r = Math.max(0, (y1(d.y0) + y1(d.y1)) / 2);

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI;
        if (invertDirection) { angles.reverse(); }

        const path1 = d3version4.path();
        path1.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path1.toString();
    };

    const textFits = d => {
        const CHAR_SPACE = 6;

        const deltaAngle = x1(d.x1) - x1(d.x0);
        const r = Math.max(0, (y1(d.y0) + y1(d.y1)) / 2);
        const perimeter = r * deltaAngle;

        return d.data.name.length * CHAR_SPACE < perimeter;
    };

    function drawGraph(file) {
        d3version4.json(file, (error, root) => {
            d3version4.select('#chart').select('svg').remove();

            if (error) throw error;

            root = d3version4.hierarchy(root);
            root.sum(d => d.size);

            const svg = d3version4.select('#chart').append('svg')
                .style('width', '550')
                .style('height', '550')
                .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
                .on('click', () => focusOn());

            const slice = svg.selectAll('g.slice')
                .data(partition(root).descendants());

            slice.exit().remove();

            const newSlice = slice.enter()
                .append('g').attr('class', 'slice')
                .on('click', d => {
                    d3version4.event.stopPropagation();
                    focusOn(d);
                });

            newSlice.append('title')
                .text(d => d.data.name + '\n' + formatNumber(d.value));
    
            newSlice.append('path')
                .attr('class', 'main-arc')
                .style('fill', d => color((d.children ? d : d.parent).data.name))
                .attr('d', arc);

            newSlice.append('path')
                .attr('class', 'hidden-arc')
                .attr('id', (_, i) => `hiddenArc${i}`)
                .attr('d', middleArcLine);
    
            const text = newSlice.append('text')
                .attr('display', d => textFits(d) ? null : 'none');

            text.append('textPath')
                .attr('startOffset','50%')
                .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
                .text(d => d.data.name)
                .style('fill', 'none')
                .style('stroke', '#fff')
                .style('stroke-width', 5)
                .style('stroke-linejoin', 'round')
                .style('font-size', '15px');

            text.append('textPath')
                .attr('startOffset','50%')
                .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
                .text(d => d.data.name)
                .style('font-size', '15px');

            function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {    
                const transition = svg.transition()
                                    .duration(750)
                                    .tween('scale', () => {
                                        const xd = d3version4.interpolate(x1.domain(), [d.x0, d.x1]),
                                        yd = d3version4.interpolate(y1.domain(), [d.y0, 1]);
                                        return t => { x1.domain(xd(t)); y1.domain(yd(t)); };
                                    });

                transition.selectAll('path.main-arc')
                    .attrTween('d', d => () => arc(d));
        
                transition.selectAll('path.hidden-arc')
                    .attrTween('d', d => () => middleArcLine(d));
        
                transition.selectAll('text')
                    .attrTween('display', d => () => textFits(d) ? null : 'none');
        
                moveStackToFront(d);
    
                function moveStackToFront(elD) {
                    svg.selectAll('.slice').filter(d => d === elD)
                        .each(function(d) {
                            this.parentNode.appendChild(this);
                            if (d.parent) { moveStackToFront(d.parent); }
                        })
                };
            }
        });
    }

    drawGraph('data/ProductivityAlabamaAlaskaAll.json');