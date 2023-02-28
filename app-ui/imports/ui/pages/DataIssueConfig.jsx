import React, { useState, useEffect } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo';
import { Collapse, Checkbox, Select } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
import { ConfigScatter } from '../components/ConfigCharts/ConfigScatter';
import { BASE_API } from '../Constants';
import axios from 'axios';
import { DataIssueBar } from '../components/ConfigCharts/DataIssueBar';

const GetOutliers = ({ userid, setOutlierData }) => {
    console.log(userid);
    axios.get(BASE_API + '/checkoutliers/?user=' + userid)
        .then(function (response) {
            console.log(response.data["OutputJson"]);
            setOutlierData(response.data["OutputJson"]);
        }).catch(function (error) {
            console.log(error);
        });
};

export const DataIssueConfig = ({ userid }) => {

    const handleTickClick = (feature) => {
        console.log(feature);
        /*
        const updatedFeature = { ...featureConfig[feature], isSelected: !featureConfig[feature].isSelected }

        setFeatureConfig({
            ...featureConfig,
            [feature]: updatedFeature
        });
        */
    };
    const onOutlierFilter = (value) => {
        console.log(value);
        outlierData.map((item, index) => {
            if (item.feature == value) {
                setOutlierMapData(item);
            }
        });
    };

    const selectGen = (issueName) => (
        <Checkbox onChange={() => { handleTickClick(issueName) }} />
    );

    const [outlierData, setOutlierData] = useState([
        {
            "feature": "No feature",
            "status": false,
        }
    ])
    const [outlierMapData, setOutlierMapData] = useState({
        "actuals": {
            "y_val": [0],
            "x_val": [0]
        },
        "corrected": {
            "y_val": [0],
            "x_val": [0]
        },
        "lower": 0,
        "upper": 0
    })
    useEffect(() => {
        GetOutliers({ userid, setOutlierData });
    }, []);

    return (
        <>
            <div className='config-display-fc-r1'>
                <div className='config-display-fc-r1-text'>
                    {"The following data quality issues have been observed in the training data:"}

                </div>
                <div className='config-display-fc-r1-icon'>
                    <InfoLogo setButtonPopup={false} setChartIndex={0} index={3} />
                </div>
            </div>
            <div className='data-issue-list'>
                <Collapse accordion>
                    <Panel header="Data Outliers" key="1" extra={selectGen("outlier")}>
                        <div className='data-issue-r1'>
                            <span>{"Potential outliers have been found in the training dataset."}</span>
                            <Select
                                defaultValue={"Please select:"}
                                style={{
                                    margin: '0 8px',
                                }}
                                onChange={onOutlierFilter}>

                                {outlierData.map((item, index) => {
                                    if (item.status) {
                                        return (
                                            <Option key={index} value={item.feature}>{item.feature}</Option>
                                        );
                                    }
                                })}
                            </Select>
                        </div>
                        <div className='data-issue-r2'>
                            <div className='di-graph-left'>
                                Before Correction
                                <ConfigScatter x_values={outlierMapData.actuals.x_val} y_values={outlierMapData.actuals.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                            </div>
                            <div className='di-graph-middle'>
                                {"---->"}
                            </div>
                            <div className='di-graph-right'>
                                After Correction
                                <ConfigScatter x_values={outlierMapData.corrected.x_val} y_values={outlierMapData.corrected.y_val} outlierLimit={[outlierMapData.lower, outlierMapData.upper]} />
                            </div>
                        </div>
                        <div className='data-issue-r3'>
                            <p>{"An outlier is data point which is significantly different from majority of the data points and does not follow the general patterns present in the data. Removing outliers can improve the prediction accuracy."}</p>
                        </div>
                    </Panel>
                    <Panel header="Data Correlation" key="2" extra={selectGen("correlation")}>
                        <p>{"Your data has high correlation"}</p>
                    </Panel>
                    <Panel header="Skewed Data" key="3" extra={selectGen("skew")}>
                        <p>{"Your dataset is skewed"}</p>
                    </Panel>
                    <Panel header="Class Imbalance" key="4" extra={selectGen("imbalance")}>
                        <div className='data-issue-r1'>
                            <span>The training data is imbalanced with {64}% {"non-diabetic"} patients and {36}% {"diabetic"} patients.</span>
                        </div>
                        <div className='data-issue-r2'>
                            <div className='di-graph-left'>
                                Before Correction
                                <DataIssueBar x_values={["non-diabetic", "diabetic"]} y_values={[64, 36]} />
                            </div>
                            <div className='di-graph-middle'>
                                {"---->"}
                            </div>
                            <div className='di-graph-right'>
                                After Correction
                                <DataIssueBar x_values={["non-diabetic", "diabetic"]} y_values={[50, 50]} />
                            </div>
                        </div>
                        <div className='data-issue-r3'>
                            <p>{"Class imbalance is an issue in which the predictive model has a higher tendency to generate biased and unfair results towards the majority class. Correcting class imbalance can improve the overall prediction accuracy."}</p>
                        </div>
                    </Panel>
                    <Panel header="Data Drift" key="5" extra={selectGen("drift")}>
                        <p>{"Your dataset is skewed"}</p>
                    </Panel>
                    <Panel header="Overfitting Effect" key="6" extra={selectGen("overfit")}>
                        <p>{"Your dataset is skewed"}</p>
                    </Panel>
                </Collapse>
            </div>
            <div className='config-display-fc-r3'>
                <div className='config-display-fc-r3-text'>
                    * You can auto correct the selected issues and re-train the model Please note that resolving these issues may or may not improve prediction accuracy.
                </div>
                <div className='config-display-fc-r3-item'>
                    <button
                        className="cancel-button"
                        type="submit"
                    >
                        Cancel changes
                    </button>
                    <button
                        className="train-button"
                        type="submit"
                    >
                        {"Autocorrect and Re-train"}
                    </button>
                </div>
            </div>
        </>
    );
};