const visObject = {
    updateAsync: function (
      data,
      element,
      config,
      queryResponse,
      details,
      doneRendering
    ) {
        element.innerHTML = "";

        var meas = queryResponse["fields"]["measure_like"];
        var mesID = meas[0]["name"];
        var mesData = data[0][mesID];
        var mesLink = mesData.links;
        var mesRendered = mesData.rendered === undefined ? mesData.value : mesData.rendered;
        var svg = d3.select("#vis")
                    .append("svg")
                    .style('position', 'fixed')
                    .attr('viewBox', '-20 -20 350 160')
                    .attr('preserveAspectRatio', 'xMidYMid meet');
        const slices = [
            {
                starts: -1.48999 * Math.PI/3,
                ends: -0.5 * Math.PI/3,
                color: 'rgb(228, 86, 33)'
            },
            {
                starts: -0.5 * Math.PI/3,
                ends: 0.5 * Math.PI/3,
                color: 'rgb(252, 207, 132)'
            },
            {
                starts: 0.5 * Math.PI/3,
                ends: 1.5 * Math.PI/3,
                color: 'rgb(85, 158, 56)'
            },
        ];
        const texts = [
            {
                number: '-100',
                x: 15,
                y: 90
            }, 
            {
                number: '+100',
                x: 255,
                y: 90
            }
        ];

        svg.append("g").attr("transform", "translate(150,100)");

        var arcGenerator = slices.map(d => {
            d3.select("#vis g")
            .append("path")
            .attr("d", 
                d3.arc()
                .innerRadius(35)
                .outerRadius(100)
                .startAngle(d.starts)
                .endAngle(d.ends)
            )
            .attr("fill", d.color)
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .style('cursor', 'pointer')
            .on("click", function (d, i) {
                LookerCharts.Utils.openDrillMenu({
                    links: mesLink,
                    event: event,
                });
            });
        });

        var sideText = texts.map(d => {
            svg.append("text")
            .attr("dx", d.x)
            .attr("dy", d.y)
            .style("font-size", "15px")
            .attr("fill", "#333")
            .style("font-family", "Arial, Helvetica, sans-serif")
            .text(d.number);
        });

        // compare the input number with the first range against the second range
        function convertRange( input, range1, range2 ) {
            // check if the input is less than 100 or more than -100
            if (input > (range1[0] - 0.1) && input < (range1[1] + 0.1) ) {
                return ( input - range1[ 0 ] ) * ( range2[ 1 ] - range2[ 0 ] ) / ( range1[ 1 ] - range1[ 0 ] ) + range2[ 0 ]
            } else {
                return 'Out of range!'
            }
        }

        var isString = isNaN(convertRange(mesRendered, [-100, 100], [0, 180]));
        var numberOfint = mesRendered.toString().length;

        svg.append("line")
            .attr("x1", 80)
            .attr("x2", 150)
            .attr("y1", 100)
            .attr("y2", 100)
            .attr("pathLength", 100)
            .attr("stroke-width", 5).attr("stroke", "#333")
            .attr('transform','translate(1 1) rotate(' + convertRange(mesRendered, [-100, 100], [0, 180]) + ')')
            .attr('transform-origin', '150 100');

        var score = 
        svg.append("text")
        .attr("dx", isString ? 40 : (numberOfint > 2 ? 120 : 130))
        .attr("dy", isString ? 120 : 140)
        .style("font-size", isString ? '10px' : "38px")
        .attr("fill", isString ? "red" :"#333")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style('cursor', 'pointer')
        .text(isString ? 'Out of range!, your input must be between -100 to 100' : mesRendered)
        .on("click", function (d, i) {
            LookerCharts.Utils.openDrillMenu({
                links: mesLink,
                event: event,
            });
        });
  
      doneRendering();
    },
  };
  
  looker.plugins.visualizations.add(visObject);
  