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
        console.log('queryResponse', queryResponse)
        console.log('data', data)
        var meas = queryResponse["fields"]["measure_like"];
        var mesID = meas[0]["name"];
        var mesData = data[0][mesID];
        var mesLink = mesData.links;
        var mesRendered = mesData.rendered === undefined ? mesData.value : mesData.rendered;
        var svg = d3.select("#vis")
                    .append("svg")
                    .style('position', 'fixed')
                    .attr('viewBox', '-20 -20 700 800')
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
                number: '100',
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

        function rotateIndicator(input) {
            var angleNumber = null
            if (input > -101 && input < 101) {
                if (input <= -90) {
                    angleNumber = 20
                } 
                if (input > -90 && input <= -67) {
                    angleNumber = 40
                } 
                if (input > -67 && input <= -33) {
                    angleNumber = 60
                }
                if (input > -33 && input <= 1) {
                    angleNumber = 80
                }
                if (input > 1 && input <= 33) {
                    angleNumber = 110
                }
                if (input > 33 && input <= 67) {
                    angleNumber = 140
                }
                if (input > 67 && input <= 100) {
                    angleNumber = 170
                }
            } else {
                angleNumber = 'Out of range!'
            }

            return angleNumber
        };
        var isString = isNaN(rotateIndicator(mesRendered));
        var numberOfint = mesRendered.toString().length;

        svg.append("line")
            .attr("x1", 80)
            .attr("x2", 150)
            .attr("y1", 100)
            .attr("y2", 100)
            .attr("pathLength", 100)
            .attr("stroke-width", 5).attr("stroke", "#333")
            .attr('transform','translate(1 1) rotate(' + rotateIndicator(mesRendered) + ')')
            .attr('transform-origin', '150 100');

        var score = isString ? 
        svg.append("text")
        .attr("dx", 40)
        .attr("dy", 120)
        .style('font-size', '10px')
        .attr("fill", "red")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style('cursor', 'pointer')
        .text('Out of range!, your input must be between -100 to 100') : 
        svg.append("text")
        .attr("dx", numberOfint > 2 ? 120 : 130)
        .attr("dy", 140)
        .style("font-size", "38px")
        .attr("fill", "#333")
        .style("font-family", "Arial, Helvetica, sans-serif")
        .style('cursor', 'pointer')
        .text(mesRendered)
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
  