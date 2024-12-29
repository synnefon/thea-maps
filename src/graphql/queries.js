/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAltheaMapTokenData = /* GraphQL */ `
  query GetAltheaMapTokenData($id: String!) {
    getAltheaMapTokenData(id: $id) {
      id
      description
      icon
      position
      __typename
    }
  }
`;
export const listAltheaMapTokenData = /* GraphQL */ `
  query ListAltheaMapTokenData(
    $filter: TableAltheaMapTokenDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAltheaMapTokenData(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        description
        icon
        position
        __typename
      }
      nextToken
      __typename
    }
  }
`;
