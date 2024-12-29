import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { createAltheaMapTokenData, deleteAltheaMapTokenData, updateAltheaMapTokenData } from '../graphql/mutations';
import { onCreateAltheaMapTokenData, onDeleteAltheaMapTokenData, onUpdateAltheaMapTokenData } from '../graphql/subscriptions';
import { listAltheaMapTokenData } from '../graphql/queries';

Amplify.configure({
    API: {
        GraphQL: {
            endpoint: process.env.REACT_APP_APPSYNC_MAP_ENDPOINT,
            region: 'us-east-2',  
            defaultAuthMode: 'apiKey',
            apiKey: process.env.REACT_APP_APPSYNC_MAP_API_KEY,
        }
    }
})
const client = generateClient();


// Send a marker to the DB, returning a promise of the marker's insertion.
export function createMarkerDB(marker) {
    const params = {
        'id': marker.id,
        'description': marker.description,
        'position': JSON.stringify(marker.position),
        'icon': marker.icon
    }
    client.graphql({
        query: createAltheaMapTokenData,
        variables: { input: params }
    });
}

export function updateMarkerDB(marker) {
    if (marker.id == null) return

    const params = {
        'id': marker.id,
        'description': marker.description,
        'position': JSON.stringify(marker.position),
        'icon': marker.icon
    }
    client.graphql({
        query: updateAltheaMapTokenData,
        variables: { input: params }
    });
}

// Attempt to delete a marker, returning a promise of the marker's deletion.
export function deleteMarkerDB(marker) {
    const params = {'id': marker.id}
    client.graphql({
        query: deleteAltheaMapTokenData,
        variables: { input: params }
    });
}

function buildGraphQLSubcription(query, callbackFn) {
    return client
        .graphql({ query: query })
        .subscribe({
            next: ({ data }) => {
                callbackFn(data)
                console.log(data)
            },
            error: (error) => console.warn(error)
        });
}

export function createMarkerSubscription(callbackFn) {
    return buildGraphQLSubcription(onCreateAltheaMapTokenData, callbackFn)
}

export function updateMarkerSubscription(callbackFn) {
    return buildGraphQLSubcription(onUpdateAltheaMapTokenData, callbackFn)
}

export function deleteMarkerSubscription(callbackFn) {
    return buildGraphQLSubcription(onDeleteAltheaMapTokenData, callbackFn)
}

// Fetch all markers in the DB.
export function fetchMarkers() {

    const params = {}    

    return new Promise((resolve) => 
        resolve(
            client.graphql({
                query: listAltheaMapTokenData,
                variables: { input: params }
            })
        )
    )
}