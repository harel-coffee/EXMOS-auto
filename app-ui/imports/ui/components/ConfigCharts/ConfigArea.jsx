import { useRef, useState } from 'react';
import React from 'react';
import { Line as LineJS } from 'chart.js/auto';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './ConfigCharts.css';

export const ConfigArea = ({
    y_values,
    x_values,
    defaultLimit,
    selectedLimit,
    isActive,
    name,
    unit,
}) => {

    let filtered_x = x_values.filter((function (value) {
        return value >= selectedLimit[0] && value <= selectedLimit[1];
    }));

    let boundary_val1 = 0;
    let boundary_val2 = 0;

    let boundary_ind1 = 0;
    let boundary_ind2 = 0;

    boundary_val1 = filtered_x[0]
    boundary_val2 = filtered_x[filtered_x.length - 1]

    boundary_ind1 = x_values.indexOf(boundary_val1);
    boundary_ind2 = x_values.indexOf(boundary_val2);

    const chartColor = isActive ? "#67A3FF" : "#C5C4C4";
    const pinColor = isActive ? "#244CB1" : "#C5C4C4";

    const highlightRegion = (ctx) => {
        if (ctx.p0DataIndex >= boundary_ind1 && ctx.p0DataIndex < boundary_ind2) {
            return chartColor;
        }
        else {

            return "#C5C4C4";
        }
    };
    // background color function
    const bgColor = ctx => highlightRegion(ctx);

    let data = {
        labels: x_values,
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 1,
                pointBorderWidth: 1,
                hoverBackgroundColor: 'white',
                pointHoverRadius: 5,
                pointHoverBorderWidth: 3,
                backgroundColor: "#1363DF",
                borderColor: "#1363DF",
                fill: true,
                tension: 0.4,
                segment: {
                    backgroundColor: bgColor,
                    borderColor: bgColor,
                },
            },
        ],
    };

    let options = {
        animation: false,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        let label = "Patient Counts " || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += Math.round((context.parsed.y + Number.EPSILON) * 100) / 100;
                        }
                        return label;
                    },
                    title: function (context) {
                        let label = name + " " || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.label !== null) {
                            label += parseFloat(context[0].label).toFixed(2);
                        }
                        return label + " " + unit;
                    }
                }
            },
        },
        scales: {
            y: {
                display: false,
                beginAtZero: false,
                grid: {
                    display: false
                },
                min: 0,
                max: Math.max.apply(Math, y_values) * 1.2,
                ticks: {
                    labelOffset: 0,
                    padding: 0,
                    color: "#000000",
                    font: {
                        size: 8
                    }
                },
                text: "Count of patients",
            },
            x: {
                offset: true,
                grid: {
                    display: false,
                    borderColor: 'black',
                    drawTicks: false,
                },
                ticks: {
                    padding: 1,
                    color: "#000000",
                    font: {
                        size: 11
                    },
                    callback: (value, index, values) => {
                        if (index == boundary_ind1 || index == boundary_ind2) {
                            return Math.round((x_values[index] + Number.EPSILON) * 10) / 10;
                        }
                    }
                },
                text: "Blood Sugar Measures",
            }
        },
    };

    data.datasets[0].data = y_values;
    data.labels = x_values;
    options.scales.y.max = Math.max.apply(Math, y_values) * 1.2;

    // marker point
    function drawMarker(ctx, top, height, x, y, color, value_marker) {
        ctx.strokeStyle = color;
        ctx.setLineDash([0, 0]);
        ctx.lineDashOffset = 0;

        const markerLength = 0.5 * height;
        const startingPoint = top + (height - markerLength);

        let markerPosition = x.getPixelForValue(value_marker);
        ctx.strokeRect(markerPosition, startingPoint, 0, markerLength);

        const angle = Math.PI / 180;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(markerPosition, startingPoint, 3, angle * 0, angle * 360, false);
        ctx.fill();
        ctx.closePath();
    }

    // plugin block
    const boundaryLines = {
        id: 'boundaryLines',
        afterDatasetDraw(chart, args, option) {
            const { ctx, chartArea: { top, right, bottom, left, width, height }, scales: { x, y } } = chart;
            ctx.save();

            // Lower Boundary Line   
            ctx.strokeStyle = pinColor;
            drawMarker(ctx, top, height, x, y, ctx.strokeStyle, boundary_ind1);
            // Upper Boundary Line   
            drawMarker(ctx, top, height, x, y, ctx.strokeStyle, boundary_ind2);
        }
    }

    const chartRef = useRef();

    return (
        <div className="AreaPlotContainer" style={{ cursor: !isActive ? "not-allowed" : "default" }}>
            <Line
                data={data}
                options={options}
                plugins={[boundaryLines]}
                ref={chartRef}
                redraw={true}
            />
        </div>);
};