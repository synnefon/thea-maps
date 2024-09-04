import * as AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-2',
    endpoint: 'dynamodb.us-east-2.amazonaws.com',
    accessKeyId: "BLAH",
    secretAccessKey: "BLAH"
});

const ddb = new AWS.DynamoDB();
const ddbClient = new AWS.DynamoDB.DocumentClient();

export function upsertMarker(marker, tableName='althea_map_token_data') {
    const params = {
        TableName: tableName,
        Item: {
            'id': marker.id,
            'description': marker.description,
            'position': marker.position,
            'color': marker.color
        }
    }
    return ddbClient.put(params).promise()
}

export function deleteMarker(marker, tableName='althea_map_token_data') {
    const params = {
        TableName: tableName,
        Key: { 'id': marker.id },
        ReturnValues:"ALL_OLD"
    } 
    ddbClient.delete(params).promise()
}

export function fetchMarkers(tableName='althea_map_token_data') {
    const params = {
        TableName: tableName
    }    

    return new Promise((resolve) => 
        ddbClient.scan(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                resolve(data)
            }
        })
    )
}
