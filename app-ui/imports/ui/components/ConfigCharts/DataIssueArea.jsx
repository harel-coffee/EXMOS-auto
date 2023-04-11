import { useRef, useState } from 'react';
import React from 'react';
import { Line as LineJS } from 'chart.js/auto';
import { Line, getElementsAtEvent } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './ConfigCharts.css';

export const DataIssueArea = ({
    y_values,
    x_values,
    color1,
    color2
}) => {

    const highlightRegion = (ctx) => {
        return color2;
    };
    // background color function
    const bgColor = ctx => highlightRegion(ctx);

    let data = {
        labels: x_values,
        datasets: [
            {
                label: 'Count',
                data: y_values,
                pointRadius: 3,
                pointBorderWidth: 1,
                hoverBackgroundColor: 'white',
                pointHoverRadius: 5,
                pointHoverBorderWidth: 3,
                backgroundColor: color1,
                borderColor: color1,
                fill: true,
                tension: 0.4,
                segment: {
                    backgroundColor: bgColor,
                    borderColor: color1,
                },
            },
        ],
    };

    let options = {
        animation: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: false,
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
                        if (index == 0 || index == x_values.length - 1) {
                            return Math.round((x_values[index] + Number.EPSILON) * 10) / 10;
                        }
                    }
                },
                text: "Measures",
            }
        },
    };

    data.datasets[0].data = y_values;
    data.labels = x_values;
    options.scales.y.max = Math.max.apply(Math, y_values) * 1.1;

    const chartRef = useRef();

    return (
        <div className="DataIssueBarContainer">
            <Line
                data={data}
                options={options}
                ref={chartRef}
                redraw={true}
            />
        </div>);
};