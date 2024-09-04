import * as AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'dynamodb.us-east-2.amazonaws.com',
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY_ID
});

export function upsertMarker(marker, tableName='althea_map_token_data') {
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: tableName,
        Item: {
            'id': marker.id,
            'description': marker.description,
            'position': marker.position,
            'color': marker.color
        }
    }
    return ddb.put(params).promise()
}

export function deleteMarker(marker, tableName='althea_map_token_data') {
    const ddb = new AWS.DynamoDB.DocumentClient();

    const params = {
        TableName: tableName,
        Key: { 'id': marker.id },
        ReturnValues:"ALL_OLD"
    } 
    ddb.delete(params).promise()
}

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
