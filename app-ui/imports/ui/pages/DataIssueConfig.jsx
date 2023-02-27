import React, { useState } from 'react';
import { InfoLogo } from '../components/Icons/InfoLogo';
import { Collapse, Checkbox, Select } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;

export const DataIssueConfig = () => {

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
    const onOutlierFilter = () => {
        console.log("filter selected");
    };

    const selectGen = (issueName) => (
        <Checkbox onChange={() => { handleTickClick(issueName) }}/>
      );

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
                                value={"feature 1"}
                                style={{
                                    margin: '0 8px',
                                }}
                                onChange={onOutlierFilter}
                            >
                                <Option value="f1">feature 1</Option>
                                <Option value="f2">feature 2</Option>
                            </Select>
                        </div>
                        <div className='data-issue-r2'>
                            <p>{"Graphs"}</p>
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
                        <p>{"Your dataset class is imbalanced"}</p>
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