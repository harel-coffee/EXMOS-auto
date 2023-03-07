from typing import List, Union
from fastapi import FastAPI, Query
from utils import *
from data_model import *
from constants import *
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
# fix ObjectId & FastApi conflict
import pydantic
from bson.objectid import ObjectId
pydantic.json.ENCODERS_BY_TYPE[ObjectId]=str

app = FastAPI()
origins = ["*"]

# Enable CORS in FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def get_root():

	return {'message': 'Welcome to Diabetes Detection API'}



@app.get("/train")
async def train_model():
	x_data, y_data = load_training_data()
	message = training_model(x_data, y_data)

	response = { 
		"StatusCode": 1,
		"StatusMessage": message,
		}

	return response

@app.get("/checkmissingvalues")
async def check_missing_values():
	status_code = 0
	status_message = "Pending execution"
	data, labels = load_training_data()
	checker = detect_missing_values(data)

	if checker:
		status_code = 1
		status_message = "Missing values detected"	
	else:
		status_code = 0
		status_message = "Missing Values not found"	
	
	response = { 
		"StatusCode": status_code,
		"StatusMessage": status_message,
		}

	return response

@app.post("/filterfeatures", response_model=OutputDataModel)
async def retrain_filtered_features(features: FeaturesToInclude):

	data, labels = load_training_data()
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response


@app.post("/filterfeatureranges", response_model=OutputDataModel)
async def filter_feature_ranges(features: FeatureRanges):

	data, labels = load_training_data(features.features_ranges)
	
	status_code, status_message = retrain_selected_features(data, labels, features.features_to_include)

	response = {
		"StatusCode": status_code,
		"StatusMessage": status_message
	}
	return response

@app.post("/validateusers", response_model=OutputwithPayloadDataModel)
async def validate_user(user: ValidateUserModel):

	# Call method to validate user
	code, message, output_json = login_service(user.UserId, user.Cohort)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response


@app.get("/getpredchartvalues/", response_model=OutputwithPayloadDataModel)
async def GetPredictedChartValues(user: str):

	# Call method to get prediction chart value
	code, message, output_json = generate_pred_chart_data(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
		}

	return response

@app.get("/getdatasummaryvalues/", response_model=OutputwithPayloadDataModel)
async def GetDataSummaryValues(user: str):
	# Call method to get data summary value for user
	code, message, output_json = prepare_user_data(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response

@app.get("/getdataquality/", response_model=OutputwithPayloadDataModel)
async def GetDataQuality(user: str):
	# Call method to get data quality value for user
	# code, message, output_json = data_summary_viz(user)

	response = {
		"StatusCode": True,
		"StatusMessage": f"Data quality fetched for user: {user}",
		"OutputJson": {
			"score" : 0.55,
			"quality_class" : "Poor",
			"issues" : ["class imbalance", "outliers", "feature correlation", "data redundancy", "data drift", "data leakage"],
			"issue_val" : [5, 0.2, 2, 0.5, 3, 1]
		}
	}
	return response

@app.get("/getkeyinsights/", response_model=OutputwithPayloadDataModel)
async def GetKeyInsights(user: str):
	# Call method to get data quality value for user
	code, message, output_json = key_insights_gen(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response

@app.get("/getconfigdata/", response_model=OutputwithPayloadDataModel)
async def GetConfigData(user: str):
	# Call method to get configured data and features for user
	code, message, output_json = prepare_user_data(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response

@app.post("/configandretrain", response_model=OutputwithPayloadDataModel)
async def config_and_retrain(config_data: ConfigDataModel):

	# Call method to validate user
	code, message, output_json = retrain_config_data(config_data)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json
	}
	return response

@app.get("/checkoutliers")
async def check_outliers(user: str):
	# Call method to get outlier information for data configured by the user
	code, message, output_json, isOutlier = detect_outliers(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json,
		"isOutlier" : isOutlier
	}
	return response

@app.get("/checkclassimbalance")
async def check_imbalance(user: str):
	# Call method to get class imbalance information for data configured by the user
	code, message, output_json, isImbalance = detect_imbalance(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json,
		"isImbalance" : isImbalance
	}
	return response

@app.get("/checkdatadrift")
async def check_drift(user: str):
	# Call method to data drift information for data configured by the user
	code, message, output_json, isDrift = detect_drift(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json,
		"isDrift" : isDrift
	}
	return response

@app.get("/checkskew")
async def check_skew(user: str):
	# Call method to check skewness information for data configured by the user
	code, message, output_json, isSkew = detect_skew(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json,
		"isSkew" : isSkew
	}
	return response

@app.get("/checkduplicates")
async def check_duplicates(user: str):
	# Call method to check skewness information for data configured by the user
	code, message, output_json, isDuplicate = detect_duplicates(user)

	response = {
		"StatusCode": code,
		"StatusMessage": message,
		"OutputJson": output_json,
		"isDuplicate" : isDuplicate
	}
	return response