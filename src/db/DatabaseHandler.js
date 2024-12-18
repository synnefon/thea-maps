import * as AWS from 'aws-sdk';

// Connect to that big bad dynamo db instance.
AWS.config.update({
    region: 'us-east-2',
    endpoint: 'dynamodb.us-east-2.amazonaws.com',
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID
});

// Send a marker to the DB, returning a promise of the marker's insertion.
export function upsertMarker(marker, tableName='althea_map_token_data') {
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: tableName,
        Item: {
            'id': marker.id,
            'description': marker.description,
            'position': marker.position,
            'icon': marker.icon
        }
    }
    return ddb.put(params).promise()
}

// Attempt to delete a marker, returning a promise of the marker's deletion.
export function deleteMarker(marker, tableName='althea_map_token_data') {
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: tableName,
        Key: { 'id': marker.id },
        ReturnValues:"ALL_OLD"
    } 
    ddb.delete(params).promise()
}

// Fetch all markers in the DB.
export function fetchMarkers(tableName='althea_map_token_data') {
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: tableName
    }    

    return new Promise((resolve) => 
        ddb.scan(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                resolve(data)
            }
        })
    )
}
